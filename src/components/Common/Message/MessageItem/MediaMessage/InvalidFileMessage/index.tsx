import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './styled';

interface InvalidFileMessageProps {
  showText: boolean;
  isReply?: boolean;
  tempId?: string;
  isThumbnailLoaded: boolean;
}

const InvalidFileMessage = observer(
  ({
    showText,
    isReply,
    tempId,
    isThumbnailLoaded,
  }: InvalidFileMessageProps) => {
    const { Color } = useTheme();
    const { uiStore } = useStore();

    const handleInvalidMessageClick = () => {
      uiStore.openDialog('invalidFile');
    };

    return (
      <S.Wrapper onClick={handleInvalidMessageClick}>
        {isThumbnailLoaded && !tempId && (
          <>
            <Icon.CorruptedFill
              width={24}
              height={24}
              color={Color.Gray[400]}
            />
            {showText && '손상되거나 삭제된 파일입니다.'}
          </>
        )}
      </S.Wrapper>
    );
  },
);
export default InvalidFileMessage;
