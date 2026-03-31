'use client';

import { useState } from 'react';
import { submitLead } from './actions';

export default function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const result = await submitLead(formData);

    if (!result.success && result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card text-center" style={{ padding: '6rem 2rem' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0px 10px 15px rgba(129, 178, 154, 0.5))' }}>✨</div>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>Request Received.</h2>
        <p style={{ marginTop: '1rem', color: 'var(--muted)', fontSize: '1.2rem', maxWidth: '400px', margin: '1rem auto 3rem auto' }}>
          Thank you for trusting us with your home. Our specialist will review your request and reach out within 24 hours.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="btn btn-primary" 
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Start Your Project</h2>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
          Fill out the details below for a fast, free estimate.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        
        <div className="form-group">
          <input type="text" id="full_name" name="full_name" required placeholder=" " />
          <label htmlFor="full_name">Legal Full Name</label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group">
            <input type="email" id="email" name="email" required placeholder=" " />
            <label htmlFor="email">Email Address</label>
          </div>
          <div className="form-group">
            <input type="tel" id="phone" name="phone" placeholder=" " />
            <label htmlFor="phone">Phone Number (Optional)</label>
          </div>
        </div>

        <div className="form-group">
          <select id="service_type" name="service_type" required defaultValue="">
            <option value="" disabled hidden></option>
            <option value="Plumbing">💧 Plumbing</option>
            <option value="Electrical">⚡ Electrical</option>
            <option value="Carpentry">🔨 Carpentry</option>
            <option value="Furniture Assembly">🪑 Furniture Assembly</option>
            <option value="Painting">🎨 Painting</option>
            <option value="General Maintenance">🔧 General Maintenance</option>
            <option value="Other">❓ Other</option>
          </select>
          <label htmlFor="service_type">Service Requested</label>
        </div>

        <div className="form-group" style={{ marginBottom: '3rem' }}>
          <textarea id="message" name="message" rows={5} required placeholder=" "></textarea>
          <label htmlFor="message">Detailed Project Description</label>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid #f87171' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <button type="submit" className="btn btn-accent animate-fade-in animate-delay-2" style={{ padding: '1.25rem', fontSize: '1.1rem' }} disabled={loading}>
          {loading ? 'Sending Request...' : 'Get My Quote'}
        </button>
      </form>
    </div>
  );
}
