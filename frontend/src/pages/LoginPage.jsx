import React from 'react';
import PropTypes from 'prop-types';
import LiquidGlass from 'liquid-glass-react';
import './LoginPage.css';

const LoginPage = ({ onBack }) => {
  return (
    <main className="login-root">
      <section className="branding-pane">
        <div className="branding-overlay" />
        <div className="branding-content">
          <h1 className="branding-titlelogin">Cove.</h1>
        </div>
      </section>

      <section className="form-pane">
        <LiquidGlass
          className="form-glass"
          padding="20px 24px"
          cornerRadius={20}
          displacementScale={36}
          blurAmount={0.08}
          saturation={120}
          aberrationIntensity={1.2}
          elasticity={0.3}
        >
          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <h2 className="form-title">Welcome back</h2>
            <label className="field">
              <span>Username or Email</span>
              <input type="text" placeholder="you@example.com" required />
            </label>
            <label className="field">
              <span>Password</span>
              <input type="password" placeholder="••••••••" required />
            </label>

            <button type="submit" className="btn primary">Login</button>
            <button type="button" className="btn google">Continue with Google</button>

            <button type="button" className="link" onClick={() => alert('Forgot password')}>Forgot password?</button>
            {onBack && (
              <button type="button" className="link back" onClick={onBack}>← Back</button>
            )}
          </form>
        </LiquidGlass>
      </section>
    </main>
  );
};

LoginPage.propTypes = {
  onBack: PropTypes.func,
};

export default LoginPage;


