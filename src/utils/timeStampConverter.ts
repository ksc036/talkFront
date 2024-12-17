import moment from 'moment-timezone';

export const stringToMoment = (str: string): moment.Moment => {
  // 서버 시간대
  const serverTimeRegex = /\[(.*?)\]/;
  const serverTimeZone =
    (str.match(serverTimeRegex)?.[1] as string) ?? 'Asia/Seoul';

  const timeValue = str.split('+')[0];

  return moment(timeValue).tz(serverTimeZone);
};

export const isThisYear = (date: string): boolean => {
  return stringToMoment(date).isSame(moment(), 'year');
};

export const isToday = (date: string): boolean => {
  return stringToMoment(date).isSame(moment(), 'day');
};

export const timeStampFormat = (date: string, timeFormat = 'MM-DD a hh:mm') => {
  return stringToMoment(date).format(timeFormat);
};

export const timeStampFormatForLastMessage = (date: string) => {
  const lastYearFormat = 'YYYY.MM.DD';
  const thisYearFormat = 'MMMM Do';
  const todayFormat = 'a hh:mm';

  if (!isThisYear(date)) return stringToMoment(date).format(lastYearFormat);
  else if (isToday(date)) return stringToMoment(date).format(todayFormat);
  else return stringToMoment(date).format(thisYearFormat);
};

export const formatDate = (source: Date, delimiter = '-') => {
  const year = source.getFullYear();
  const month =
    (source.getMonth() + 1).toString().length === 1
      ? '0' + (source.getMonth() + 1).toString()
      : (source.getMonth() + 1).toString();
  const day =
    (source.getDate() + 1).toString().length === 1
      ? '0' + source.getDate().toString()
      : source.getDate().toString();

  return [year, month, day].join(delimiter);
};

export const timeStampFormatForVoteDeadLine = (
  date: string,
  timeFormat = 'YYYY-MM-DD hh:mm:ss',
) => {
  const parsedTime = stringToMoment(date).format(timeFormat);
  return parsedTime;
};

export const timeStampFormatDuration = (
  startDate: string,
  endDate: string,
  showHourMinute = true,
) => {
  const yearFormatRegex = /^\d{4}-/;

  // 시작 날짜 형식
  let startFormat = yearFormatRegex.test(startDate)
    ? 'YY년 M월 D일'
    : 'M월 D일';

  const start = stringToMoment(startDate);
  const end = stringToMoment(endDate);

  // 종료 날짜 형식
  let endFormat = '';
  if (start.year() !== end.year() && yearFormatRegex.test(endDate)) {
    endFormat += 'YY년 M월 D일';
  } else if (start.month() !== end.month() || start.date() !== end.date()) {
    endFormat += 'M월 D일';
  }

  // 시간과 분을 보여주는 경우
  if (showHourMinute) {
    startFormat += ' HH:mm';
    endFormat += ' HH:mm';
  }

  const formattedStartDate = timeStampFormat(startDate, startFormat);
  const formattedEndDate = timeStampFormat(endDate, endFormat);

  return start.isSame(end)
    ? formattedStartDate
    : `${formattedStartDate} ~ ${formattedEndDate}`;
};
