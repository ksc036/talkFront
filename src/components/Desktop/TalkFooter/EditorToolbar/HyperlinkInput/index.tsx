import { ChangeEvent, useEffect, useState } from 'react';

import { Icon, Mui } from '@wapl/ui';
import { observer } from 'mobx-react-lite';
import { RangeStatic } from 'quill';

import { ReactComponent as Hyperlink } from '@/assets/icons/Hyperlink.svg';
import CommonButton from '@/components/Common/Button';
import { EditorStore } from '@/stores/EditorStore';
import { getUrl } from '@/utils';

import ToolbarButton from '../ToolbarButton';

import * as S from './styled';

interface HyperlinkInputProps {
  onChange: (url: string, text: string, range: RangeStatic | null) => void;
  editorStore: EditorStore;
}

const HyperlinkInput = observer((props: HyperlinkInputProps) => {
  const { onChange, editorStore } = props;

  const [openHyperLinkEditor, setOpenHyperLinkEditor] = useState(false);
  const [hyperLinkAnchorEl, setHyperLinkAnchorEl] =
    useState<null | HTMLElement>(null);
  const [cursorRange, setCursorRange] = useState<RangeStatic | null>(null);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);

  useEffect(() => {
    if (!!getUrl(url) && !!text) setIsButtonActive(true);
  }, [url, text]);

  const handleOpenHyperLinkEditor = (event: React.MouseEvent<HTMLElement>) => {
    setOpenHyperLinkEditor(true);
    setHyperLinkAnchorEl(event.currentTarget);
    if (editorStore.quillRef?.current) {
      setCursorRange(editorStore.getSelection());
    }
  };

  const handleCloseHyperLinkEditor = () => {
    setHyperLinkAnchorEl(null);
    setOpenHyperLinkEditor(false);
    setUrl('');
    setText('');
    if (editorStore.quillRef?.current && cursorRange !== null) {
      editorStore.setCursor(cursorRange.index);
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleClickButton = () => {
    onChange(url, text, cursorRange);
    handleCloseHyperLinkEditor();
  };

  return (
    <>
      <ToolbarButton
        icon={<Hyperlink />}
        title={'링크'}
        isActive={openHyperLinkEditor}
        onClick={handleOpenHyperLinkEditor}
      />
      {openHyperLinkEditor && (
        <Mui.Popover
          open={openHyperLinkEditor}
          onClose={handleCloseHyperLinkEditor}
          anchorEl={hyperLinkAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              width: '324px',
              height: '200px',
              boxShadow: '0px 0px 8px rgb(0 0 0 / 20%)',
              backgroundColor: 'transparent',
              borderRadius: '8px',
              mt: -0.5,
            },
          }}
        >
          <S.HyperLinkWrapper>
            <S.CloseButtonWrapper onClick={handleCloseHyperLinkEditor}>
              <Icon.CloseLine width={16} height={16} />
            </S.CloseButtonWrapper>
            <S.TitleArea>링크 추가</S.TitleArea>
            <S.LinkTextField
              type="text"
              variant="outlined"
              placeholder="링크를 입력하세요."
              value={url}
              onChange={handleUrlChange}
              visibleClear={false}
              autoFocus
            ></S.LinkTextField>
            <S.LinkTextField
              type="text"
              variant="outlined"
              placeholder="텍스트를 입력하세요."
              limit={40}
              value={text}
              onChange={handleTextChange}
              visibleClear={false}
            ></S.LinkTextField>
            <S.ButtonWrapper>
              <CommonButton
                size="medium"
                onClick={handleClickButton}
                disabled={!isButtonActive}
              >
                확인
              </CommonButton>
            </S.ButtonWrapper>
          </S.HyperLinkWrapper>
        </Mui.Popover>
      )}
    </>
  );
});

export default HyperlinkInput;
