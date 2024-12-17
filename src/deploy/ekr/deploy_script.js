/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs').promises;
const path = require('path');

const WebSocket = require('ws');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const SOCKET_URL = 'wss://ekr-biz-dev.tmax-superapp.com';
const GET_APP_SERVICE_NAME = 'wapl-appstore-biz-dev/service.store.getApp';
const UPLOAD_SERVICE_NAME = 'wapl-appstore-biz-dev/UploadObjectService';

// 농어촌 개인톡 7
// 농어촌 업무톡 1
const WORK_APP_ID = 1;
const PRIVATE_APP_ID = 7;
const PERSONA_ID = 3073;
const DEVICE_TYPE = 1;

const TITLE_TEXT = ' [한국농어촌공사 Dev] 톡 앱 업데이트';
const TITLE_COLOR = '\x1b[44m%s\x1b[0m';
const LOADING_COLOR = '\x1b[97m%s\x1b[0m';
const SUCCESS_COLOR = '\x1b[94m%s\x1b[0m';
const ERROR_COLOR = '\x1b[91m%s\x1b[0m';

const ZIP_FILE_NAME_PRIVATE = process.env.ZIP_FILE_NAME_PRIVATE;
const ZIP_FILE_NAME_WORK = process.env.ZIP_FILE_NAME_WORK;

const ws = new WebSocket(SOCKET_URL);

const getApp = async ({ appId }) => {
  const fixedHeader = new ArrayBuffer(64);
  const dataview = new DataView(fixedHeader);
  const headerBytes = new Uint8Array(fixedHeader);

  headerBytes[0] = 43;
  headerBytes[1] = 236;
  headerBytes[3] = 1;
  headerBytes[5] = 113;
  headerBytes[19] = 1;

  const varHeader = JSON.stringify({
    targetServiceName: GET_APP_SERVICE_NAME,
  });

  const varBody = JSON.stringify({
    appId: appId,
    deviceType: DEVICE_TYPE,
  });

  const encodedHeader = new TextEncoder().encode(varHeader);
  const encodedBody = new TextEncoder().encode(varBody);

  dataview.setInt32(24, encodedHeader.byteLength);
  dataview.setInt32(28, encodedBody.byteLength);
  dataview.setInt32(32, 0);

  const message = new ArrayBuffer(
    fixedHeader.byteLength + encodedHeader.byteLength + encodedBody.byteLength,
  );

  const messageBytes = new Uint8Array(message);
  messageBytes.set(headerBytes, 0);
  messageBytes.set(encodedHeader, headerBytes.byteLength);
  messageBytes.set(
    encodedBody,
    headerBytes.byteLength + encodedHeader.byteLength,
  );

  ws.binaryType = 'arraybuffer';

  ws.send(messageBytes);

  return new Promise((resolve) => {
    ws.onmessage = (event) => {
      const uint8View = new Uint8Array(event.data);
      const result = uint8View.slice(64);
      const body = String.fromCharCode.apply(null, result);

      try {
        const versions = body
          .match(/"resource":"([^"]+)"/)[1]
          .split('/')[2]
          .replace('v', '')
          .split('.');
        console.log(
          LOADING_COLOR,
          'Prev version for appId',
          appId,
          ': ',
          versions,
        );
        resolve({ major: versions[0], minor: versions[1], patch: versions[2] });
      } catch (error) {
        console.log(
          '\x1b[91m%s\x1b[0m',
          'Error: 앱 정보 확인 실패 for appId: ',
          appId,
        );
        console.error(error);
        process.exit();
      }
    };

    ws.onerror = (error) => {
      console.log(
        '\x1b[91m%s\x1b[0m',
        'Error: 앱 정보 확인 실패 for appId: ',
        appId,
      );
      console.error(error);
      process.exit();
    };
  });
};

const updateApp = async ({
  appId,
  personaId,
  deviceType,
  version,
  filePath,
}) => {
  let arrayBuffer;
  let fileName;

  if (!version.major || !version.minor || !version.patch) {
    console.log(
      '\x1b[91m%s\x1b[0m',
      'Error: 버전 undefined appId: ',
      appId,
      'version: ',
      version,
    );
  }

  try {
    const fileBuffer = await fs.readFile(filePath);
    fileName = path.basename(filePath);

    arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength,
    );
  } catch (error) {
    console.log('\x1b[91m%s\x1b[0m', 'Error: 파일 없음 for appId: ', appId);
    console.error(error);
    process.exit();
  }

  const fixedHeader = new ArrayBuffer(64);
  const dataview = new DataView(fixedHeader);
  const headerBytes = new Uint8Array(fixedHeader);

  headerBytes[0] = 43;
  headerBytes[1] = 236;
  headerBytes[3] = 1;
  headerBytes[5] = 113;
  headerBytes[19] = 1;

  const requestHeader = JSON.stringify({
    targetServiceName: UPLOAD_SERVICE_NAME,
    'Authorization key': 'asdfjlasdlkjfhasdlkf',
  });

  const newVersion = `v${Number(version.major)}.${Number(version.minor)}.${
    Number(version.patch) + 1
  }`;

  const requestBody = JSON.stringify({
    appId: appId,
    personaId: personaId,
    version: newVersion,
    deviceTypes: [deviceType],
    uploadType: 'update',
    name: fileName,
  });

  const encodedHeader = new TextEncoder().encode(requestHeader);
  const encodedBody = new TextEncoder().encode(requestBody);
  const byteArray = new Uint8Array(arrayBuffer);

  dataview.setInt32(24, encodedHeader.byteLength);
  dataview.setInt32(28, encodedBody.byteLength);
  dataview.setInt32(32, byteArray.byteLength);

  const message = new ArrayBuffer(
    fixedHeader.byteLength +
      encodedHeader.byteLength +
      encodedBody.byteLength +
      byteArray.byteLength,
  );

  const messageBytes = new Uint8Array(message);
  messageBytes.set(headerBytes, 0);
  messageBytes.set(encodedHeader, headerBytes.byteLength);
  messageBytes.set(
    encodedBody,
    headerBytes.byteLength + encodedHeader.byteLength,
  );
  messageBytes.set(
    byteArray,
    headerBytes.byteLength + encodedHeader.byteLength + encodedBody.byteLength,
  );

  ws.binaryType = 'arraybuffer';

  ws.send(messageBytes);

  console.log(
    LOADING_COLOR,
    'INFO: 앱 업데이트 중... for appId: ',
    appId,
    'version: ',
    version,
  );
  console.log(requestBody);

  ws.onmessage = function (event) {
    const uint8View = new Uint8Array(event.data);
    const result = uint8View.slice(64);
    const response = String.fromCharCode.apply(null, result);

    if (response.includes('success')) {
      console.log(
        SUCCESS_COLOR,
        'SUCCESS: 앱 업데이트 성공 for appId: ',
        appId,
        'version: ',
        version,
      );
    } else if (response.includes('ERROR')) {
      console.log(
        ERROR_COLOR,
        'ERROR: 앱 업데이트 실패 for appId: ',
        appId,
        'version: ',
        version,
      );
    }
    console.log(response);

    process.exit();
  };
};

ws.onopen = async () => {
  try {
    console.log(TITLE_COLOR, TITLE_TEXT);

    const filePath_private = `${ZIP_FILE_NAME_PRIVATE}.zip`;
    const filePath_work = `${ZIP_FILE_NAME_WORK}.zip`;

    const privateVersion = await getApp({ appId: PRIVATE_APP_ID });
    await updateApp({
      appId: PRIVATE_APP_ID,
      personaId: PERSONA_ID,
      deviceType: DEVICE_TYPE,
      version: privateVersion,
      filePath: filePath_private,
    });

    const workVersion = await getApp({ appId: WORK_APP_ID });
    await updateApp({
      appId: WORK_APP_ID,
      personaId: PERSONA_ID,
      deviceType: DEVICE_TYPE,
      version: workVersion,
      filePath: filePath_work,
    });
  } catch (error) {}
};

ws.onerror = (error) => {
  throw error;
};
