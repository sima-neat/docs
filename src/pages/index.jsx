import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import developerCenterShell from '../developerCenter/shell/config.cjs';
import styles from './index.module.css';

const actions = developerCenterShell.navbarItems();

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
  return (
    <Layout
      title="Developer Center"
      description="SiMa.ai Developer Center">
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
          </div>
        </section>
      </main>
    </Layout>
  );
}
