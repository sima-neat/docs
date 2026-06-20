import React, {useEffect, useRef, useState} from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {useLocation} from "@docusaurus/router";

// 11:59:59 PM Pacific (PDT, UTC-7) on Jun 15, 2026. The WIP banner auto-hides
// once the viewer's clock passes this instant.
const WIP_DEADLINE = Date.parse("2026-06-15T23:59:59-07:00");

function WipBanner() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide once the viewer's clock passes the deadline.
    if (Date.now() >= WIP_DEADLINE) {
      setVisible(false);
      return undefined;
    }
    // Publish the banner's height so the fixed bars and content below it are
    // pushed down by exactly the right amount (--wip-offset, default 0).
    const root = document.documentElement;
    const syncOffset = () => {
      if (ref.current) {
        root.style.setProperty("--wip-offset", `${ref.current.offsetHeight}px`);
      }
    };
    syncOffset();
    window.addEventListener("resize", syncOffset);
    return () => {
      window.removeEventListener("resize", syncOffset);
      root.style.removeProperty("--wip-offset");
    };
  }, []);

  if (!visible) {
    return null;
  }
  return (
    <div ref={ref} className="wip-banner" role="status">
      🚧 This documentation site is a work in progress — content is incomplete and may change.
    </div>
  );
}

function HardwareSubnav() {
  const location = useLocation();
  const hardwareBase = useBaseUrl("/hardware");
  const gettingStartedBase = useBaseUrl("/hardware/getting-started");
  const devkitBase = useBaseUrl("/hardware/devkit");
  const toolsBase = useBaseUrl("/hardware/tools");
  const referenceBase = useBaseUrl("/hardware/reference");

  const links = [
    {
      label: "Getting Started",
      href: useBaseUrl("/hardware/getting-started"),
      active: location.pathname.includes(gettingStartedBase),
    },
    {
      label: "DevKit Variants",
      href: useBaseUrl("/hardware/devkit/modalix-devkit"),
      active: location.pathname.includes(devkitBase),
    },
    {
      label: "Tools",
      href: useBaseUrl("/hardware/tools/web-serial-console"),
      active: location.pathname.includes(toolsBase),
    },
    {
      label: "References",
      href: useBaseUrl("/hardware/reference/bsp"),
      active: location.pathname.includes(referenceBase),
    },
  ];

  const quickStartHref = useBaseUrl("/tools/qsg/index.html");
  const serialConsoleHref = useBaseUrl("/tools/serial/index.html");

  // Only render the secondary bar on Hardware doc routes, not on the
  // landing page (/) or the /software and /examples fallbacks.
  if (!location.pathname.startsWith(hardwareBase)) {
    return null;
  }

  return (
    <nav className="docs-subnav" aria-label="Hardware documentation">
      <div className="docs-subnav__inner">
        <div className="docs-subnav__links">
          {links.map((link) => (
            <a
              key={link.label}
              className={`docs-subnav__link${link.active ? " docs-subnav__link--active" : ""}`}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="docs-subnav__controls">
          <a
            className="docs-subnav__link"
            href={serialConsoleHref}
            target="_blank"
            rel="noreferrer"
          >
            Web Serial Console
          </a>
          <a
            className="docs-subnav__button"
            href={quickStartHref}
            target="_blank"
            rel="noreferrer"
          >
            Quick Start
          </a>
          <a
            className="docs-subnav__button docs-subnav__button--buy"
            href="https://devkit.sima.ai"
            target="_blank"
            rel="noreferrer"
          >
            Buy Your DevKit
          </a>
        </div>
      </div>
    </nav>
  );
}

export default function Root({children}) {
  return (
    <>
      <WipBanner />
      <HardwareSubnav />
      {children}
    </>
  );
}
