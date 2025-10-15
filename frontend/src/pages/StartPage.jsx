import React from "react";
import PropTypes from "prop-types";
import LiquidGlass from "liquid-glass-react";
import "./StartPage.css";

const StartPage = ({ onNext }) => {
const handleNextClick = () => {
    if (typeof onNext === "function") {
    onNext();
    } else {
    console.warn("⚠️ onNext prop is not a function");
    }
};

  return (
    <main className="startpage-root">
      <header className="branding">
        <h1 className="branding-title">Cove.</h1>
      </header>

      <div className="next-wrapper">
        <LiquidGlass
          className="liquid-container"
          padding="12px 20px"
          cornerRadius={100}
          displacementScale={64}
          blurAmount={0.1}
          saturation={130}
          aberrationIntensity={2.0}
          elasticity={0.35}
          aria-label="Next"
          role="button"
          onClick={handleNextClick}
        >
          <button type="button" className="next-button">
            <span aria-hidden="true">→</span>
          </button>
        </LiquidGlass>
      </div>
    </main>
  );
};

StartPage.propTypes = {
  /** Callback fired when the Next button is clicked */
onNext: PropTypes.func,
};

StartPage.defaultProps = {
onNext: () => console.log("Next button clicked (no handler provided)"),
};

export default StartPage;
