import React, { useRef, useEffect } from 'react';
import './StartPage.css';

function StartPage({ onSignUp }) {
  const videoRef = useRef(null);

  useEffect(() => {
    // Try to programmatically play the video on mount. Some browsers
    // require a user gesture or a call to play() even when muted.
    const v = videoRef.current;
    if (v) {
      // best-effort play; ignore any promise rejection
      const p = v.play();
      if (p && p.catch) p.catch(() => { /* ignore autoplay rejection */ });
    }
  }, []);

  return (
    <div className="start-page">
      <video
        ref={videoRef}
        className="bg-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        // some browsers still look for the webkit attribute
        webkit-playsinline="true"
      >
  <source src="https://cdn.pixabay.com/video/2023/01/19/147192-790996333_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="overlay">
        {/* Top-center About link */}
        <a className="about-link" href="#about">About.</a>

        <div className="glass-card">
          <div className="glass-content">
            <h1 className="brand">Cove.</h1>
          </div>
        </div>

        {/* Bottom-right Next button */}
        <button className="next-btn" aria-label="Next" onClick={onSignUp}>→</button>
      </div>
    </div>
  );
}

export default StartPage;
