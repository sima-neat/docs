import {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import developerCenterShell from '../developerCenter/shell/config.cjs';
import styles from './index.module.css';

const actions = developerCenterShell.navbarItems();

// 11:59:59 PM Pacific (PDT, UTC-7) on Jun 15, 2026. The WIP banner auto-hides
// once the viewer's clock passes this instant.
const WIP_DEADLINE = Date.parse('2026-06-15T23:59:59-07:00');

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
        root.style.setProperty('--wip-offset', `${ref.current.offsetHeight}px`);
      }
    };
    syncOffset();
    window.addEventListener('resize', syncOffset);
    return () => {
      window.removeEventListener('resize', syncOffset);
      root.style.removeProperty('--wip-offset');
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

function PortalButton({action}) {
  const className = clsx(styles.portalButton, styles[action.tone]);
  if (action.external) {
    return (
      <a className={className} href={action.href}>
        {action.label}
      </a>
    );
  }
  return (
    <Link className={className} to={action.href}>
      {action.label}
    </Link>
  );
}

export default function Home() {
  const quickStartHref = useBaseUrl('/tools/qsg/index.html');
  return (
    <Layout
      title="Developer Center"
      description="SiMa.ai Developer Center">
      <WipBanner />
      <main className={styles.pageShell}>
        <section className={styles.hero}>
          <div className={styles.brandPanel}>
            <img className={styles.logo} src="/img/sima-logo.png" alt="SiMa.ai" />
            <p className={styles.kicker}>Developer Center</p>
            <h1>Open, Simple, Performant, Neat!</h1>
            <p className={styles.summary}>
              Learn how to build physical AI with SiMa.ai technology. Explore hardware interfaces, software tools, and best practices for building high-performance AI applications.
            </p>
            <div className={styles.actions} aria-label="Documentation sections">
              {actions.map((action) => (
                <PortalButton key={action.label} action={action} />
              ))}
            </div>
            <a
              className={styles.quickStart}
              href={quickStartHref}
              target="_blank"
              rel="noreferrer"
            >
              Quick Start Guide
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
