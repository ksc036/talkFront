import { ROOMLINK_MESSAGE } from '@/constants';
import { MessageModel } from '@/models';
import * as T from '@types';

import { generateRoleMessage, generateVOCMessage } from './botMessageGenerate';
import { getHTMLStringText } from './editor';
import { stringToMoment } from './timeStampConverter';
import { contentToParseToList, isJsonString } from './util';

export const urlFormat = new RegExp(
  '(((?:https?:\\/\\/)|(?:www\\.))+(?:(?:[a-zA-Z0-9가-힣ㅏ-ㅣㄱ-ㅎ\\-]+)\\.)+(?:[a-zA-Z0-9가-힣ㅏ-ㅣㄱ-ㅎ\\-]+)(?:[a-zA-z0-9가-힣ㅏ-ㅣㄱ-ㅎ\\!\\/\\?=\\%\\&\\.\\-\\:\\#\\{\\}\\;\\(\\)\\@])+)',
);

// .com 또는 .co.kr .net .ai로 끝나는 url
// 추후 기획에 따라 수정 가능
export const urlFormat2 = new RegExp(
  '(?:[a-zA-Z0-9가-힣ㅏ-ㅣㄱ-ㅎ\\-]+).[.](co.kr|com|net|ai)',
);
// const urlFormat2 = new RegExp(
//   '((?:(?:[a-zA-Z0-9가-힣ㅏ-ㅣㄱ-ㅎ\\-]+)\\.)+(?:[a-zA-Z0-9가-힣ㅏ-ㅣㄱ-ㅎ\\-]+)(?:[a-zA-z0-9가-힣ㅏ-ㅣㄱ-ㅎ\\!\\/\\?=\\%\\&\\.\\-\\:\\#\\{\\}\\;\\(\\)])+)',
// );

export function parseEmoticon(text: string) {
  const name = text.replace(/:/g, '');
  return `<{\"type\":\"emoticon\",\"emoticonName\":\":${name}:\"}>`;
}

export function parseMention(id: number, name: string) {
  return `<{\"type\":\"mention\",\"mentionId\":${id},\"mentionName\":\"${name}\"}>`;
}

export function parseHyperLink(url: string, text: string) {
  return `<{\"type\":\"hyperLink\",\"url\":\"${url}\",\"text\":\"${text}\"}>`;
}

export function parseAngleBracket(text: string) {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function getUrl(text: string) {
  const url = text.match(urlFormat);
  if (url) return url[0];
  const url2 = text.match(urlFormat2);
  if (url2) return url2[0];

  return '';
}

function isSameDay(prevMsg: MessageModel, currMsg: MessageModel): boolean {
  const prev = stringToMoment(prevMsg.createdAt);
  const curr = stringToMoment(currMsg.createdAt);
  return prev.isSame(curr, 'day');
}

function isSameTime(prevMsg: MessageModel, currMsg: MessageModel): boolean {
  const prev = stringToMoment(prevMsg.createdAt);
  const curr = stringToMoment(currMsg.createdAt);
  return prev.isSame(curr, 'minutes');
}

function isSameSender(prevMsg: MessageModel, currMsg: MessageModel): boolean {
  return prevMsg.personaId === currMsg.personaId;
}

function compareMessageOrderInfo(prevMsg: MessageModel, currMsg: MessageModel) {
  if (!prevMsg.isAutoMessage && !currMsg.isAutoMessage) {
    if (isSameTime(prevMsg, currMsg) && isSameSender(prevMsg, currMsg)) {
      prevMsg.setTail(false);
      currMsg.setHead(false);
    } else {
      prevMsg.setTail(true);
      currMsg.setHead(true);
    }
  } else if (!prevMsg.isAutoMessage && currMsg.isAutoMessage) {
    prevMsg.setTail(true);
  } else if (prevMsg.isAutoMessage && !currMsg.isAutoMessage) {
    currMsg.setHead(true);
  }
  if (isSameDay(prevMsg, currMsg)) {
    currMsg.setFirst(false);
  } else {
    currMsg.setFirst(true);
  }
}

/**
 * message의 first, head, tail set해주는 함수
 * first - 해당 날짜의 가장 첫번째 메시지 (날짜 표시)
 * head - 같은 유저가 같은 시간에 보낸 연속적인 메시지의 처음 메시지 (프로필 표시)
 * tail - 같은 유저가 같은 시간에 보낸 연속적인 메시지의 마지막 메시지 (시간 표시)
 * @param prevMessages - 이전에 존재하던 메시지, messageStore.messages
 * @param newMessages - 새로 가져온 메시지 (위/아래 스크롤, 웹소켓 메시지)
 * @param insertIndex - newMessages가 삽입될 prevMessages의 index
 * insertIndex = -1 : prevMessages 이전에 삽입. (위로 스크롤)
 * insertIndex = prevMessages.length : prevMessages 이후에 삽입. (아래로 스크롤, 웹소켓 메시지로 받을 경우, createMessage 응답으로 받을 경우)
 * insertIndex >= 0 && insertIndex < prevMessages.length : prevMessages 중간에 삽입. (웹소켓 메시지로 받을 경우, createMessage 응답으로 받을 경우)
 */
export function setMessageOrderInfo(
  prevMessages: MessageModel[],
  newMessages: MessageModel[],
  insertIndex: number,
) {
  // 새로운 메시지가 없을 경우 순서 정보 수정 필요 없음
  if (newMessages.length === 0) {
    return;
  }

  // 자동 메시지에 대한 순서 정보
  if (newMessages[0].isAutoMessage) {
    if (
      prevMessages.length === 0 ||
      !isSameDay(prevMessages[prevMessages.length - 1], newMessages[0])
    )
      newMessages[0].setFirst(true);
  }

  // Temp 메시지를 제외한 메시지 (Temp = 아직 전송 완료되지 않은 메시지)
  const prevMessagesWithoutTmp = prevMessages.filter(
    (message) => message.msgId !== 0,
  );

  // new 메시지 리스트의 first, head, tail 정의
  for (let i = 1; i < newMessages.length; i++) {
    const prevMsg = newMessages[i - 1];
    const currMsg = newMessages[i];
    compareMessageOrderInfo(prevMsg, currMsg);
  }

  // 1. 위로 스크롤 시 새로운 메세지 받아올 때, newMsg.concat(prevMsg), insertIndex === -1
  // 2. 아래로 스크로 시 새로운 메시지 받아올 때, prevMsg.concat(newMsg), insertIndex === prevMessages.length / 웹소켓으로 새로운 메시지 받아올 때
  // 3. 웹소켓으로 새로운 메시지 받아올 때, (insertIndex >= 0 && inserIndex < prevMessages.length) && newMessages.length === 1
  // Todo: 3번 케이스인 경우 없는 것 같음.
  if (insertIndex === -1) {
    // 1
    if (prevMessagesWithoutTmp.length === 0) {
      newMessages[newMessages.length - 1].setTail(true);
    } else {
      compareMessageOrderInfo(
        newMessages[newMessages.length - 1],
        prevMessagesWithoutTmp[0],
      );
    }
  } else if (insertIndex === prevMessages.length) {
    // 2
    if (prevMessagesWithoutTmp.length === 0) {
      newMessages[0].setFirst(true);
      newMessages[0].setHead(true);
    } else {
      compareMessageOrderInfo(
        prevMessagesWithoutTmp[prevMessagesWithoutTmp.length - 1],
        newMessages[0],
      );
      if (newMessages.length === 1) newMessages[0].setTail(true);
    }
  } else if (insertIndex >= 0 && insertIndex < prevMessages.length) {
    // 3
    if (insertIndex - 1 >= 0 && prevMessages[insertIndex - 1]) {
      // insert될 index의 이전 메시지와 비교
      compareMessageOrderInfo(prevMessages[insertIndex - 1], newMessages[0]);
    }
    if (insertIndex < prevMessages.length && prevMessages[insertIndex]) {
      // insert될 index의 이후 메시지와 비교
      compareMessageOrderInfo(newMessages[0], prevMessages[insertIndex]);
    }
  }
}

export async function parseContentRoomMessage(
  msgBody: T.MsgBody,
  type: number,
  isDeleted: -1 | 0 | 1,
  isBlocked?: boolean,
) {
  let content = '';

  if (isDeleted === -1) return '';
  if (isDeleted === 1) return '삭제된 메시지입니다.';
  if (isBlocked) return '차단한 유저의 메시지입니다.';

  if (type & T.msgType.notice) {
    content += `공지: `;
    if (type & T.msgType.vote) {
      content += `${msgBody.noticeBody?.voteBody?.title}`;
    } else {
      const parseList = contentToParseToList(
        msgBody.noticeBody?.content as string,
      );
      parseList.map((parsedText) => {
        const j = isJsonString(parsedText);
        if (j?.type === 'mention') content += `@${j?.mentionName}`;
        else if (j?.type === 'emoticon') content += '이모티콘';
        else content += parsedText;
      });
    }
    return content;
  }

  if (type & T.msgType.file) content = '파일';
  else if (type & T.msgType.image) content = '이미지';
  else if (type & T.msgType.video) content = '동영상';
  else if (type & T.msgType.sticker) content = '이모티콘';
  else if (type & T.msgType.vote) content = `투표: ${msgBody.voteBody?.title}`;
  else if (type & T.msgType.autoMsg) content = '';
  else if (type & T.msgType.mail) {
    if (msgBody.mailStateType === 'RECEIVE')
      content = '메일이 수신되었습니다. ';
    else if (msgBody.mailStateType === 'SEND')
      content = '메일이 전송되었습니다. ';
  } else if (type & T.msgType.meeting) {
    content =
      msgBody.meetingType === 'START'
        ? '회의를 시작합니다.'
        : '회의가 종료되었습니다.';
  } else if (type & T.msgType.calendar) {
    if (msgBody.eventType === 'SHARE') {
      content = '일정이 공유되었습니다.';
    } else if (msgBody.eventType === 'DELETE') {
      content = '일정이 취소되었습니다.';
    } else if (msgBody.eventType === 'CREATE') {
      content = '일정이 생성되었습니다.';
    } else if (msgBody.eventType === 'START_NOTI') {
      content = `일정이 시작되기 ${msgBody?.notiTime ?? ''} 입니다.`;
    } else if (msgBody.eventType === 'START') {
      content = '일정이 지금 시작되었습니다.';
    }
  } else if (type & T.msgType.bot && type & T.msgType.url) {
    content = ROOMLINK_MESSAGE + content;
  } else if (type & T.msgType.bot) {
    let botTitle = '';
    switch (msgBody.botType) {
      case 'voc':
        botTitle = generateVOCMessage(
          msgBody.vocType,
          msgBody.vocBody?.vocId,
        ).title;
        break;
      case 'role':
        return (await generateRoleMessage(msgBody.roleType, msgBody.roleBody))
          .title;
    }
    content += botTitle;
  } else if (type & T.msgType.editor) {
    content = getHTMLStringText(msgBody?.content as string);
  } else if (msgBody.content) {
    const parseList = contentToParseToList(msgBody.content as string);
    parseList.map((parsedText) => {
      const j = isJsonString(parsedText);
      if (j?.type === 'mention') content += `@${j?.mentionName}`;
      else if (j?.type === 'emoticon') content += '이모티콘';
      else content += parsedText;
    });
  }
  return content;
}
