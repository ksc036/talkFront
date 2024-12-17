import { EmoticonType } from '@/@types/emoticon';
import { EmoticonModel } from '@/models';

import EmoticonOriginURL from '../EmoticonOriginURL';

const emoticonTabIndex = 'emoticons/emoticons_ekr';

const inActive_tab_icon = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_ekr_off.png`;
const active_tab_icon = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_ekr_on.png`;

const EmoticonsEkr = new EmoticonModel(
  'TALK_SEND_DEEP_FEATURE_EMOTICON_TOOLTIP_EKR',
  EmoticonType.STICKER,
  {
    normal: '',
    active: '',
  },
  <img src={inActive_tab_icon} width={24} height={24} />,
  <img src={active_tab_icon} width={24} height={24} />,
);

for (let i = 1; i <= 20; i++) {
  const num = i.toString().padStart(2, '0');
  EmoticonsEkr.insertEmoticon(
    `emoticon_ekr_${num}`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_ekr_${num}.gif`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_ekr_${num}_Thumbnail.png`,
  );
}

for (let i = 21; i <= 34; i++) {
  const num = i.toString().padStart(2, '0');
  EmoticonsEkr.insertEmoticon(
    `emoticon_ekr_${num}`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_ekr_${num}.png`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_ekr_${num}_Thumbnail.png`,
  );
}

export default EmoticonsEkr;
