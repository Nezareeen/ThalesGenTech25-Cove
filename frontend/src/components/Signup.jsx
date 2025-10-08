import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

function Signup({ onSuccess, onBack, onLogin }) {
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8050/api/auth/signup', form);
      // On success, we can store token and call onSuccess
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        onSuccess && onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    // Placeholder: Integrate Google Sign-In in frontend (e.g., google identity services)
    alert('Google Sign-In not hooked up yet.');
  };

  return (
    <div className="signup-page">
      {/* Background video */}
      <video className="signup-bg" autoPlay loop muted playsInline preload="auto">
        <source src="https://cdn.pixabay.com/video/2023/01/19/147192-790996333_large.mp4" type="video/mp4" />
      </video>

      <div className="signup-glass">
        <h2 className="signup-heading">Sign up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input name="fullName" placeholder="Full name" value={form.fullName} onChange={handleChange} />
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Set password" value={form.password} onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} />

          {error && <div className="error">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Creating...' : 'Submit'}</button>
        </form>

        <div className="divider">Continue with Google!</div>
        <button className="google-btn" onClick={handleGoogle}>G</button>

        <div className="back-link" onClick={onBack}>Back</div>
      </div>

      <div className="signup-info">
        <h1 className="brand-name">Cove.</h1>
        <p className="brand-desc">Cove: A cove is a small, sheltered bay or inlet, often a <strong>safe and tranquil place</strong>. This name perfectly encapsulates the app's purpose of providing a <strong>secure, reliable, and personalized refuge</strong> from uncertainty, guiding users to the <strong>best and safest experiences</strong>.</p>

        <a className="login-link" onClick={onLogin || onBack}>Login ▸</a>
      </div>
    </div>
  );
}

export default Signup;
