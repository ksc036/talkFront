import { useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { EditorStore } from '@/stores/EditorStore';

import * as S from './Styled';

const Count = observer(({ editorStore }: { editorStore: EditorStore }) => {
  const count = editorStore.textLength;
  const theme = useTheme();
  return (
    <S.Wrapper theme={theme} count={count}>
      {count >= 4000 ? count + '/5000자' : ''}
    </S.Wrapper>
  );
});

export default Count;
