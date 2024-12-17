import { EmoticonType } from '@/@types/emoticon';
import { EmoticonModel } from '@/models';

import EmoticonOriginURL from '../EmoticonOriginURL';

const emoticonTabIndex = 'emoticons/emoticons_09';

const inActive_tab_icon = `${EmoticonOriginURL}/${emoticonTabIndex}/kangdong-songpa-02_25px.png`;
const active_tab_icon = `${EmoticonOriginURL}/${emoticonTabIndex}/kangdong-songpa-01_25px.png`;

const EmoticonsSenKangdongSongpa = new EmoticonModel(
  'TALK_SEND_DEEP_FEATURE_EMOTICON_TOOLTIP_SEN_KANGDONGSONGPA',
  EmoticonType.STICKER,
  {
    normal: '',
    active: '',
  },
  <img src={inActive_tab_icon} width={24} height={24} />,
  <img src={active_tab_icon} width={24} height={24} />,
);

for (let i = 1; i <= 10; i++) {
  const num = i.toString().padStart(2, '0');
  EmoticonsSenKangdongSongpa.insertEmoticon(
    `emoticon_sen_kangdongsongpa_${num}`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/kangdong-songpa-${num}_540px.png`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/kangdong-songpa-${num}_110px.png`,
  );
}

export default EmoticonsSenKangdongSongpa;
