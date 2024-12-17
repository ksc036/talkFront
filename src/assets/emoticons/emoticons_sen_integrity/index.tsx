import { EmoticonType } from '@/@types/emoticon';
import { EmoticonModel } from '@/models';

import EmoticonOriginURL from '../EmoticonOriginURL';

const emoticonTabIndex = 'emoticons/emoticons_10';

const inActive_tab_icon = `${EmoticonOriginURL}/${emoticonTabIndex}/emot_off.png`;
const active_tab_icon = `${EmoticonOriginURL}/${emoticonTabIndex}/emot_on.png`;

const EmoticonsSenIntegrity = new EmoticonModel(
  'TALK_SEND_DEEP_FEATURE_EMOTICON_TOOLTIP_SEN_INTEGRITY',
  EmoticonType.STICKER,
  {
    normal: '',
    active: '',
  },
  <img src={inActive_tab_icon} width={24} height={24} />,
  <img src={active_tab_icon} width={24} height={24} />,
);

for (let i = 1; i <= 14; i++) {
  const num = i.toString().padStart(2, '0');
  EmoticonsSenIntegrity.insertEmoticon(
    `emoticon_sen_integrity_${num}`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emot_${num}.png`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emot_${num}_thumb.png`,
  );
}

export default EmoticonsSenIntegrity;
