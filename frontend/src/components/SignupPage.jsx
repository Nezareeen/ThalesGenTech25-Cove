import React, { useState, useRef, useEffect } from 'react';
import './SignupPage.css';

function SignupPage({ onBack }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      const p = v.play();
      if (p && p.catch) p.catch(() => { /* ignore autoplay rejection */ });
    }
    // prevent body scrolling while the signup overlay is visible
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.email || !form.password || !form.confirm) {
      setError('Please fill out all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    // Placeholder for actual signup behaviour (API call)
    setSubmitted(true);
  };

  return (
    <div className="signup-page">
      <video
        ref={videoRef}
        className="bg-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        webkit-playsinline="true"
      >
        <source src="https://cdn.pixabay.com/video/2023/01/19/147192-790996333_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* build an inline SVG mask data URL so we can reliably use it as a CSS mask */}
      {/* The SVG uses white background and black text; in a CSS mask, black areas will be transparent */}
      {/**/}
      <div className="signup-layout">
        <aside className="signup-form-sect">
          <div className="glass-panel">
            <h2>Create your account</h2>

            {submitted ? (
              <div className="success">
                <p>Thanks for signing up, {form.username || 'friend'}!</p>
                <button onClick={onBack}>Back</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="signup-form">
                <input
                  name="username"
                  value={form.username}
                  onChange={onChange}
                  placeholder="Username"
                  aria-label="Username"
                  autoComplete="username"
                />

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Email"
                  aria-label="Email"
                  autoComplete="email"
                />

                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Set password"
                  aria-label="Set password"
                  autoComplete="new-password"
                />

                <input
                  name="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={onChange}
                  placeholder="Confirm password"
                  aria-label="Confirm password"
                  autoComplete="new-password"
                />

                {error && <div className="error">{error}</div>}

                <button className="primary" type="submit">Sign up</button>

                <div className="or-row">or</div>

                <button type="button" className="google">Continue with Google</button>

                <div className="small">
                  Already have an account? <button type="button" className="linkish" onClick={onBack}>Sign in</button>
                </div>
              </form>
            )}

          </div>
        </aside>

        <main className="branding-sect">
          <div className="branding-inner">
            <h1 className="branding-title">Cove.</h1>
            <p className="branding-sub">Explore weather, places and more with Cove.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SignupPage;
