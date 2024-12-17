import { Icon } from '@wapl/ui';

import { Base64 } from '@/@types/common';
import { EmoticonType } from '@/@types/emoticon';
import { EmoticonModel } from '@/models';

import EmoticonOriginURL from '../EmoticonOriginURL';
import * as E from '../EmoticonStyles';

const emoticonTabIndex = 'emoticons/emoticons_03';

const Emoticons03 = new EmoticonModel(
  'TALK_SEND_DEEP_FEATURE_EMOTICON_TOOLTIP_03',
  EmoticonType.STICKER,
  {
    normal: E.EmoticonTabIcon3 as unknown as Base64,
    active: E.EmoticonTabActiveIcon3 as unknown as Base64,
  },
  <Icon.Emoji3Line />,
  <Icon.Emoji3Color />,
);

for (let i = 1; i <= 24; i++) {
  const num = i.toString().padStart(2, '0');
  Emoticons03.insertEmoticon(
    `emoticon_03_${num}`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_03_${num}.gif`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_03_${num}_Thumbnail.png`,
  );
}

export default Emoticons03;
