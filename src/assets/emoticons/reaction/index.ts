/* eslint-disable camelcase */
import { EmoticonModel } from '@/models';

import EmoticonOriginURL from '../EmoticonOriginURL';

const emoticonTabIndex = 'reaction';

const reaction01 = `${EmoticonOriginURL}/${emoticonTabIndex}/reaction01.png`;
const reaction02 = `${EmoticonOriginURL}/${emoticonTabIndex}/reaction02.png`;
const reaction03 = `${EmoticonOriginURL}/${emoticonTabIndex}/reaction03.png`;
const reaction04 = `${EmoticonOriginURL}/${emoticonTabIndex}/reaction04.png`;
const reaction05 = `${EmoticonOriginURL}/${emoticonTabIndex}/reaction05.png`;
const reaction06 = `${EmoticonOriginURL}/${emoticonTabIndex}/reaction06.png`;
const reaction07 = `${EmoticonOriginURL}/${emoticonTabIndex}/reaction07.png`;
const reaction08 = `${EmoticonOriginURL}/${emoticonTabIndex}/reaction08.png`;
const reaction09 = `${EmoticonOriginURL}/${emoticonTabIndex}/reaction09.png`;
const reaction10 = `${EmoticonOriginURL}/${emoticonTabIndex}/reaction10.png`;

export const Reaction = new EmoticonModel();

Reaction.insertEmoticon('reaction yup', reaction01, reaction01);
Reaction.insertEmoticon('reaction omg', reaction02, reaction02);
Reaction.insertEmoticon(
  'reaction slightly smiling face',
  reaction03,
  reaction03,
);
Reaction.insertEmoticon(
  'reaction grinning face with smiling eyes',
  reaction04,
  reaction04,
);
Reaction.insertEmoticon('reaction hushed face', reaction05, reaction05);
Reaction.insertEmoticon('reaction winking face', reaction06, reaction06);
Reaction.insertEmoticon(
  'reaction smiling face with heart-eyes',
  reaction07,
  reaction07,
);
Reaction.insertEmoticon(
  'reaction sad but relieved face',
  reaction08,
  reaction08,
);
Reaction.insertEmoticon('reaction crying face', reaction09, reaction09);
Reaction.insertEmoticon('reaction enraged face', reaction10, reaction10);

export default Reaction;
