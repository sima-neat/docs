import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {useLocation} from "@docusaurus/router";

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
      href: useBaseUrl("/hardware/getting-started/setup-devkit"),
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
      <HardwareSubnav />
      {children}
    </>
  );
}
