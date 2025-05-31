import React, { useState, useEffect } from "react";
import "./DesktopViewPrompt.css"; // Your custom styles

const DesktopViewPrompt = () => {
  // State to control prompt visibility
  const [showPrompt, setShowPrompt] = useState(false);

  // Check if user is on mobile and hasn't seen the prompt
  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    const hasSeenPrompt = localStorage.getItem("seenDesktopPrompt");

    if (isMobile && !hasSeenPrompt) {
      setShowPrompt(true);
    }
  }, []);

  // Close handler that also sets localStorage flag
  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem("seenDesktopPrompt", "true");
  };

  // Don't render if not showing
  if (!showPrompt) return null;

  return (
    <div className="macos-dialog-overlay">
      <div className="macos-dialog">
        <div className="dialog-header">
          <span className="dialog-title">Best Viewed on Desktop</span>
        </div>
        <div className="dialog-body">
          <p>
            {/* Customize your message here */}
            This site is optimized for desktop. For the best experience, please
            view on a desktop or select <strong>"Desktop site"</strong> from
            your mobile browser's menu (⋮ or AA icon).
          </p>
        </div>
        <div className="dialog-footer">
          <button onClick={handleClose} className="dialog-button">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesktopViewPrompt;