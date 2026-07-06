import { useEffect } from 'react';

/**
 * Remove Google Analytics/Tag Manager tracking query parameters
 * to keep the URL looking clean for the users after page has loaded
 */

export function cleanUrlParam() {
  useEffect(() => {
    const url = new URL(window.location.href);
    let hadChanges = false;

    const currentKeys = Array.from(url.searchParams.keys());

    currentKeys.forEach((param) => {
      if (param === '_gl' || param === '_gcl_au' || param === '_fplc' || param.startsWith('_ga')) {
        url.searchParams.delete(param);
        hadChanges = true;
      }
    });

    if (hadChanges) {
      const newUrl = url.searchParams.toString()
        ? `${url.pathname}?${url.searchParams.toString()}${url.hash}`
        : `${url.pathname}${url.hash}`;

      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);
}
