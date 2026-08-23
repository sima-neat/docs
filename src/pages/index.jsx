import {useEffect, useState} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import developerCenterShell from '../developerCenter/shell/config.cjs';
import styles from './index.module.css';

const actions = developerCenterShell.navbarItems();

function readLocalePreference(routeLocale) {
  const supported = new Set(developerCenterShell.SUPPORTED_LOCALES.map(({code}) => code));
  if (
    routeLocale !== developerCenterShell.DEFAULT_LOCALE
    && supported.has(routeLocale)
  ) {
    return routeLocale;
  }

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${developerCenterShell.LOCALE_COOKIE}=`));
  let cookieLocale = '';
  try {
    cookieLocale = cookie
      ? decodeURIComponent(cookie.split('=').slice(1).join('='))
      : '';
  } catch (_) {
    // Ignore malformed cookie values and fall back to local storage.
  }
  if (supported.has(cookieLocale)) return cookieLocale;

  try {
    const storedLocale = window.localStorage.getItem(developerCenterShell.LOCALE_KEY);
    if (supported.has(storedLocale)) return storedLocale;
  } catch (_) {
    // Restricted storage should not prevent the English landing page rendering.
  }

  return developerCenterShell.DEFAULT_LOCALE;
}

function localizedActionHref(action, locale) {
  if (action.external || locale === developerCenterShell.DEFAULT_LOCALE) return action.href;
  if (action.key === 'hardware') return `/${locale}${action.href}`;
  if (action.key === 'software') return `${action.href}/${locale}`;
  return action.href;
}

function PortalButton({action, label, locale}) {
  const className = clsx(styles.portalButton, styles[action.tone]);
  const href = useBaseUrl(localizedActionHref(action, locale));
  return (
    <a className={className} href={href}>
      {label}
    </a>
  );
}

export default function Home() {
  const {i18n} = useDocusaurusContext();
  const routeLocale = developerCenterShell.SHELL_TRANSLATIONS[i18n.currentLocale]
    ? i18n.currentLocale
    : developerCenterShell.DEFAULT_LOCALE;
  const [locale, setLocale] = useState(routeLocale);
  const siteRoot = useBaseUrl('/');
  const quickStartHref = useBaseUrl('/tools/qsg/index.html');

  useEffect(() => {
    const preferredLocale = readLocalePreference(routeLocale);
    if (
      routeLocale === developerCenterShell.DEFAULT_LOCALE
      && preferredLocale !== developerCenterShell.DEFAULT_LOCALE
    ) {
      window.location.replace(
        `${siteRoot}${preferredLocale}/${window.location.search}${window.location.hash}`,
      );
      return undefined;
    }

    setLocale(preferredLocale);
    const onLanguageChange = (event) => {
      if (developerCenterShell.SHELL_TRANSLATIONS[event?.detail?.locale]) {
        setLocale(event.detail.locale);
      }
    };
    window.addEventListener('developer-center-language-change', onLanguageChange);
    return () => window.removeEventListener('developer-center-language-change', onLanguageChange);
  }, [routeLocale, siteRoot]);

  const copy = developerCenterShell.SHELL_TRANSLATIONS[locale]
    || developerCenterShell.SHELL_TRANSLATIONS.en;

  return (
    <Layout
      title={copy.landing.kicker}
      description={copy.landing.summary}>
      <main className={styles.pageShell}>
        <section className={styles.hero}>
          <div className={styles.brandPanel}>
            <img className={styles.logo} src="/img/sima-logo.png" alt="SiMa.ai" />
            <p className={styles.kicker}>{copy.landing.kicker}</p>
            <h1>{copy.landing.title}</h1>
            <p className={styles.summary}>{copy.landing.summary}</p>
            <div className={styles.actions} aria-label={copy.landing.sectionsLabel}>
              {actions.map((action) => (
                <PortalButton
                  key={action.key}
                  action={action}
                  label={copy.navItems[action.key] || action.label}
                  locale={locale}
                />
              ))}
            </div>
            <a
              className={styles.quickStart}
              href={quickStartHref}
              target="_blank"
              rel="noreferrer"
            >
              {copy.navItems.quickstart}
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
