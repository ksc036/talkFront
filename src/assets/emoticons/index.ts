import Emoticons01 from './emoticons_01';
import Emoticons02 from './emoticons_02';
import Emoticons03 from './emoticons_03';
import Emoticons04 from './emoticons_04';
import Emoticons05 from './emoticons_05';
import Emoticons06 from './emoticons_06';
import Emoticons07 from './emoticons_07';
import Emoticons08 from './emoticons_08';
import EmoticonsEkr from './emoticons_ekr';
import EmoticonsSen from './emoticons_sen';
import EmoticonsSenIntegrity from './emoticons_sen_integrity';
import EmoticonsSenKangdongSongpa from './emoticons_sen_kangdongsongpa';
import EmoticonsSenNoSmoking from './emoticons_sen_no_smoking';
import Reaction from './reaction';

const EmoticonsAll = [
  Emoticons01,
  Emoticons02,
  Emoticons03,
  Emoticons04,
  Emoticons05,
  Emoticons06,
  Emoticons07,
  Emoticons08,
];

if (process.env.REACT_APP_PLATFORM === 'sen') {
  EmoticonsAll.splice(0, 0, EmoticonsSen);
  EmoticonsAll.splice(1, 0, EmoticonsSenKangdongSongpa);
  EmoticonsAll.splice(2, 0, EmoticonsSenIntegrity);
  EmoticonsAll.splice(3, 0, EmoticonsSenNoSmoking);
}

if (process.env.REACT_APP_PLATFORM === 'ekr') {
  EmoticonsAll.splice(8, 0, EmoticonsEkr);
}

export { EmoticonsAll, Reaction };
