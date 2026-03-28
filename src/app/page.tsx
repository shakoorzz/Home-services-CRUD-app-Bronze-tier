'use client';

import LeadForm from './LeadForm';

export default function Home() {
  return (
    <main className="container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative organic background blobs */}
      <div className="blob-decor"></div>
      <div 
        className="blob-decor" 
        style={{ 
          top: '40%', 
          left: '-20%', 
          background: 'radial-gradient(circle, rgba(129,178,154,0.15) 0%, rgba(250,250,248,0) 70%)' 
        }} 
      ></div>

      <header className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '5rem', marginTop: '3rem' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', marginBottom: '1.5rem', lineHeight: '1.05', color: 'var(--primary)' }}>
          Home Repairs, <br/>
          <span style={{ color: 'var(--accent)' }}>Masterfully Done.</span>
        </h1>
        <p style={{ maxWidth: '650px', margin: '0 auto', color: 'var(--muted)', fontSize: '1.25rem', fontWeight: '500' }}>
          We blend honest pricing with expert craftsmanship. Fast, reliable, and premium handyman services for spaces you love living in.
        </p>
      </header>

      <section className="animate-fade-in animate-delay-1" style={{ maxWidth: '850px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        <LeadForm />
      </section>

      <footer className="animate-fade-in animate-delay-3" style={{ marginTop: '6rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
        <p>&copy; {new Date().getFullYear()} Handyman Specialists. Crafted with care.</p>
      </footer>
    </main>
  );
}
