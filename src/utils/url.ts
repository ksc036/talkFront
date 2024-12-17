export const hasHttpProtocol = (url = ''): boolean =>
  /^(http(s)?:\/\/)(\S)+/gi.test(url);

export const safeHttpsUrl = (url = ''): string =>
  hasHttpProtocol(url) ? url : `https://${url}`;

export const concatOriginUrl = (orgin = '', url = ''): string =>
  orgin + (url.charAt(0) === '/' ? url : `/${url}`);

// dataURI 임시 any 처리
export const dataURItoUrl = (dataURI: string) => {
  try {
    const parse = dataURI.match(/[:](.*?)[;]/);
    const type = parse ? parse[1] : '';
    const raw = atob(dataURI.split(',')[1]);
    const ia = new Uint8Array(raw.length);

    for (let i = 0; i < raw.length; ++i) {
      ia[i] = raw.charCodeAt(i);
    }

    return URL.createObjectURL(new Blob([ia], { type }));
  } catch (err) {
    return dataURI;
  }
};

export const isInviteURL = (url = ''): boolean => {
  const href = safeHttpsUrl(url);
  const curDomain =
    location.hostname.indexOf('www.') === 0
      ? location.hostname.replace('www.', '')
      : location.hostname;
  const parsedCurDomain = curDomain.split('.');
  const targetURL = new URL(href || '');
  const targetDomain =
    targetURL.hostname.indexOf('www.') === 0
      ? targetURL.hostname.replace('www.', '')
      : targetURL.hostname;
  const parsedTargetDomain = targetDomain.split('.');
  if (
    targetURL.pathname.startsWith('/invite/') &&
    parsedCurDomain.length > 1 &&
    parsedTargetDomain.length > 1 &&
    parsedCurDomain[parsedCurDomain.length - 2] ===
      parsedTargetDomain[parsedTargetDomain.length - 2]
  ) {
    const roomId = parseInt(targetURL.pathname.split('/')[2]);
    if (roomId) {
      return true;
    }
  }
  return false;
};

export const isAppUrl = (url = ''): boolean => {
  const targetUrl = safeHttpsUrl(url);
  const targetUrlObject = new URL(targetUrl || '');
  const targetHostnameParts = targetUrlObject.hostname.split('.');
  const targetSubdomain =
    targetHostnameParts.length > 2
      ? targetHostnameParts[targetHostnameParts.length - 2]
      : null;
  const curHostnameParts = window.location.hostname.split('.');
  const curSubdomain =
    curHostnameParts.length > 2
      ? curHostnameParts[curHostnameParts.length - 2]
      : null;
  if (
    targetSubdomain &&
    curSubdomain &&
    targetSubdomain === curSubdomain &&
    targetUrlObject.searchParams.get('appId')
  ) {
    return true;
  }

  return false;
};

export const getAppUrl = (url = ''): { [key: string]: string } => {
  const href = safeHttpsUrl(url);
  const urlObject = new URL(href || '');
  const searchParamObject: { [key: string]: string } = {};
  urlObject.searchParams.forEach((value, key) => {
    searchParamObject[key] = value;
  });
  return searchParamObject;
};
