// import { ItemInfo } from '@/@types';
import { Icon } from '@wapl/ui';

import { ItemInfo } from '@/@types/attach';
import { checkDevice, isMobile } from '@/utils/deviceDetect';

import { ReactComponent as HangulIcon } from '../assets/icons/HangulIcon.svg';
import { ReactComponent as TextIcon } from '../assets/icons/TextIcon.svg';

export const getNativeFileInfo = (file: File) => {
  let extension = '';
  const extensionArr = /(?:\.([^.]+))?$/.exec(file.name);
  if (extensionArr && extensionArr[1]) {
    extension = extensionArr[1].toLowerCase();
  }
  const name = file.name.replace(/\.[^/.]+$/, '');
  const fullName = `${name}.${extension}`;
  // 전송전 중복 파일을 판별하기위한 id. 업로드 후의 진짜 id는 오피스 업로드 api의 response로 오는것
  const id = fullName + file.size;

  return { name, fullName, extension, id };
};

export const getFormattedSize = (size: File['size']) => {
  const prefix = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  let idx = 0;
  while (size >= 1024 && idx < prefix.length - 1) {
    size /= 1024.0;
    idx += 1;
  }

  return `${size ? size.toFixed(1) : size}${idx ? `${prefix[idx]}B` : 'Bytes'}`;
};

export const getObjectUrl = (item: File, type: ItemInfo['type']) => {
  if (type === 'video' || type === 'image') return URL.createObjectURL(item);
  return null;
};

export const getAttachmentItemInfo = (fileExtension: string) => {
  const extension = fileExtension ? fileExtension.toLowerCase() : '';
  const info: ItemInfo = {
    type: 'file',
    icon: <Icon.FileColor />,
    // isPreview: false,
  };
  switch (extension) {
    // 이미지
    // case "tif":
    // case "tiff":
    // case 'svg':
    case 'apng':
    case 'bmp':
    case 'gif':
    case 'jpg':
    case 'jpeg':
    case 'jfif':
    case 'png':
    case 'rle':
    case 'die':
    case 'raw':
    case 'webp':
      info.type = 'image';
      info.icon = <Icon.ImageColor />;
      // info.isPreview = true;
      break;

    // 동영상 html 미지원
    case 'mkv':
    case 'avi':
    case 'mpg':
    case 'flv':
    case 'wmv':
    case 'asf':
    case 'asx':
    case 'ogm':
    case '3gp':
    case 'mov':
    case 'dat':
    case 'rm':
    case 'mpe':
    case 'mpeg':
      info.type = 'video';
      //   info.isPreview = false;
      break;

    // 동영상 html 지원
    case 'mp4':
    case 'ogv':
    case 'webm':
      info.type = 'video';
      info.icon = <Icon.MovieColor width={22} height={22} />;
      //   info.isPreview = true;
      break;

    // 오디오
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
    case 'wma':
    case 'aac':
      info.icon = <Icon.AudioColor />;
      //   info.isPreview = true;
      break;

    case 'ppt':
    case 'tpt': // 투포인트
      info.icon = <Icon.PointColor />;
      //   info.isPreview = false;
      break;
    case 'pptx':
      info.icon = <Icon.PointColor />;
      //   info.isPreview = true;
      break;

    case 'doc':
    case 'toc': // 투워드
      info.icon = <Icon.WordColor />;
      //   info.isPreview = false;
      break;
    case 'docx':
      info.icon = <Icon.WordColor />;
      //   info.isPreview = true;
      break;

    // 오피스 (엑셀)
    case 'xls':
    case 'tls':
    case 'csv':
      info.icon = <Icon.ExcelColor />;
      //   info.isPreview = false;
      break;

    case 'xlsx':
      info.icon = <Icon.ExcelColor />;
      //   info.isPreview = true;
      break;
    // 오피스 (한글)
    // 오피스 (워드)
    case 'hwp':
    case 'hwpx':
      info.icon = <HangulIcon width={22} height={22} />;
      //   info.isPreview = false;
      break;

    // 오피스 (기타)
    case 'txt':
      info.icon = <TextIcon width={22} height={22} />;
      //   info.isPreview = false;
      break;
    case 'pdf':
      info.icon = <Icon.PdfColor />;
      //   info.isPreview = true;
      break;

    // 압축 파일
    case 'zip':
    case 'tar':
    case 'rar':
    case 'tgz':
    case 'war':
    case 'alz':
    case 'ace':
    case 'arc':
    case 'arj':
    case 'b64':
    case 'bh':
    case 'bhx':
    case 'bin':
    case 'bz2':
    case 'cab':
    case 'ear':
    case 'enc':
    case 'gz':
    case 'ha':
    case 'hqx':
    case 'ice':
    case 'img':
    case 'jar':
    case 'lha':
    case 'lzh':
    case 'mim':
    case 'pak':
    case 'uue':
    case 'xxe':
    case 'zoo':
      info.icon = <Icon.ZipColor />;
      //   info.isPreview = false;
      break;

    // exe 파일
    case 'exe':
      info.icon = <Icon.FileColor />;
      //   info.isPreview = false;
      break;

    // 파일
    default:
      // info.type = 'file';
      //   info.isPreview = false;
      break;
  }

  return info;
};

export const getFileLimitSize = ({
  DESKTOP_LIMIT,
  MOBILE_LIMIT,
}: {
  DESKTOP_LIMIT: number;
  MOBILE_LIMIT: number;
}) => {
  const GIGABYTE_BINARY = 1024 ** 2; // 1 MiB = 1024^2 bytes, 윈도우에서 사용
  const GIGABYTE_DECIMAL = 1000 ** 2; // 1 MB = 1000^2 bytes, 맥에서 사용

  const device = checkDevice();
  const isBinarySize = device === 'Android' || device === 'Windows';

  const limit = isMobile() ? MOBILE_LIMIT : DESKTOP_LIMIT;
  const sizeMultiplier = isBinarySize ? GIGABYTE_BINARY : GIGABYTE_DECIMAL;

  return limit * sizeMultiplier;
};

const readFileInChunks = (file: File, chunkSize: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const fileSize = file.size;
    const totalChunks = Math.ceil(fileSize / chunkSize);
    let currentChunk = 0;
    const chunks: ArrayBuffer[] = [];
    const reader = new FileReader();

    const readNextChunk = () => {
      const start = currentChunk * chunkSize;
      const end = Math.min(start + chunkSize, fileSize);
      const blob = file.slice(start, end);
      reader.readAsArrayBuffer(blob);
    };

    reader.onload = (event) => {
      if (event.target?.result) {
        chunks.push(event.target.result as ArrayBuffer);
        currentChunk++;
        if (currentChunk < totalChunks) {
          readNextChunk();
        } else {
          const blob = new Blob(chunks);
          resolve(blob);
        }
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    readNextChunk();
  });
};

// 이미지 썸네일을 생성하는 함수
const generateImageThumbnailFile = (
  blob: Blob,
  maxWidth: number,
  maxHeight: number,
  quality: number,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context is not available'));
      return;
    }

    const tempURL = URL.createObjectURL(blob);
    img.src = tempURL;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], 'thumbnail.jpg', {
              type: 'image/jpeg',
            });
            URL.revokeObjectURL(tempURL);
            resolve(file);
          } else {
            reject(new Error('Canvas is empty'));
          }
        },
        'image/jpeg',
        quality,
      );
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
};

export const generateImageThumbnail = async (item: File) => {
  const imageBlob = await readFileInChunks(item, 80 * 1024 * 1024);
  const thumbnailImageFile = await generateImageThumbnailFile(
    imageBlob,
    200,
    200,
    0.8,
  );
  const thumnailURL = URL.createObjectURL(thumbnailImageFile);
  return { thumbnailImageFile, thumnailURL };
};

const generateVideoThumbnailFile = (blob: Blob): Promise<File> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      reject(new Error('Canvas context is not available'));
      return;
    }

    const tempURL = URL.createObjectURL(blob);

    video.preload = 'metadata';
    video.src = tempURL;
    video.muted = true;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(video.duration / 2, 5);
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((thumbnailBlob) => {
        if (thumbnailBlob) {
          const thumbnail = new File([thumbnailBlob], 'thumbnail.jpg', {
            type: 'image/jpeg',
          });
          URL.revokeObjectURL(tempURL);
          resolve(thumbnail);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg');
    };

    video.onerror = (error) => {
      reject(error);
    };
  });
};

export const generateVideoThumbnail = async (item: File) => {
  const videoBlob = await readFileInChunks(item, 80 * 1024 * 1024);
  const thumbnailVideoFile = await generateVideoThumbnailFile(videoBlob);
  const thumnailURL = URL.createObjectURL(thumbnailVideoFile);
  return { thumbnailVideoFile, thumnailURL };
};
