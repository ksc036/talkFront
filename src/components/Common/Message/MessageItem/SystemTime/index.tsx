import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';
import { isToday, timeStampFormat } from '@/utils';
import isDarkMode from '@/utils/darkModeDetect';

import * as S from './styled';

interface SystemTimeProps {
  time: string;
}

const SystemTime = observer((props: SystemTimeProps) => {
  const { time } = props;
  const { configStore } = useStore();
  return (
    <S.SystemTimeWrapper>
      <S.SystemTimeText
        className="SystemTime"
        backgroundColor={
          isDarkMode() ? '#3C4043' : configStore.AutoMessageBackgroundColor
        }
        color={isDarkMode() ? 'white' : configStore.AutoMessageTextColor}
      >
        {isToday(time)
          ? '오늘'
          : timeStampFormat(time, 'YYYY년 MM월 DD일 dddd')}
      </S.SystemTimeText>
    </S.SystemTimeWrapper>
  );
});

export default SystemTime;
