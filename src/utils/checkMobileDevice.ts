export const checkMobileDevice = () => {
  const varUA = navigator.userAgent.toLowerCase();

  if (varUA.indexOf('android') > -1) {
    //안드로이드
    return 'android';
  } else if (
    varUA.indexOf('iphone') > -1 ||
    varUA.indexOf('ipad') > -1 ||
    varUA.indexOf('ipod') > -1
  ) {
    //IOS
    return 'ios';
  } else {
    //아이폰, 안드로이드 외
    return 'other';
  }
};
