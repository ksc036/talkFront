import { DialogHeader, Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import { ReactComponent as NoticeIcon } from '../../../../assets/icons/NoticeIcon.svg';
import { ReactComponent as VoteIcon } from '../../../../assets/icons/VoteIcon.svg';

import * as S from './styled';

type CommonDialogHeaderProps = {
  iconType: 'vote' | 'notice' | 'back' | 'none';
  title: string;
  onIconClick?: () => void;
  onClose: () => void;
};

const CommonDialogHeader = observer(
  ({ iconType, title, onIconClick, onClose }: CommonDialogHeaderProps) => {
    const { configStore } = useStore();

    const showIcon =
      iconType === 'back' ? true : configStore.DialogHeaderStyle.Icon;

    const icon = () => {
      switch (iconType) {
        case 'vote':
          return <VoteIcon width={24} height={24} />;
        case 'notice':
          return <NoticeIcon width={24} height={24} />;
        case 'back':
          return <Icon.ArrowBackLine width={24} height={24} />;
        case 'none':
          return null;
      }
    };

    return (
      <S.CommonDialogHeaderWrapper
        backgroundColor={
          configStore.DialogHeaderStyle.Background ? configStore.MainColor : ''
        }
      >
        <DialogHeader
          title={title}
          startAdornment={
            <S.IconsWrapper
              onClick={onIconClick}
              enableCursor={iconType === 'back'}
              hasMarginRight={showIcon}
            >
              {showIcon && icon()}
            </S.IconsWrapper>
          }
          handleClose={onClose}
        />
      </S.CommonDialogHeaderWrapper>
    );
  },
);

export default CommonDialogHeader;
