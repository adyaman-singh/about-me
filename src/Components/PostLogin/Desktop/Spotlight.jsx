import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import "./Spotlight.css";
import SearchIcon from "@mui/icons-material/Search";

const Spotlight = ({ onClose, openWindow }) => {
  const [query, setQuery] = useState("");
  const spotlightRef = useRef(null);
  const containerRef = useRef(null);

  const windowOptions = useMemo(
    () => [
      { name: "Finder", key: "finder" },
      { name: "PDF Viewer", key: "pdf" },
      { name: "Summary", key: "summary" },
      { name: "Map", key: "map" },
      { name: "Browser", key: "browser" },
      { name: "Terminal", key: "terminal" },
      { name: "Notes", key: "notes" },
      { name: "Projects", key: "project" },
    ],
    []
  );

  const filteredWindows = useMemo(() => {
    if (!query) return [];
    return windowOptions.filter((win) =>
      win.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, windowOptions]);

  const handleResultClick = useCallback(
    (key) => {
      openWindow(key);
      onClose();
    },
    [openWindow, onClose]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  const handleClickOutside = useCallback(
    (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    spotlightRef.current?.focus();

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      className="spotlight-overlay"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight Search"
    >
      <div className="spotlight-container" ref={containerRef}>
        <div className="spotlight-input-wrapper">
          <span className="spotlight-icon" aria-hidden="true">
            <SearchIcon className="w-6 h-6 text-gray-400" />
          </span>
          <input
            ref={spotlightRef}
            type="text"
            className="spotlight-input"
            placeholder="Spotlight Search (ctrl + space)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search for applications"
          />
        </div>
        {filteredWindows.length > 0 && (
          <ul className="spotlight-results" role="listbox">
            {filteredWindows.map((win) => (
              <li
                key={win.key}
                className="spotlight-result-item"
                onClick={() => handleResultClick(win.key)}
                role="option"
                tabIndex="0"
                onKeyPress={(e) =>
                  e.key === "Enter" && handleResultClick(win.key)
                }
              >
                {win.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default React.memo(Spotlight);
