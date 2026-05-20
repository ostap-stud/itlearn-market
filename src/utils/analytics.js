const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

export function initAnalytics() {
  if (!GA_ID || typeof window === 'undefined') return;
  if (window.__itlearnGaInitialized) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    send_page_view: false
  });
  window.__itlearnGaInitialized = true;
}

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('event', name, params);
  }
  window.__itlearnEvents = window.__itlearnEvents || [];
  window.__itlearnEvents.push({ name, params, createdAt: new Date().toISOString() });
}

export function trackPageView(page) {
  trackEvent('page_view', {
    page_title: page,
    page_location: window.location.href,
    page_path: `/${page}`
  });
}

export function getTrackedEvents() {
  if (typeof window === 'undefined') return [];
  return window.__itlearnEvents || [];
}
