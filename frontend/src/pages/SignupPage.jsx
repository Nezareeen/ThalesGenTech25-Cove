import React from 'react';
import LiquidGlass from 'liquid-glass-react';
import PropTypes from 'prop-types';
import './SignupPage.css';

const SignupPage = ({ onBack }) => {
  return (
    <main className="signup-root">
      <section className="form-pane-left">
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
          <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
            <h2 className="form-title">Create an account</h2>
            <label className="field">

              <input type="text" placeholder="Username" required />
            </label>
            <label className="field">

              <input type="email" placeholder="Email" required />
            </label>
            <label className="field">

              <input type="password" placeholder="Set Password" required />
            </label>
            <label className="field">

              <input type="password" placeholder="Confirm Password" required />
            </label>

            <button type="submit" className="btn primary">Sign up</button>
            <button type="button" className="btn google">Continue with Google</button>

            <button type="button" className="link back" onClick={onBack}>← Back</button>
          </form>
        </LiquidGlass>
      </section>

      <section className="branding-pane-right">
        <div className="branding-overlay" />
        <div className="branding-content">
          <h1 className="branding-title-signup">Cove.</h1>
        </div>
      </section>
    </main>
  );
};

SignupPage.propTypes = {
  onBack: PropTypes.func,
};

export default SignupPage;
