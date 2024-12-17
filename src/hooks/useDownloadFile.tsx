import { useShell } from '@shell/sdk';

import { useStore } from '@/stores';

import { isMobile } from '../utils/deviceDetect';

interface DownloadFileProps {
  fileBlob: Blob;
  fileName: string;
  fileExtension: string;
  showToast?: boolean;
  toastString?: string;
}

const useDownloadFile = () => {
  const shell = useShell();
  const { uiStore } = useStore();

  const getMobileToastString = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return '이미지가 저장되었습니다.';
      case 'video':
        return '동영상이 저장되었습니다.';
      case 'file':
        return '파일이 저장되었습니다.';
      default:
        return '파일이 저장되었습니다.';
    }
  };

  /**
   * #### 파일 다운로드 시, 사용하는 함수
   * @param {string} fileUrl - (필수) 파일 Blob
   * @param {string} fileName - (필수) 파일 이름
   * @param {boolean} showToast - 토스트 팝업 호출 여부
   * @param {string} toastString - 토스트 팝업에 표시할 내용
   * @returns {void}
   */
  const downloadFile = async ({
    fileBlob,
    fileName,
    fileExtension,
    showToast = true,
    toastString,
  }: DownloadFileProps): Promise<void> => {
    try {
      const fileType = fileBlob?.type?.split('/')?.[0];

      // 모바일 앱 다운로드
      if (isMobile() && (await shell.isSuperOS())) {
        const file = new File([fileBlob], fileName, { type: fileBlob?.type });
        const reader = new FileReader();

        reader.onload = () => {
          const fileBase64Data = reader.result as string;

          shell.mobile.fileSystem.writeFile({
            path: `${fileName}.${fileExtension}`,
            data: fileBase64Data,
            directory: 'DOCUMENTS',
            recursive: true,
          });
        };

        reader.readAsDataURL(file);
      }

      // 데스크탑 브라우저, 모바일 브라우저 다운로드
      else {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(fileBlob);
        downloadLink.download = decodeURIComponent(
          `${fileName}.${fileExtension}`,
        );
        downloadLink.click();
      }

      if (showToast) {
        if (isMobile()) {
          uiStore.openToast(toastString ?? getMobileToastString(fileType));
        } else {
          uiStore.openToast(toastString ?? '파일이 내 PC에 저장되었습니다.');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    downloadFile,
  };
};

export default useDownloadFile;
