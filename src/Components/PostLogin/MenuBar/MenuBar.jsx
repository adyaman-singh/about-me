import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import MenuItem from "../MenuItem";
import "./MenuBar.css";
import MacWifiIcon from "./BatteryWifi/MacWifiIcon";
import BatteryStatus from "./BatteryWifi/BatteryStatus";
import ContentHeader from "../ContentHeader";
import { MacMenuDropdownPortal } from "./Portal";
import {
  FILE_MENU_ITEMS,
  EDIT_MENU_ITEMS,
  VIEW_MENU_ITEMS,
} from "../../constants";

const MenuBar = ({
  darkMode,
  setDarkMode,
  setBackground,
  setIsCustomBackground,
}) => {
  const backGroundFileInputRef = useRef(null)
  const fileInputRef = useRef(null);
  const editMenuRef = useRef(null);
  const viewMenuRef = useRef(null);
  const appleMenuRef = useRef(null);
  const [showAppleDropdown, setShowAppleDropdown] = useState(false);

  const handleBackgroundChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setBackground(event.target.result);
          setIsCustomBackground(true);
          e.target.value = "";
        };
        reader.readAsDataURL(file);
      }
    },
    [setBackground, setIsCustomBackground]
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      const portalElement = document.querySelector(".about-mac-portal");
      const dropdownMenu = document.querySelector(".dropdown-menu.visible");

      if (
        showAppleDropdown &&
        appleMenuRef.current &&
        !appleMenuRef.current.contains(e.target) &&
        !portalElement?.contains(e.target) &&
        !dropdownMenu?.contains(e.target)
      ) {
        setShowAppleDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAppleDropdown]);

  return (
    <div className={`menu-bar ${darkMode ? "dark" : ""}`}>
      <div className="apple-menu">
        <div
          className="menu-item"
          ref={appleMenuRef}
          onClick={() => setShowAppleDropdown((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={showAppleDropdown}
        >
          <div className="apple-icon"></div>
        </div>
        {showAppleDropdown && (
          <MacMenuDropdownPortal
            anchorRef={appleMenuRef}
            onClose={() => setShowAppleDropdown(false)}
            darkMode={darkMode}
          />
        )}

        <div
          className="menu-item theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
        >
          <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i> Theme
        </div>

        <div
          className="menu-item"
          onClick={() => backGroundFileInputRef.current.click()}
          aria-label="Change background"
        >
          <i className="fas fa-image"></i> Background
          <input
            type="file"
            ref={backGroundFileInputRef}
            onChange={handleBackgroundChange}
            style={{ display: "none" }}
            accept="image/*"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="app-menu">
        <MenuItem label="Spotlight" />
        <MenuItem
          label="File"
          items={FILE_MENU_ITEMS}
          anchorRef={fileInputRef}
        />
        <MenuItem
          label="Edit"
          items={EDIT_MENU_ITEMS}
          anchorRef={editMenuRef}
        />
        <MenuItem
          label="View"
          items={VIEW_MENU_ITEMS}
          anchorRef={viewMenuRef}
        />
      </div>

      <div className="status-menu">
        <div className="menu-item" title="Wi-Fi" aria-label="Wi-Fi status">
          <MacWifiIcon size={16} darkMode={darkMode} />
        </div>
        <BatteryStatus darkMode={darkMode} />
        <div
          className="menu-item"
          title="Current Time"
          aria-label="Current time"
        >
          <ContentHeader darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
