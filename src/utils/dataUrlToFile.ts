export const dataUrlToFile = (dataUrl: string, mime_type: string) => {
  const byteString = atob(dataUrl);

  const arrayBuffer = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    arrayBuffer[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: mime_type });
  const extension = mime_type.split('/')?.[1];

  const date = new Date();

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hour = String(date.getHours());
  const minute = String(date.getMinutes());
  const second = String(date.getSeconds());

  const dateValue = year + month + day;
  const timeValue = hour + minute + second;
  const randomNumber = String(Math.floor(Math.random() * 100) + 1);

  return new File(
    [blob],
    `${dateValue}_${timeValue}_${randomNumber}.${extension}`,
    {
      type: mime_type,
    },
  );
};
