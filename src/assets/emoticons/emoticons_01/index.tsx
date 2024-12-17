/* eslint-disable camelcase */
import { Icon } from '@wapl/ui';

import { Base64 } from '@/@types/common';
import { EmoticonType } from '@/@types/emoticon';
import { EmoticonModel } from '@/models';

import EmoticonOriginURL from '../EmoticonOriginURL';
import * as E from '../EmoticonStyles';

const emoticonTabIndex = 'emoticons/emoticons_01';

const image_emoticon_01_1 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_1.png`;
const image_emoticon_01_2 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_2.png`;
const image_emoticon_01_3 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_3.png`;
const image_emoticon_01_4 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_4.png`;
const image_emoticon_01_5 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_5.png`;
const image_emoticon_01_6 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_6.png`;
const image_emoticon_01_7 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_7.png`;
const image_emoticon_01_8 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_8.png`;
const image_emoticon_01_9 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_9.png`;
const image_emoticon_01_10 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_10.png`;
const image_emoticon_01_11 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_11.png`;
const image_emoticon_01_12 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_12.png`;
const image_emoticon_01_13 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_13.png`;
const image_emoticon_01_14 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_14.png`;
const image_emoticon_01_15 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_15.png`;
const image_emoticon_01_16 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_16.png`;
const image_emoticon_01_17 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_17.png`;
const image_emoticon_01_18 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_18.png`;
const image_emoticon_01_19 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_19.png`;
const image_emoticon_01_20 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_20.png`;
const image_emoticon_01_21 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_21.png`;
const image_emoticon_01_22 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_22.png`;
const image_emoticon_01_23 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_23.png`;
const image_emoticon_01_24 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_24.png`;
const image_emoticon_01_25 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_25.png`;
const image_emoticon_01_26 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_26.png`;
const image_emoticon_01_27 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_27.png`;
const image_emoticon_01_28 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_28.png`;
const image_emoticon_01_29 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_29.png`;
const image_emoticon_01_30 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_30.png`;
const image_emoticon_01_31 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_31.png`;
const image_emoticon_01_32 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_32.png`;
const image_emoticon_01_33 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_33.png`;
const image_emoticon_01_34 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_34.png`;
const image_emoticon_01_35 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_35.png`;
const image_emoticon_01_36 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_36.png`;
const image_emoticon_01_37 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_37.png`;
const image_emoticon_01_38 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_38.png`;
const image_emoticon_01_39 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_39.png`;
const image_emoticon_01_40 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_40.png`;
const image_emoticon_01_41 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_41.png`;
const image_emoticon_01_42 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_42.png`;
const image_emoticon_01_43 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_43.png`;
const image_emoticon_01_44 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_44.png`;
const image_emoticon_01_45 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_45.png`;
const image_emoticon_01_46 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_46.png`;
const image_emoticon_01_47 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_47.png`;
const image_emoticon_01_48 = `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_01_48.png`;

const Emoticons01 = new EmoticonModel(
  'TALK_SEND_DEEP_FEATURE_EMOTICON_TOOLTIP_01',
  EmoticonType.EMOJI,
  {
    normal: E.EmoticonTabIcon1 as unknown as Base64,
    active: E.EmoticonTabActiveIcon1 as unknown as Base64,
  },
  <Icon.Emoji1Line />,
  <Icon.Emoji1Color />,
);

Emoticons01.insertEmoticon(
  'slightly smiling face',
  image_emoticon_01_1,
  image_emoticon_01_1,
);
Emoticons01.insertEmoticon(
  'smiling face with smiling eyes',
  image_emoticon_01_2,
  image_emoticon_01_2,
);
Emoticons01.insertEmoticon(
  'winking face',
  image_emoticon_01_3,
  image_emoticon_01_3,
);
Emoticons01.insertEmoticon(
  'unamused face',
  image_emoticon_01_4,
  image_emoticon_01_4,
);
Emoticons01.insertEmoticon(
  'grinning face with smiling eyes',
  image_emoticon_01_5,
  image_emoticon_01_5,
);
Emoticons01.insertEmoticon(
  'grinning squinting face',
  image_emoticon_01_6,
  image_emoticon_01_6,
);
Emoticons01.insertEmoticon(
  'face with tears of joy',
  image_emoticon_01_7,
  image_emoticon_01_7,
);
Emoticons01.insertEmoticon(
  'grinning face with big eyes',
  image_emoticon_01_8,
  image_emoticon_01_8,
);
Emoticons01.insertEmoticon(
  'grinning face',
  image_emoticon_01_9,
  image_emoticon_01_9,
);
Emoticons01.insertEmoticon(
  'smiling face',
  image_emoticon_01_10,
  image_emoticon_01_10,
);
Emoticons01.insertEmoticon(
  'flushed face',
  image_emoticon_01_11,
  image_emoticon_01_11,
);
Emoticons01.insertEmoticon(
  'smiling face with halo',
  image_emoticon_01_12,
  image_emoticon_01_12,
);
Emoticons01.insertEmoticon(
  'relieved face',
  image_emoticon_01_13,
  image_emoticon_01_13,
);
Emoticons01.insertEmoticon(
  'smirking face',
  image_emoticon_01_14,
  image_emoticon_01_14,
);
Emoticons01.insertEmoticon(
  'hushed face',
  image_emoticon_01_15,
  image_emoticon_01_15,
);
Emoticons01.insertEmoticon(
  'beaming face with smiling eyes',
  image_emoticon_01_16,
  image_emoticon_01_16,
);
Emoticons01.insertEmoticon(
  'rolling on the floor laughing',
  image_emoticon_01_17,
  image_emoticon_01_17,
);
Emoticons01.insertEmoticon(
  'grinning face with sweat',
  image_emoticon_01_18,
  image_emoticon_01_18,
);
Emoticons01.insertEmoticon(
  'smiling face with heart-eyes',
  image_emoticon_01_19,
  image_emoticon_01_19,
);
Emoticons01.insertEmoticon(
  'face blowing a kiss',
  image_emoticon_01_20,
  image_emoticon_01_20,
);
Emoticons01.insertEmoticon(
  'face savoring food',
  image_emoticon_01_21,
  image_emoticon_01_21,
);
Emoticons01.insertEmoticon(
  'face with tongue',
  image_emoticon_01_22,
  image_emoticon_01_22,
);
Emoticons01.insertEmoticon(
  'squinting face with tongue',
  image_emoticon_01_23,
  image_emoticon_01_23,
);
Emoticons01.insertEmoticon(
  'winking face with tongue',
  image_emoticon_01_24,
  image_emoticon_01_24,
);
Emoticons01.insertEmoticon(
  'smiling face with sunglasses',
  image_emoticon_01_25,
  image_emoticon_01_25,
);
Emoticons01.insertEmoticon(
  'sleeping face',
  image_emoticon_01_26,
  image_emoticon_01_26,
);
Emoticons01.insertEmoticon(
  'face with open mouth',
  image_emoticon_01_27,
  image_emoticon_01_27,
);
Emoticons01.insertEmoticon(
  'frowning face',
  image_emoticon_01_28,
  image_emoticon_01_28,
);
Emoticons01.insertEmoticon(
  'worried face',
  image_emoticon_01_29,
  image_emoticon_01_29,
);
Emoticons01.insertEmoticon(
  'persevering face',
  image_emoticon_01_30,
  image_emoticon_01_30,
);
Emoticons01.insertEmoticon(
  'anguished face',
  image_emoticon_01_31,
  image_emoticon_01_31,
);
Emoticons01.insertEmoticon(
  'slightly frowning face',
  image_emoticon_01_32,
  image_emoticon_01_32,
);
Emoticons01.insertEmoticon(
  'confused face',
  image_emoticon_01_33,
  image_emoticon_01_33,
);
Emoticons01.insertEmoticon(
  'disappointed face',
  image_emoticon_01_34,
  image_emoticon_01_34,
);
Emoticons01.insertEmoticon(
  'sad but relieved face',
  image_emoticon_01_35,
  image_emoticon_01_35,
);
Emoticons01.insertEmoticon(
  'face without mouth',
  image_emoticon_01_36,
  image_emoticon_01_36,
);
Emoticons01.insertEmoticon(
  'downcast face with sweat',
  image_emoticon_01_37,
  image_emoticon_01_37,
);
Emoticons01.insertEmoticon(
  'expressionless face',
  image_emoticon_01_38,
  image_emoticon_01_38,
);
Emoticons01.insertEmoticon(
  'loudly crying face',
  image_emoticon_01_39,
  image_emoticon_01_39,
);
Emoticons01.insertEmoticon(
  'neutral face',
  image_emoticon_01_40,
  image_emoticon_01_40,
);
Emoticons01.insertEmoticon(
  'crying face',
  image_emoticon_01_41,
  image_emoticon_01_41,
);
Emoticons01.insertEmoticon(
  'angry face',
  image_emoticon_01_42,
  image_emoticon_01_42,
);
Emoticons01.insertEmoticon(
  'face with symbols on mouth',
  image_emoticon_01_43,
  image_emoticon_01_43,
);
Emoticons01.insertEmoticon(
  'smiling face with horns',
  image_emoticon_01_44,
  image_emoticon_01_44,
);
Emoticons01.insertEmoticon(
  'face with head-bandage',
  image_emoticon_01_45,
  image_emoticon_01_45,
);
Emoticons01.insertEmoticon(
  'tired face',
  image_emoticon_01_46,
  image_emoticon_01_46,
);
Emoticons01.insertEmoticon(
  'nauseated face',
  image_emoticon_01_47,
  image_emoticon_01_47,
);
Emoticons01.insertEmoticon(
  'cold face',
  image_emoticon_01_48,
  image_emoticon_01_48,
);

export default Emoticons01;
