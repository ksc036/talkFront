import React from 'react';
import { useLocation } from 'react-router-dom';

import { FullScreenDialog } from '@wapl/ui';
import { observer } from 'mobx-react';

import UnreadUserContent from './UnreadUserContent';

const UnreadUserDialog = observer(() => {
  const { pathname } = useLocation();

  return (
    <FullScreenDialog open={pathname.includes('unreadUser')}>
      <UnreadUserContent />
    </FullScreenDialog>
  );
});

export default UnreadUserDialog;
