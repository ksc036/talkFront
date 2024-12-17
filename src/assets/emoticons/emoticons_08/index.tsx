import { Icon } from '@wapl/ui';

import { Base64 } from '@/@types/common';
import { EmoticonType } from '@/@types/emoticon';
import { EmoticonModel } from '@/models';

import EmoticonOriginURL from '../EmoticonOriginURL';
import * as E from '../EmoticonStyles';

const emoticonTabIndex = 'emoticons/emoticons_08';

const Emoticons08 = new EmoticonModel(
  'TALK_SEND_DEEP_FEATURE_EMOTICON_TOOLTIP_08',
  EmoticonType.STICKER,
  {
    normal: E.EmoticonTabIcon8 as unknown as Base64,
    active: E.EmoticonTabActiveIcon8 as unknown as Base64,
  },
  <Icon.Emoji8Line />,
  <Icon.Emoji8Color />,
);

for (let i = 1; i <= 5; i++) {
  const num = i.toString().padStart(2, '0');
  Emoticons08.insertEmoticon(
    `emoticon_08_${num}`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_08_${num}.gif`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_08_${num}_Thumbnail.png`,
  );
}

export default Emoticons08;
