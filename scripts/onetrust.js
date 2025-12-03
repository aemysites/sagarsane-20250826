import { loadScript } from './aem.js';
import { getConfigValue } from './configs.js';
import { isAEMProd } from '../utils/browser-utils.js';

export async function getOneTrustToken() {
  return isAEMProd() ? await getConfigValue('onetrust-token-prod') : await getConfigValue('onetrust-token-dev');
}

// Load OneTrust script based on configuration
export async function loadOneTrust() {
  const oneTrustToken = await getOneTrustToken();
  if (oneTrustToken) {
    const otScriptSrc = `https://cdn.cookielaw.org/scripttemplates/otSDKStub.js`;
    await loadScript(otScriptSrc, {
        'data-document-language': 'true',
        'data-domain-script': oneTrustToken,
        type: 'text/javascript',
        charset: 'UTF-8',
    });

    // Add OptanonWrapper function after OneTrust script
    const wrapperScript = document.createElement('script');
    wrapperScript.type = 'text/javascript';
    wrapperScript.textContent = 'function OptanonWrapper() { }';
    document.head.appendChild(wrapperScript);
  }
}
