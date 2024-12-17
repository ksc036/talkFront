export const isMobile = () => {
  const UA = navigator.userAgent.toLowerCase();

  if (
    UA.indexOf('iphone') > -1 ||
    UA.indexOf('ipad') > -1 ||
    UA.indexOf('ipod') > -1 ||
    UA.indexOf('android') > -1 ||
    // 서울시 교육청 dev 모바일 쉘 주소
    window.location.hostname ===
      'http://seoul-edu-mobile-shell.teespace.net/' ||
    // 서울시 교육청 stag 모바일 쉘 주소
    window.location.hostname === 'http://seoul-edu-mobile-shell.catchbird.net/'
  )
    return true;

  // ipad가 safari에서 macintosh로 뜨기 때문에 따로 처리 필요
  if (navigator.maxTouchPoints > 0) {
    const isIpad = /Macintosh|iPad/.test(navigator.userAgent);
    if (isIpad) return true;
  }

  return false;
};

export const checkDevice = () => {
  const userAgent = window.navigator.userAgent;

  if (/Windows/i.test(userAgent)) {
    return 'Windows';
  } else if (/Macintosh/i.test(userAgent)) {
    return 'Mac';
  } else if (/Android/i.test(userAgent)) {
    return 'Android';
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'iOS';
  }
  return 'unKnown';
};
