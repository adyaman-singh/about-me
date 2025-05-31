import { useSystem } from "../SystemProvider";
import ReactDOM from "react-dom";
import { useEffect, useState, useRef } from "react";
import AboutMacPortal from "./AboutMac/AboutMac";
import shutdownSound from "../../assets/mac_startup.mp3";
import { APPLE_MENU_ITEMS } from "../../constants";

export const MacMenuDropdownPortal = ({ anchorRef, onClose, darkMode }) => {
  const { setSystemAction } = useSystem();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showAboutMac, setShowAboutMac] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [anchorRef]);

  useEffect(() => {
    if (!window.shutdownAudio) {
      window.shutdownAudio = new Audio(shutdownSound);
      window.shutdownAudio.volume = 0.5;
    }
    audioRef.current = window.shutdownAudio;

    return () => {
      audioRef.current = null;
    };
  }, []);

  const triggerSystemAction = (action) => {
    setSystemAction(action);
    onClose();
  };

  const handleItemClick = (item) => {
    if (item.action) {
      item.action(setShowAboutMac, triggerSystemAction, audioRef);
    }
    if (!item.action || !item.action.length) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <>
      <div
        className={`dropdown-menu visible`}
        style={{
          position: "absolute",
          top: `3.0%`,
          left: `${position.left - 13}px`,
          zIndex: 9999,
          minWidth: "220px",
          backgroundColor: "rgba(50, 50, 50, 0.7)",
        }}
      >
        {APPLE_MENU_ITEMS.map((item, index) =>
          item.type === "divider" ? (
            <div key={index} className="dropdown-divider" />
          ) : (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleItemClick(item)}
            >
              <span className={item.italic ? "italic-text" : ""}>
                {item.label}
              </span>
              {item.shortcut && (
                <span className="shortcut">{item.shortcut}</span>
              )}
              {item.submenu && <span className="submenu-arrow">›</span>}
            </div>
          )
        )}
      </div>

      {showAboutMac && (
        <AboutMacPortal onClose={() => setShowAboutMac(false)} />
      )}
    </>,
    document.body
  );
};
