import { useState } from 'react';

import { Icon, Mui, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { EditorStore } from '@/stores/EditorStore';

import ToolbarButton from '../ToolbarButton';

import * as S from './styled';

interface ColorPickerProps {
  onChange: (value: string) => void;
  color: string;
  editorStore: EditorStore;
}

const ColorPicker = observer((props: ColorPickerProps) => {
  const { onChange, color, editorStore } = props;
  const { Color } = useTheme();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [colorAnchorEl, setColorAnchorEl] = useState<null | HTMLElement>(null);
  const [cursorRange, setCursorRange] = useState(-1);

  const handleColorPickerOpen = (event: React.MouseEvent<HTMLElement>) => {
    setIsColorPickerOpen(true);
    setColorAnchorEl(event.currentTarget);
    if (editorStore.quillRef?.current) {
      setCursorRange(editorStore.getSelection().index);
    }
  };

  const handleColorPickerClose = () => {
    setColorAnchorEl(null);
    setIsColorPickerOpen(false);
    if (editorStore.quillRef?.current) {
      editorStore.setCursor(cursorRange);
    }
  };

  const handlePickColor = (color: string) => {
    onChange(color);
    handleColorPickerClose();
  };

  const ColorPicker = ({ color }: { color: string }) => {
    return (
      <S.ColorPicker
        color={color}
        onClick={() => handlePickColor(color)}
      ></S.ColorPicker>
    );
  };
  return (
    <>
      <ToolbarButton
        icon={
          <Icon.EditingTextColorLine
            color={typeof color == 'string' ? color : Color.Gray[900]}
          />
        }
        title={'글자색'}
        onClick={handleColorPickerOpen}
        isActive={isColorPickerOpen}
      />
      {isColorPickerOpen && (
        <Mui.Popover
          open={isColorPickerOpen}
          onClose={handleColorPickerClose}
          anchorEl={colorAnchorEl}
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
              width: '200px',
              height: '92px',
              boxShadow: '0px 0px 8px rgb(0 0 0 / 20%)',
              backgroundColor: 'transparent',
              borderRadius: '8px',
              mt: -0.5,
            },
          }}
        >
          <S.ColorPickerWrapper>
            <ColorPicker color={Color.Gray[900]} />
            <ColorPicker color={'#CB1818'} />
            <ColorPicker color={'#337505'} />
            <ColorPicker color={'#006CA2'} />
            <ColorPicker color={'#AB21B8'} />
            <ColorPicker color={'#666666'} />
            <ColorPicker color={'#890000'} />
            <ColorPicker color={'#004D0A'} />
            <ColorPicker color={'#0036AA'} />
            <ColorPicker color={'#6700A3'} />
          </S.ColorPickerWrapper>
        </Mui.Popover>
      )}
    </>
  );
});

export default ColorPicker;
