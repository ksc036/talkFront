const NOTICE_STATE = 'noticeState';

/**
 * key roomId에 대한 value 값이 true면 접힌 것.
 * object에 없는 roomId는 default 접히지 않은 것.
 * {
 *     roomId1: true,
 *     roomId2: true,
 *     roomId3: true,
 * }
 */

export const getNoticePreseneceState = (roomId: number): boolean => {
  const localNoticeState = localStorage.getItem(NOTICE_STATE);
  const noticeState = localNoticeState ? JSON.parse(localNoticeState) : {};
  const ret = noticeState[roomId];
  return ret ? true : false;
};

export const toggleNoticePreseneceState = (roomId: number, value: boolean) => {
  const localNoticeState = localStorage.getItem(NOTICE_STATE);
  const noticeState = localNoticeState ? JSON.parse(localNoticeState) : {};
  if (value) {
    noticeState[roomId] = value;
  } else {
    delete noticeState[roomId];
  }
  localStorage.setItem(NOTICE_STATE, JSON.stringify(noticeState));
};
