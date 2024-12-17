import { Icon, useTheme } from '@wapl/ui';

import TalkFooterItem from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItem';
import { useStore } from '@/stores';

const Vote = () => {
  const { uiStore } = useStore();
  const { Color } = useTheme();

  const handleClick = () => {
    uiStore.setVoteDialogMode('createVote');
    uiStore.openDialog('vote');
  };

  return (
    <>
      <TalkFooterItem
        title="투표"
        icon={<Icon.VoteLine width={24} height={24} color={Color.Gray[900]} />}
        onClick={handleClick}
      />
    </>
  );
};

export default Vote;
