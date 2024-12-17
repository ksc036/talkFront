import { useRef, useEffect, useLayoutEffect } from 'react';

import {
  PickerContainer,
  PickerItemContainer,
  PickerValueWrapper,
} from './TitlePicker.style';

interface ValueProps {
  value: string;
  onClick: (value: string) => void;
  isSelected?: boolean;
}

const PickerValue = ({ value, onClick, isSelected = false }: ValueProps) => {
  return (
    <PickerValueWrapper
      className={isSelected ? 'selected' : ''}
      onClick={() => onClick(value)}
    >
      {value}
    </PickerValueWrapper>
  );
};

interface Props {
  width: number;
  item: string[];
  selectedValue: string;
  onValueClick: (value: string) => void;
  onOutsideClick?: () => void;
}

const TitlePicker = ({
  width,
  item,
  selectedValue,
  onValueClick,
  onOutsideClick,
}: Props) => {
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      !(e.target instanceof Node) ||
      pickerRef.current?.parentElement?.contains(e.target) ||
      !onOutsideClick
    ) {
      return;
    }
    onOutsideClick();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  });

  useLayoutEffect(() => {
    if (!pickerRef.current) return;
    const scrollTop = Array.from(
      pickerRef.current.querySelectorAll('div'),
    ).find((el) => el.textContent === selectedValue)?.offsetTop;
    if (scrollTop) pickerRef.current.scrollTop = scrollTop;
  }, []);

  return (
    <PickerContainer width={width}>
      <PickerItemContainer ref={pickerRef}>
        {item.map((value) => (
          <PickerValue
            key={value}
            value={value}
            onClick={onValueClick}
            isSelected={value === selectedValue}
          />
        ))}
      </PickerItemContainer>
    </PickerContainer>
  );
};

export default TitlePicker;
