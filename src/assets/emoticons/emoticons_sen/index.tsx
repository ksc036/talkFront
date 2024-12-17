import { EmoticonType } from '@/@types/emoticon';
import { EmoticonModel } from '@/models';

import EmoticonOriginURL from '../EmoticonOriginURL';

const emoticonTabIndex = 'emoticons/emoticons_00';

const inActive_tab_icon = `${EmoticonOriginURL}/${emoticonTabIndex}/emot_off.png`;
const active_tab_icon = `${EmoticonOriginURL}/${emoticonTabIndex}/emot_on.png`;

const EmoticonsSen = new EmoticonModel(
  'TALK_SEND_DEEP_FEATURE_EMOTICON_TOOLTIP_SEN',
  EmoticonType.STICKER,
  {
    normal: '',
    active: '',
  },
  <img src={inActive_tab_icon} width={24} height={24} />,
  <img src={active_tab_icon} width={24} height={24} />,
);

for (let i = 1; i <= 32; i++) {
  const num = i.toString().padStart(2, '0');
  EmoticonsSen.insertEmoticon(
    `emoticon_sen_${num}`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emot_0${num}_x3.gif`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emot_0${num}.png`,
  );
}

export default EmoticonsSen;
