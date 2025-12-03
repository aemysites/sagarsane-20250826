import { getConfigValue } from './configs.js';
import { isAEMProd } from '../utils/browser-utils.js';

export async function getHotjarId() {
  return isAEMProd() ? await getConfigValue('hotjar-id-prod') : await getConfigValue('hotjar-id-dev');
}

export async function getHotjarScriptVersion() {
  return await getConfigValue('hotjar-script-version') || '6';
}

// Load Hotjar tracking code
export async function loadHotjar() {
  const hjid = await getHotjarId();
  const hjsv = await getHotjarScriptVersion();
  
  if (hjid) {
    (function(h, o, t, j, a, r) {
      h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments); };
      h._hjSettings = { hjid, hjsv };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }
}
