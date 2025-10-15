import React from 'react';
// Import the LiquidGlass component
import LiquidGlass from 'liquid-glass-react'; 
// Import your local CSS file
import './TestingLiquidGlass.css'; 

const TestingLiquidGlass = () => {
  return (
    // The main container to demonstrate the effect
    <div className="liquid-glass-demo-container">
      
      {/* The LiquidGlass component 
        - The 'className' is for styling the glass container itself.
        - The child elements inside will be what's displayed with the liquid glass effect.
      */}
      <LiquidGlass className="my-liquid-glass-box">
        <h2>Hello Liquid Glass!</h2>
        <p>This text is sitting behind a liquid glass effect.</p>
        <button>Cool Button</button>
      </LiquidGlass>

      {/* Optional: Add content outside the glass to show the background is visible */}
      <div className="outside-content">
        <p>This content is outside the glass effect area.</p>
      </div>
    </div>
  );
};

export default TestingLiquidGlass;