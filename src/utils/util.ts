import { RefObject } from 'react';

import { RoomModel, PersonaModel, RoomMember } from '@wapl/core';
import moment from 'moment-timezone';

import * as T from '@/@types';
import { MsgBody } from '@/@types';
import { LinkModel, MessageModel, NoticeModel, VoteMD } from '@/models';
/**
 * 문자열이 JSON String인지 확인하는 함수.
 * @param   {string} str        JSON String인지 확인할 문자열
 * @returns {object | boolean}  JSON String인 경우 parse된 object 반환, 아닌 경우 false 반환
 */
export const isJsonString = (str: string) => {
  try {
    const jsonObject = JSON.parse(str);
    return jsonObject instanceof Object ? jsonObject : false;
  } catch (e) {
    return false;
  }
};

export const copyObject = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    const copy: any[] = [];
    for (const item of obj) {
      copy.push(copyObject(item));
    }
    return copy as T;
  }
  const copy: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = copyObject((obj as { [key: string]: any })[key]);
    }
  }

  return copy as T;
};

export const parseContent = (content: string) => {
  const parsedMessage = content
    .split(/[<>]/g)
    .filter((item) => item !== '' && item !== null && item !== undefined);
  const plainMessage = parsedMessage
    ?.map((message) => {
      const jsonObj = isJsonString(message);
      if (jsonObj?.type === 'mention') {
        return `@${jsonObj?.mentionName}`;
      } else if (jsonObj?.type === 'emoticon') {
        return `${jsonObj?.emoticonName}`;
      }
      return message;
    })
    .join('');
  return plainMessage;
};

export const parseNewLine = (title: string) => {
  if (title.includes('\n')) {
    return title
      .split('\n')
      .filter((elem) => elem != '')
      .join(' ');
  } else return title;
};

export const mergeObjectByArray = <T>(arr: T[]): { [key: string]: unknown } => {
  const rtn = {};

  arr.forEach((obj) => {
    Object.assign(rtn, obj);
  });

  return rtn;
};

export const escapeHtml = (str: string) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/₩/g, '&#8361;');
};

export const unescapeHtml = (str: string) => {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8361;/g, '₩');
};

export const contentToParseToList = (content: string) => {
  return content
    .split(/[<>]/g)
    .filter((item) => item !== '' && item !== null && item !== undefined);
};

export const copyToClipboard = async (
  textToCopy: string,
  ref?: RefObject<HTMLDivElement>,
) => {
  if (typeof navigator.clipboard == 'undefined') {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';

    if (ref) {
      ref.current?.append(textArea);
    } else {
      document.body.append(textArea);
    }

    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
    }
  } else {
    await navigator.clipboard.writeText(textToCopy);
  }
};

/**
 * RoomModel을 기반으로 roomType을 반환하는 함수
 * @param {RoomModel} currentRoom 현재 방 정보를 담은 RoomModel 객체
 * @returns {Object} 각 방 유형에 대한 boolean 값을 포함하는 객체
 */
export const getRoomType = (currentRoom: RoomModel) => {
  const isDm = currentRoom.typeName === '1:1';
  const isMyRoom = currentRoom.typeName === '마이';
  const isOpenRoom = currentRoom.typeName === '오픈';
  const isPrivate = currentRoom.typeName === '일반';
  const isOrg = currentRoom.typeName === '조직';
  const isBotRoom = currentRoom.typeName === '봇';

  return {
    isDm,
    isMyRoom,
    isOpenRoom,
    isPrivate,
    isOrg,
    isBotRoom,
  };
};

/*
 * 농어촌 업무톡 또는 톡톡 (APP_ID: tmax.core-ai.talk) 1:1룸 타입 아이디는 7
 * 농어촌 개인톡 (APP_ID: tmax.core-ai.personal-talk) 1:1룸은 8
 * 그 외 사업건엑서는 1:1룸 타입 아이디는 4
 */
export const getDmRoomTypeId = () => {
  switch (window.env.BUSINESS_NAME) {
    case 'EKR':
      if (window.APP_ID === 'tmax.core-ai.talk') {
        return 7;
      } else if (window.APP_ID === 'tmax.core-ai.personal-talk') {
        return 8;
      } else {
        return 4;
      }
    default:
      return 4;
  }
};

export const timeDiff = (inputDate: string) => {
  const date = moment.utc(inputDate);
  const now = moment();
  const diff = moment.duration(now.diff(date));

  if (diff.asMinutes() < 1) return `방금 전`;
  if (diff.asMinutes() < 60) return `${Math.floor(diff.asMinutes())}분 전`;
  if (diff.asHours() < 24) return `${Math.floor(diff.asHours())}시간 전`;
  return '';
};

export const sortByPersonaName = (personaList: RoomMember[]) => {
  const pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크
  const pattern_eng = /[a-zA-Z]/; // 문자
  const pattern_num = /[0-9]/; // 숫자
  const pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자

  const korArr = personaList.filter((elem: RoomMember) =>
    pattern_kor.test(elem?.personaNick[0]),
  );

  const engArr = personaList.filter((elem: RoomMember) =>
    pattern_eng.test(elem?.personaNick[0]),
  );

  const numArr = personaList.filter((elem: RoomMember) =>
    pattern_num.test(elem?.personaNick[0]),
  );

  const spcArr = personaList.filter((elem: RoomMember) =>
    pattern_spc.test(elem?.personaNick[0]),
  );

  const result = [
    ...korArr.sort((a: RoomMember, b: RoomMember) =>
      a?.personaNick.localeCompare(b?.personaNick),
    ),
    ...engArr.sort((a: RoomMember, b: RoomMember) =>
      a?.personaNick.localeCompare(b?.personaNick),
    ),
    ...numArr.sort((a: RoomMember, b: RoomMember) =>
      a?.personaNick.localeCompare(b?.personaNick),
    ),
    ...spcArr.sort((a: RoomMember, b: RoomMember) =>
      a?.personaNick.localeCompare(b?.personaNick),
    ),
  ];
  return result;
};

export const getAuthority = (
  content: MessageModel | NoticeModel | VoteMD.VoteModel | null | LinkModel,
  currentRoom: RoomModel,
  user: PersonaModel | undefined,
) => {
  const isMine = content?.personaId === (user?.id as number);
  const isMyRoom = currentRoom.typeId === 1;
  const isRoomLeader = !!currentRoom.memberMapByRoleTypeName
    .get('방장')
    ?.find((roomMember) => roomMember.personaId === (user?.id as number));
  const isAdmin = user?.isAdmin;

  return {
    isMine,
    isMyRoom,
    isRoomLeader,
    isAdmin,
  };
};

/**
 * 투표/공지 등에서 사용자의 현재 권한과 config에서 정의된 기능별 권한 설정에 따라 기능(삭제, 수정 등)의 갸능 여부 boolean을 반환하는 함수
 * @param {string} targetAction 가능 여부를 판별하고자 하는 기능
 * @param {Object} configuredAuthority 사업건별 config에서 정의한 기능별 권한 설정
 * @param {Object} authority getAuthority를 사용해 판별된 현재 사용자의 권한
 * @returns {boolean} 기능 수행 가능 여부
 */
export const activateActions = (
  targetAction: 'delete' | 'edit',
  configuredAuthority: { RoomLeader: boolean; Admin: boolean },
  authority: T.Authority,
) => {
  if (targetAction === 'delete') {
    if (authority.isMine) {
      return authority.isMine;
    } else if (configuredAuthority.Admin && authority.isAdmin) {
      return authority.isAdmin;
    } else if (configuredAuthority.RoomLeader && authority.isRoomLeader) {
      return authority.isRoomLeader;
    } else {
      return false;
    }
  }
  if (targetAction === 'edit') {
    if (authority.isMine) {
      return authority.isMine;
    } else if (configuredAuthority.Admin && authority.isAdmin) {
      return authority.isAdmin;
    } else if (configuredAuthority.RoomLeader && authority.isRoomLeader) {
      return authority.isRoomLeader;
    } else {
      return false;
    }
  }
  return false;
};

/**
 * 문자열의 마지막 한글 종성 유무에 따라 다른 조사를 사용하기 위해 boolean을 반환하는 함수
 * @param {string} targetString 종성 유무를 판별해야하는 문자열
 * @returns {boolean} 종성의 유무
 */

export const hasLastLetter = (targetString: string) => {
  const lastKorean = targetString.match(
    /[ㄱ-힣](?![\u1161-\u11A7\u11A8-\u11FF\u3131-\u314E\u314F-\u3163])/g,
  );
  if (lastKorean) {
    const lastCharCode = lastKorean[lastKorean.length - 1].charCodeAt(0);
    return (lastCharCode - 0xac00) % 28 !== 0;
  }
  return false;
};

export const getFileName = (msgBody: MsgBody | undefined) => {
  if (msgBody?.files?.length) {
    if (msgBody.files[0].name)
      try {
        return decodeURIComponent(msgBody.files[0].name);
      } catch {
        return msgBody.files[0].name;
      }
  }
  return '';
};

export const getFileExtension = (msgBody: MsgBody | undefined) => {
  if (msgBody?.files?.length) {
    if (msgBody.files[0].extension) return msgBody.files[0].extension;
  }
  return 'ext';
};

export const isBot = (personaId: number) => {
  return (personaId & 255) === personaId && personaId !== 0;
};

export const isFulfilled = <T>(
  val: PromiseSettledResult<T>,
): val is PromiseFulfilledResult<T> => {
  return val.status === 'fulfilled';
};

export const isEmptyObj = (obj: any): boolean => {
  if (obj.constructor === Object && Object.keys(obj).length === 0) {
    return true;
  }
  return false;
};

/**
 * 현재 룸에 대해 어떤 제약이 걸려있는지 확인하는 함수
 * isDisabled 제약이 걸린 모든 경우
 * isRestricted 채팅 제한된 유저
 * @param currentPersona
 * @param currentRoom
 * @returns {Object}
 */
export const getRoomRestraints = (
  currentPersona: PersonaModel,
  currentRoom: RoomModel,
) => {
  const isRestricted =
    currentPersona?.restriction &&
    (currentPersona?.restriction?.restrictedType & 4) > 0;
  const { isBotRoom } = getRoomType(currentRoom);
  return { isDisabled: isRestricted || isBotRoom, isRestricted };
};
