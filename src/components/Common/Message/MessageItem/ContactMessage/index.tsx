import React from 'react';

import { Avatar, Icon, useTheme } from '@wapl/ui';

import { MessageModel } from '@/models';

import * as S from './styled';

interface ContactMessageProps {
  message: MessageModel;
  isReply?: boolean;
}

const ContactMessage = (props: ContactMessageProps) => {
  // const { message, isReply } = props;
  const { isReply } = props;

  const { Color } = useTheme();

  const handleClickDetail = () => {
    console.log('handleClickDetail');
  };

  return (
    <S.ContactWrapper isReply={isReply}>
      <S.ContactBody>
        <Avatar />
        <S.ContactInfo>
          <S.ContactSubTitle>{'연락처'}</S.ContactSubTitle>
          <S.ContactName>{'문다영'}</S.ContactName>
        </S.ContactInfo>
      </S.ContactBody>
      <S.ContactFooter onClick={handleClickDetail}>
        <S.ContactDetailText>{'자세히 보기'}</S.ContactDetailText>
        <Icon.ArrowFrontLine width={16} height={16} color={Color.Gray[400]} />
      </S.ContactFooter>
    </S.ContactWrapper>
  );
};

export default ContactMessage;
