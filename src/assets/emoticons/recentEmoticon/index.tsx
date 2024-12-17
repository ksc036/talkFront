import { Icon } from '@wapl/ui';

import { Base64 } from '@/@types/common';
import { EmoticonType } from '@/@types/emoticon';
import { RecentEmoticonModel } from '@/models/RecentEmoticonModel';

import * as E from '../EmoticonStyles';

const RecentEmoticons = new RecentEmoticonModel(
  'TALK_SEND_DEEP_FEATURE_EMOTICON_TOOLTIP_10',
  EmoticonType.STICKER,
  {
    normal: E.RecentTabIcon as unknown as Base64,
    active: E.RecentTabActiveIcon as unknown as Base64,
  },
  <Icon.TimeLine />,
  <Icon.TimeLine />,
);

export default RecentEmoticons;
