import { Icon } from '@wapl/ui';

import { ReactComponent as LocationIcon } from '@/assets/icons/Seoul_Loading.svg';
import { ReactComponent as WorkTalkIcon } from '@/assets/icons/WorkTalk.svg';

import * as S from './styled';

const Loading = () => (
  <S.LoadingWrapper>
    {(() => {
      switch (process.env.REACT_APP_PLATFORM) {
        case 'superapp':
        case 'foodist':
        case 'sen':
          return <S.ChatColor width={80} height={80} fill="#5782F6" />;
        case 'clas':
        case 'clas_admin':
          return <Icon.ChatColor width={80} height={80} />;
        case 'ekr':
          return <WorkTalkIcon width={80} height={80} />;
      }
    })()}
    <S.LocationIconWrapper>
      <LocationIcon width={40} height={40} />
    </S.LocationIconWrapper>
  </S.LoadingWrapper>
);

export default Loading;
