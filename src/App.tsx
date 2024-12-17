import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ShellProvider } from '@shell/sdk';
import { AuthProvider } from '@wapl/auth';
import { ToppingProvider } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import i18n from './i18n';
import { isMobile } from './utils';

export const App = observer(() => {
  const Mobile = lazy(() => import('./components/Mobile/Main'));
  const Desktop = lazy(() => import('./components/Desktop/App'));

  const isDev = process.env.NODE_ENV === 'development';

  const getEnv = () => {
    switch (process.env.REACT_APP_PLATFORM) {
      case 'ekr':
        return {
          BUSINESS_NAME: 'EKR',
          SOCKET_URL: process.env.REACT_APP_EKR_SOCKET_URL,
          COMMON_POOL_ID: process.env.REACT_APP_EKR_COMMON_POOL_ID,
          AUTH_POOL_ID: process.env.REACT_APP_EKR_AUTH_POOL_ID,
          TALK_POOL_ID: process.env.REACT_APP_EKR_TALK_POOL_ID,
          NOTICE_POOL_ID: process.env.REACT_APP_EKR_NOTICE_POOL_ID,
          CONTACT_POOL_ID: process.env.REACT_APP_EKR_CONTACT_POOL_ID,
          ORG_POOL_ID: process.env.REACT_APP_EKR_ORGANIZATION_POOL_ID,
          LOGIN_ID: process.env.REACT_APP_EKR_LOGIN_ID,
          PASSWORD: process.env.REACT_APP_EKR_LOGIN_PW,
        };
      case 'clas_admin':
        return {
          BUSINESS_NAME: 'CLAS',
          SOCKET_URL: process.env.REACT_APP_CLAS_SOCKET_URL,
          COMMON_POOL_ID: process.env.REACT_APP_CLAS_COMMON_POOL_ID,
          AUTH_POOL_ID: process.env.REACT_APP_CLAS_AUTH_POOL_ID,
          TALK_POOL_ID: process.env.REACT_APP_CLAS_TALK_POOL_ID,
          NOTICE_POOL_ID: process.env.REACT_APP_CLAS_NOTICE_POOL_ID,
          CONTACT_POOL_ID: process.env.REACT_APP_CLAS_CONTACT_POOL_ID,
          ORG_POOL_ID: process.env.REACT_APP_CLAS_ORGANIZATION_POOL_ID,
          LOGIN_ID: process.env.REACT_APP_CLAS_LOGIN_ID,
          PASSWORD: process.env.REACT_APP_CLAS_LOGIN_PW,
        };
      case 'sen':
        return {
          BUSINESS_NAME: 'SEN',
          SOCKET_URL: process.env.REACT_APP_SEN_SOCKET_URL,
          COMMON_POOL_ID: process.env.REACT_APP_SEN_COMMON_POOL_ID,
          AUTH_POOL_ID: process.env.REACT_APP_SEN_AUTH_POOL_ID,
          TALK_POOL_ID: process.env.REACT_APP_SEN_TALK_POOL_ID,
          NOTICE_POOL_ID: process.env.REACT_APP_SEN_NOTICE_POOL_ID,
          CONTACT_POOL_ID: process.env.REACT_APP_SEN_CONTACT_POOL_ID,
          ORG_POOL_ID: process.env.REACT_APP_SEN_ORGANIZATION_POOL_ID,
          LOGIN_ID: process.env.REACT_APP_SEN_LOGIN_ID,
          PASSWORD: process.env.REACT_APP_SEN_LOGIN_PW,
          HANCOM_OFFICE_URL: process.env.REACT_APP_SEN_HANCOM_OFFICE_URL,
        };
      default:
        return {
          BUSINESS_NAME: 'SUPERAPP',
          SOCKET_URL: process.env.REACT_APP_SUPERAPP_SOCKET_URL,
          COMMON_POOL_ID: process.env.REACT_APP_SUPERAPP_COMMON_POOL_ID,
          AUTH_POOL_ID: process.env.REACT_APP_SUPERAPP_AUTH_POOL_ID,
          TALK_POOL_ID: process.env.REACT_APP_SUPERAPP_TALK_POOL_ID,
          NOTICE_POOL_ID: process.env.REACT_APP_SUPERAPP_NOTICE_POOL_ID,
          CONTACT_POOL_ID: process.env.REACT_APP_SUPERAPP_CONTACT_POOL_ID,
          ORG_POOL_ID: process.env.REACT_APP_SUPERAPP_ORGANIZATION_POOL_ID,
          LOGIN_ID: process.env.REACT_APP_SUPERAPP_LOGIN_ID,
          PASSWORD: process.env.REACT_APP_SUPERAPP_LOGIN_PW,
        } as { [key: string]: string };
    }
  };

  const getBusinessName = () => {
    switch (process.env.REACT_APP_PLATFORM) {
      case 'ekr':
        return 'ekr';
      case 'sen':
        return 'sen';
      default:
        return 'superApp';
    }
  };

  return (
    <ShellProvider
      isDev={isDev}
      devEnv={isDev ? getEnv() : null}
      showDevController={false}
    >
      <AuthProvider
        isDev={isDev}
        loginId={getEnv().LOGIN_ID}
        password={getEnv().PASSWORD}
      >
        <ToppingProvider i18n={i18n} businessName={getBusinessName()}>
          {isMobile() ? (
            <BrowserRouter>
              <Suspense fallback={<></>}>
                <Mobile />
              </Suspense>
            </BrowserRouter>
          ) : (
            <Suspense fallback={<></>}>
              <Desktop />
            </Suspense>
          )}
        </ToppingProvider>
      </AuthProvider>
    </ShellProvider>
  );
});

export default App;
