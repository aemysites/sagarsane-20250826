const getLocalStorageItem = (prop) => window.localStorage.getItem(prop);
const setLocalStorageItem = (prop, value) => window.localStorage.setItem(prop, value);

const getPropFromSessionStorageObj = (prop, key) => {
  const obj = JSON.parse(sessionStorage.getItem(prop));
  return obj && obj[key] ? obj[key] : '';
};

const isAEMPreview = () => window.location.host.includes('localhost') || window.location.host.includes('aem.page');

const prodDomainRegex = /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]+$/;
const isAEMProd = () => prodDomainRegex.test(window.location.hostname);

export { getLocalStorageItem, setLocalStorageItem, getPropFromSessionStorageObj, isAEMPreview, isAEMProd };