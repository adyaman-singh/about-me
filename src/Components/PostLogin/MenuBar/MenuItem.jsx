import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useSystem } from "../SystemProvider.jsx";
import "./MenuBar.css";

const MenuItem = ({ label, items = [], anchorRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(null); // Initialize as null
  const dropdownRef = useRef(null);
  const { setShowSpotlight } = useSystem();
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (isOpen && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: rect.left,
      });
    } else {
      setPosition(null); // Reset position when closed
    }
  }, [isOpen, anchorRef]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        setShowSpotlight((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShowSpotlight]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !anchorRef?.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, anchorRef]);

  if (label === "Spotlight") {
    return (
      <div
        className="menu-item"
        onClick={() => setShowSpotlight((prev) => !prev)}
        anchorRef={spotlightRef}
        tabIndex={0}
        onKeyDown={(e) => {
          if (["Enter", " "].includes(e.key)) {
            e.preventDefault();
            setShowSpotlight((prev) => !prev);
          } else if (
            e.key === "Escape" ||
            (spotlightRef.current && !spotlightRef.current.contains(e.target))
          ) {
            setShowSpotlight(false);
          }
        }}
      >
        {label}
      </div>
    );
  }

  return (
    <>
      <div
        ref={anchorRef}
        className="menu-item"
        onClick={() => setIsOpen((prev) => !prev)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsOpen(false);
        }}
      >
        {label}
      </div>

      {isOpen &&
        position &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className="dropdown-menu visible"
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: 9999,
              backgroundColor: "rgba(50, 50, 50, 0.7)",
              opacity: 1, // Ensure it's fully visible immediately
              transform: "none", // Remove any transform that might cause animation
            }}
          >
            {items.map((item, index) =>
              item.type === "divider" ? (
                <div key={index} className="dropdown-divider" />
              ) : (
                <div
                  key={index}
                  className="dropdown-item"
                  style={{ color: "white" }}
                  onClick={() => {
                    item.action?.();
                  }}
                >
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <span className="shortcut">{item.shortcut}</span>
                  )}
                  {item.submenu && <span className="submenu-arrow">›</span>}
                </div>
              )
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default MenuItem;
