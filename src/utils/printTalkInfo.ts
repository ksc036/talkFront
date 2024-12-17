import packageInfo from '../../package.json';

export const printTalkInfo = () => {
  const talkVersion = packageInfo.version;
  const authVersion = packageInfo.dependencies['@wapl/auth'];
  const shellVersion = packageInfo.dependencies['@shell/sdk'];

  if (
    window.location.hostname.includes('localhost') ||
    window.location.hostname.includes('tmax-superapp.com') ||
    window.location.hostname.includes('teespace.com')
  ) {
    console.log(`
      ========
   ==============
 ==================
===--====--====--===
==    ==    ==    ==   @wapl/talk: ${talkVersion}
===--====--====--===   @wapl/auth: ${authVersion}
 ==================    @shell/sdk: ${shellVersion}
   ==============
      ==============
 `);
  }
};
