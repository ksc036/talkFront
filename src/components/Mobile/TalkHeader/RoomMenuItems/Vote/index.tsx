import { Icon, Mui } from '@wapl/ui';
import { transaction } from 'mobx';

import { useStore } from '@/stores';

import { RoomMenuItem } from '../../RoomMenuItem';

interface VoteProps extends Mui.MenuItemProps {
  closeMenu: () => void;
}

export const Vote = (props: VoteProps) => {
  const { closeMenu } = props;
  const { uiStore } = useStore();

  const handleOnClick = () => {
    transaction(() => {
      uiStore.setVoteDialogMode('allVote');
      uiStore.openDialog('vote');
      closeMenu();
    });
  };

  return (
    <>
      <RoomMenuItem
        onClick={handleOnClick}
        icon={<Icon.VoteLine width={20} height={20} />}
        text="투표"
      />
    </>
  );
};
