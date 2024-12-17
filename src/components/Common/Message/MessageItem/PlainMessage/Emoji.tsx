import React from 'react';

import { EmoticonModel } from '@/models';

interface EmojiProps {
  emoticonName: string;
}

const Emoji = (props: EmojiProps) => {
  const { emoticonName } = props;
  return (
    <img
      className="emoticon"
      src={EmoticonModel.getEmoticon(emoticonName)?.image}
      alt={emoticonName}
      data-alias={emoticonName}
      height={20}
      style={{ verticalAlign: 'top' }}
    />
  );
};

export default Emoji;
