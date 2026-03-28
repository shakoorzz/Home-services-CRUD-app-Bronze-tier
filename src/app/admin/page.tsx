'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface Lead {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      if (!token || token !== 'vibe_handyman_bronze_2026') {
        setLoading(false);
        setIsAdmin(false);
        return;
      }

      // In the Bronze tier, we use the token to authorize the request via RLS.
      // We create a scoped client to pass the 'x-admin-token' header.
      const { data, error: fetchError } = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { 'x-admin-token': token } } }
      )
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setIsAdmin(false);
      } else {
        setLeads(data || []);
        setIsAdmin(true);
      }
      setLoading(false);
    }

    fetchLeads();
  }, [token]);

  const updateStatus = async (id: string, status: Lead['status']) => {
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (!updateError) {
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    }
  };

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', marginTop: '10rem' }}>
      <div className="animate-pulse">Loading Admin Dashboard...</div>
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="container text-center" style={{ marginTop: '10rem' }}>
        <h1 style={{ color: '#ef4444', fontSize: '3rem' }}>🔒</h1>
        <h2 style={{ marginTop: '1rem' }}>Unauthorized Access</h2>
        <p style={{ marginTop: '1rem', color: 'var(--muted)', maxWidth: '500px', margin: '1rem auto' }}>
          This inbox is protected. Please use your private <strong>Magic Link</strong> to manage your leads.
        </p>
        <a href="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Home</a>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Admin Inbox</h1>
          <p style={{ color: 'var(--muted)' }}>You have {leads.length} active leads in the Bronze Tier</p>
        </div>
        <div className="badge badge-new" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', border: '1px solid #bbf7d0' }}>
          ✨ Bronze Specialist Mode
        </div>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
          ⚠️ Error: {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: '2rem' }}>
        {leads.length === 0 ? (
          <div className="card text-center" style={{ padding: '5rem 2rem' }}>
             <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📩</div>
             <h2 style={{ color: 'var(--muted)' }}>Your inbox is empty.</h2>
             <p style={{ color: 'var(--muted)' }}>Once clients submit the form on your homepage, they will appear here instantly.</p>
          </div>
        ) : (
          leads.map(lead => (
            <div key={lead.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '4px', 
                  height: '100%', 
                  backgroundColor: lead.status === 'new' ? 'var(--accent)' : 'var(--muted)' 
                }} 
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{lead.full_name}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                    Received {new Date(lead.created_at).toLocaleDateString()} at {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`badge badge-${lead.status}`} style={{ fontSize: '0.7rem' }}>{lead.status}</span>
                  <select 
                    value={lead.status} 
                    onChange={(e) => updateStatus(lead.id, e.target.value as Lead['status'])}
                    className="btn"
                    style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem', border: '1px solid var(--border)' }}
                  >
                    <option value="new">Mark as New</option>
                    <option value="contacted">Mark as Contacted</option>
                    <option value="closed">Mark as Closed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem', padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius)' }}>
                <div>
                  <label>Service Type</label>
                  <p style={{ fontWeight: '600' }}>{lead.service_type}</p>
                </div>
                <div>
                  <label>Email Address</label>
                  <p style={{ fontWeight: '600' }}>{lead.email}</p>
                </div>
                <div>
                  <label>Phone Number</label>
                  <p style={{ fontWeight: '600' }}>{lead.phone || 'Not provided'}</p>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label>Project Details</label>
                <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', color: '#334155' }}>
                  {lead.message}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href={`mailto:${lead.email}`} className="btn btn-primary" style={{ flex: 1, minWidth: '150px' }}>
                  📧 Reply via Email
                </a>
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} className="btn btn-accent" style={{ flex: 1, minWidth: '150px' }}>
                    📞 Call Client
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="container">Loading Dashboard...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
