/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const { promisify } = require('util');
const execAsync = promisify(exec);

const WebSocket = require('ws');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const SOCKET_URL = 'wss://ekr-biz-dev.tmax-superapp.com';
const GET_APP_SERVICE_NAME = 'wapl-appstore-biz-dev/service.store.getApp';
const UPLOAD_FILE_SERVICE_NAME = 'wapl-appstore-biz-dev/UploadObjectService';
const UPDATE_APP_SERVICE_NAME = 'wapl-appstore-biz-dev/service.app.UpdateApp';

let APP_NAME;
let APP_ID;
let DEVICE_TYPE;
let PERSONA_ID;

let BUILD_COMMAND;
let ZIP_COMMAND;

let TITLE_TEXT;
let TITLE_COLOR;
let LOADING_COLOR;
let SUCCESS_COLOR;
let ERROR_COLOR;

// 공통
PERSONA_ID = 3073;
ZIP_COMMAND = 'cd build && zip -r build.zip *';
LOADING_COLOR = '\x1b[97m%s\x1b[0m';
ERROR_COLOR = '\x1b[91m%s\x1b[0m';

// 업무톡
if (process.argv[2] === 'work') {
  APP_NAME = '업무톡';
  APP_ID = 1;
  BUILD_COMMAND = 'yarn build:ekr';
  TITLE_COLOR = '\x1b[44m%s\x1b[0m';
  SUCCESS_COLOR = '\x1b[94m%s\x1b[0m';
}
// 개인톡
else if (process.argv[2] === 'private') {
  APP_NAME = '개인톡';
  APP_ID = 7;
  BUILD_COMMAND = 'yarn build:ekr_private';
  TITLE_COLOR = '\x1b[42m%s\x1b[0m';
  SUCCESS_COLOR = '\x1b[92m%s\x1b[0m';
}

// 데스크탑
if (process.argv[3] === 'desktop') {
  DEVICE_TYPE = 1;
  TITLE_TEXT = ` [한국농어촌공사 Dev] ${APP_NAME} 앱 업데이트 v0.0.3 - 데스크탑 `;
}
// 모바일
else if (process.argv[3] === 'mobile') {
  DEVICE_TYPE = 2;
  TITLE_TEXT = ` [한국농어촌공사 Dev] ${APP_NAME} 앱 업데이트 v0.0.3 - 모바일 `;
}

const ws = new WebSocket(SOCKET_URL);

const getApp = async () => {
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
    appId: APP_ID,
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

        resolve({ major: versions[0], minor: versions[1], patch: versions[2] });
      } catch (error) {
        readline.moveCursor(process.stdout, 0, -1);
        readline.clearLine(process.stdout, 0);
        console.log(ERROR_COLOR, '[3/3] 앱 정보 확인 실패');
        console.error(error);
        process.exit();
      }
    };

    ws.onerror = (error) => {
      readline.moveCursor(process.stdout, 0, -1);
      readline.clearLine(process.stdout, 0);
      console.log(ERROR_COLOR, '[3/3] 앱 정보 확인 실패');
      console.error(error);
      process.exit();
    };
  });
};

const uploadFile = async () => {
  try {
    const filePath = './build/build.zip';
    const fileBuffer = await fs.readFile(filePath);
    fileName = path.basename(filePath);

    arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength,
    );
  } catch (error) {
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearLine(process.stdout, 0);
    console.log(ERROR_COLOR, '[3/4] 파일 없음');
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
    targetServiceName: UPLOAD_FILE_SERVICE_NAME,
    'Authorization key': 'asdfjlasdlkjfhasdlkf',
  });

  const requestBody = JSON.stringify({
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

  console.log(LOADING_COLOR, '[3/4] 파일 업로드 중...');

  return new Promise((resolve) => {
    ws.onmessage = (event) => {
      const uint8View = new Uint8Array(event.data);
      const result = uint8View.slice(64);
      const body = String.fromCharCode.apply(null, result);

      try {
        const sessionId = body
          .split('{')[3]
          .match(/"sessionId":"([0-9a-fA-F-]+)"/)[1];

        readline.moveCursor(process.stdout, 0, -1);
        readline.clearLine(process.stdout, 0);
        console.log(SUCCESS_COLOR, '[3/4] 파일 업로드 성공');

        resolve({ sessionId });
      } catch (error) {
        readline.moveCursor(process.stdout, 0, -1);
        readline.clearLine(process.stdout, 0);
        console.log(ERROR_COLOR, '[3/4] 파일 업로드 실패');
        console.error(error);
        process.exit();
      }
    };

    ws.onerror = (error) => {
      readline.moveCursor(process.stdout, 0, -1);
      readline.clearLine(process.stdout, 0);
      console.log(ERROR_COLOR, '[3/4] 파일 업로드 실패');
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
  sessionId,
}) => {
  let arrayBuffer;

  const fixedHeader = new ArrayBuffer(64);
  const dataview = new DataView(fixedHeader);
  const headerBytes = new Uint8Array(fixedHeader);

  headerBytes[0] = 43;
  headerBytes[1] = 236;
  headerBytes[3] = 1;
  headerBytes[5] = 113;
  headerBytes[19] = 1;

  const requestHeader = JSON.stringify({
    targetServiceName: UPDATE_APP_SERVICE_NAME,
    'Authorization key': 'asdfjlasdlkjfhasdlkf',
  });

  const versionString = `v${Number(version.major)}.${Number(version.minor)}.${
    Number(version.patch) + 1
  }`;

  const requestBody = JSON.stringify({
    appId: appId,
    personaId: personaId,
    version: versionString,
    deviceTypes: [deviceType],
    uploadType: 'update',
    fileName: 'build.zip',
    sessionId: sessionId,
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

  console.log(LOADING_COLOR, '[4/4] 앱 업데이트 중...');
  console.log(requestBody);

  ws.onmessage = function (event) {
    const uint8View = new Uint8Array(event.data);
    const result = uint8View.slice(64);
    const response = String.fromCharCode.apply(null, result);

    readline.moveCursor(process.stdout, 0, -2);
    readline.clearLine(process.stdout, 0);

    if (response.includes('success')) {
      console.log(SUCCESS_COLOR, '[4/4] 앱 업데이트 성공');
      console.log(response);
      console.log(SUCCESS_COLOR, `[DEPLOYED] ${versionString}`);
    } else if (response.includes('ERROR')) {
      console.log(ERROR_COLOR, '[4/4] 앱 업데이트 실패');
      console.log(response);
    }

    process.exit();
  };
};

const executeCommand = async ({ command, onLoading, onSuccess, onError }) => {
  try {
    console.log(LOADING_COLOR, onLoading);
    let { stdout } = await execAsync(command);

    if (stdout) {
      readline.moveCursor(process.stdout, 0, -1);
      readline.clearLine(process.stdout, 0);
      console.log(SUCCESS_COLOR, onSuccess);
    }
  } catch (error) {
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearLine(process.stdout, 0);
    console.log(ERROR_COLOR, onError);
    console.error(error);
    process.exit();
  }
};

ws.onopen = async () => {
  try {
    console.clear();
    console.log(TITLE_COLOR, TITLE_TEXT);

    await executeCommand({
      command: BUILD_COMMAND,
      onLoading: '[1/4] 프로젝트 빌드 중...',
      onSuccess: '[1/4] 프로젝트 빌드 성공',
      onError: '[1/4] 프로젝트 빌드 실패',
    });

    await executeCommand({
      command: ZIP_COMMAND,
      onLoading: '[2/4] 파일 압축 중...',
      onSuccess: '[2/4] 파일 압축 성공',
      onError: '[2/4] 파일 압축 실패',
    });

    const { major, minor, patch } = await getApp();

    const { sessionId } = await uploadFile();

    await updateApp({
      appId: APP_ID,
      personaId: PERSONA_ID,
      deviceType: DEVICE_TYPE,
      version: {
        major,
        minor,
        patch,
      },
      sessionId: sessionId,
    });
  } catch (error) {}
};

ws.onerror = (error) => {
  throw error;
};
