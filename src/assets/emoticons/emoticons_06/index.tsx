import { Icon } from '@wapl/ui';

import { Base64 } from '@/@types/common';
import { EmoticonType } from '@/@types/emoticon';
import { EmoticonModel } from '@/models';

import EmoticonOriginURL from '../EmoticonOriginURL';
import * as E from '../EmoticonStyles';

const emoticonTabIndex = 'emoticons/emoticons_06';

const Emoticons06 = new EmoticonModel(
  'TALK_SEND_DEEP_FEATURE_EMOTICON_TOOLTIP_06',
  EmoticonType.STICKER,
  {
    normal: E.EmoticonTabIcon6 as unknown as Base64,
    active: E.EmoticonTabActiveIcon6 as unknown as Base64,
  },
  <Icon.Emoji6Line />,
  <Icon.Emoji6Color />,
);

for (let i = 1; i <= 12; i++) {
  const num = i.toString().padStart(2, '0');
  Emoticons06.insertEmoticon(
    `emoticon_06_${num}`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_06_${i}.gif`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_06_${i}_Thumbnail.png`,
  );
}

export default Emoticons06;
