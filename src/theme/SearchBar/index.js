import React, {useCallback, useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {useLocation} from "@docusaurus/router";

// On mobile the native navbar is the single top bar, and search lives in the
// Developer Center shell (hidden on mobile). This renders an always-visible
// search box in the navbar that, when tapped, reveals the shell search as an
// overlay and focuses it — reusing the shell's index/results (Algolia-style).
const OPEN_CLASS = "dc-mobile-search-open";
const SHELL_INPUT_ID = "developer-center-search-input";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const focusShellSearch = useCallback(() => {
    document.getElementById(SHELL_INPUT_ID)?.focus();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      root.classList.add(OPEN_CLASS);
      const id = window.requestAnimationFrame(focusShellSearch);
      return () => window.cancelAnimationFrame(id);
    }
    root.classList.remove(OPEN_CLASS);
    return undefined;
  }, [open, focusShellSearch]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close after navigating to a search result.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Safety: drop the class if this component unmounts while open.
  useEffect(() => () => document.documentElement.classList.remove(OPEN_CLASS), []);

  return (
    <>
      <button
        type="button"
        className="dc-mobile-search-box"
        aria-label="Search Developer Center"
        onClick={() => setOpen(true)}
      >
        <svg
          className="dc-mobile-search-box__icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="currentColor"
            d="M9.5 3a6.5 6.5 0 0 1 5.18 10.43l4.45 4.44-1.42 1.42-4.44-4.45A6.5 6.5 0 1 1 9.5 3Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"
          />
        </svg>
        <span className="dc-mobile-search-box__label">Search Developer Center</span>
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              className="dc-mobile-search-backdrop"
              role="presentation"
              onClick={() => setOpen(false)}
            />
            <button
              type="button"
              className="dc-mobile-search-close"
              aria-label="Close search"
              title="Close search"
              onClick={() => setOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6 6.4 5Z"
                />
              </svg>
            </button>
          </>,
          document.body,
        )}
    </>
  );
}
