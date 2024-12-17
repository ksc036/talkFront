import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './styled';

const ImageViewer = observer(() => {
  const { fileStore } = useStore();

  return (
    <S.ImageViewer
      src={fileStore.mediaPreviewData?.source ?? undefined}
      onClick={(e) => e.stopPropagation()}
    />
  );
});

export default ImageViewer;
