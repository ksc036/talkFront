import React from 'react';
import { useLocation } from 'react-router-dom';

import { FullScreenDialog } from '@wapl/ui';
import { observer } from 'mobx-react';

import NoticeEditor from './NoticeEditor';
import NoticeList from './NoticeList';
import NoticeRead from './NoticeRead';

const NoticeDialog = observer(() => {
  const { pathname, hash } = useLocation();

  const NoticeCotent = () => {
    switch (hash) {
      case '#list':
        return <NoticeList />;
      case '#read':
      case '#notice-report':
        return <NoticeRead />;
      case '#create':
      case '#update':
        return <NoticeEditor />;
      default:
        return null;
    }
  };

  return (
    <FullScreenDialog open={pathname.includes('notice')}>
      <NoticeCotent />
    </FullScreenDialog>
  );
});

export default NoticeDialog;
