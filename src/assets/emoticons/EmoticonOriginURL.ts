const isLocalHost = window.location.hostname === 'localhost';

const getDevUrl = () => {
  switch (process.env.REACT_APP_PLATFORM) {
    case 'ekr':
      return 'https://ekr-biz-dev.tmax-superapp.com';
    case 'sen':
      return 'https://seoul-edu-biz-dev.teespace.com';
    case 'clas_admin':
      return 'https://clas-dev.tmax-superapp.com';
    default:
      return 'https://wapl.tmax-superapp.com';
  }
};

const EmoticonOriginURL = (
  isLocalHost ? getDevUrl() : window.location.ancestorOrigins?.[0]
)?.concat('/talk');

export default EmoticonOriginURL;
