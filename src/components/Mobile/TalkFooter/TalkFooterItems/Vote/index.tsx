import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import TalkFooterItem from '@/components/Desktop/TalkFooter/DefaultFooter/TalkFooterItem';
import { useStore } from '@/stores';

const Vote = observer(() => {
  const { uiStore } = useStore();
  const { Color } = useTheme();

  const handleClick = () => {
    uiStore.setVoteDialogMode('allVote');
    uiStore.openDialog('vote');
  };

  return (
    <>
      <TalkFooterItem
        icon={<Icon.VoteLine width={24} height={24} color={Color.Gray[900]} />}
        onClick={handleClick}
      />
    </>
  );
});

export default Vote;
