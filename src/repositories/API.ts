import axios from 'axios';

const isStag = () => {
  if (process.env.REACT_APP_PLATFORM === 'superapp') {
    return (
      window.location.hostname === 'sag-gaia-prod-wapl.tmax-superapp.com' ||
      process.env.REACT_APP_ROLLUP === 'true'
    );
  } else if (process.env.REACT_APP_PLATFORM === 'foodist') {
    return (
      window.location.hostname === 'foodist-shell.catchbird.net' ||
      window.location.hostname === 'foodist-mobile-shell.catchbird.net' ||
      process.env.REACT_APP_ROLLUP === 'true'
    );
  } else if (process.env.REACT_APP_PLATFORM === 'sen') {
    return (
      window.location.hostname === 'seoul-edu-shell.catchbird.net' ||
      window.location.hostname === 'seoul-edu-mobile-shell.catchbird.net' ||
      process.env.REACT_APP_ROLLUP === 'true'
    );
  }
};

// core에서 주입해 주는 변수 사용 가능한지 알아보기.
export const commonUrlPath = () => {
  return `${
    window.env?.COMMON_API_URL ??
    (isStag()
      ? `https://foodist-common.catchbird.net`
      : `https://foodist-common.teespace.net`)
  }/apis/v1`;
};

export const urlPath = () => {
  return `${
    window.env?.TALK_API_URL ??
    (isStag()
      ? 'https://foodist-talk.catchbird.net'
      : `https://foodist-talk.teespace.net`)
  }/talk-api/v1`;
};

export const docsUrlPath = () => {
  return (
    window.env?.OFFICE_API_URL ??
    'https://seoul-edu-office-api.catchbird.net/superoffice'
  );
};

export const docsEventUrlPath = () => {
  return `${
    window.env?.OFFICE_EVENT_URL ?? 'https://seoul-edu-cms.catchbird.net'
  }/apis/v1`;
};

/**
 * @param {string} prefix 서비스 대분류 (e.g. message, vote, notice, reaction, crawling 중 택일)
 * @param {string} suffix 서비스 소분류 (e.g. GetMessages, CreateMessage, DeleteMessage 등...)
 * @param {string} variableServiceName 전체 targetServiceName을 새로 지정하고 싶은 경우 사용 (variableServiceName으로 인자를 전달하는 경우 prefix와 suffix는 무시됨)
 * @returns {string}
 */
export const servicePath = (
  prefix:
    | 'message'
    | 'vote'
    | 'notice'
    | 'reaction'
    | 'reservation'
    | 'link'
    | 'crawling'
    | 'session',
  suffix: string,
  variableServiceName?: string,
) => {
  const TALK_POOL_ID =
    window.env?.TALK_POOL_ID ??
    (isStag()
      ? process.env.REACT_APP_TALK_POOL_ID?.replace('-dev', '')
      : process.env.REACT_APP_TALK_POOL_ID);

  const defaultServiceName = `${TALK_POOL_ID}/ai.wapl.tmax.talk.service.${prefix}.${suffix}`;
  return variableServiceName ?? defaultServiceName;
};

export const roomServicePath = (
  prefix: 'room',
  suffix: string,
  variableServiceName?: string,
) => {
  const COMMON_POOL_ID =
    window.env?.COMMON_POOL_ID ??
    (isStag()
      ? process.env.REACT_APP_COMMON_POOL_ID?.replace('-dev', '')
      : process.env.REACT_APP_COMMON_POOL_ID);

  const defaultServiceName = `${COMMON_POOL_ID}/ai.wapl.commonapi.${prefix}.service.${suffix}`;
  return variableServiceName ?? defaultServiceName;
};

const OfficeAPI = axios.create();

export { OfficeAPI };
