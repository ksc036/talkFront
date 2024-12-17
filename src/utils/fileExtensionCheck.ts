const isSupportedFile = (extension: string) => {
  const supportedExtensions: string[] = [
    // 이미지
    'png',
    'apng',
    'bmp',
    'gif',
    'jpg',
    'jpeg',
    'jfif',
    'rle',
    'die',
    'raw',
    'webp',

    // 미디어
    //// 미리보기 가능
    'mp4',
    'ogv',
    'webm',
    //// 미리보기 불가
    'mkv',
    'avi',
    'mpg',
    'flv',
    'wmv',
    'asf',
    'asx',
    'ogm',
    '3gp',
    'mov',
    'dat',
    'rm',
    'mpe',
    'mpeg',

    // 음성
    'mp3',
    'wav',
    'ogg',
    'flac',
    'wma',
    'aac',

    // 문서
    //// 프레젠테이션
    'ppt',
    'tpt',
    'pptx',
    //// 워드/한글
    'doc',
    'toc',
    'docx',
    'hwp',
    'hwpx',
    'rtf',
    //// 엑셀
    'xls',
    'tls',
    'csv',
    'xlsx',
    //// 텍스트
    'txt',
    //// PDF
    'pdf',

    // 압축파일
    'zip',
    'tar',
    'rar',
    'tgz',
    'war',
    'alz',
    'ace',
    'arc',
    'arj',
    'b64',
    'bh',
    'bhx',
    'bin',
    'bz2',
    'cab',
    'ear',
    'enc',
    'gz',
    'ha',
    'hqx',
    'ice',
    'img',
    'jar',
    'lha',
    'lzh',
    'mim',
    'pak',
    'uue',
    'xxe',
    'zoo',
  ];

  return supportedExtensions.includes(extension);
};

const isUnsupportedFile = (extension: string) => {
  const unsupportedExtensions: string[] = [
    // 실행 가능한 파일들은 업로드 불가능
    'bat',
    'cmd',
    'com',
    'cpl',
    'exe',
    'js',
    'scr',
    'vds',
    'wsf',
    'jse',
    'adp',
    'chm',
    'hta',
    'jse',
    'lnk',
    'mde',
    'msc',
    'msi',
    'msp',
    'mst',
    'pif',
    'sct',
    'shb',
    'vb',
    'vbe',
    'wsc',
    'wsh',
    'ade',
    'jar',
    'bas',
    'cer',
    'crt',
    'der',
    'gadget',
    'hlp',
    'lnf',
    'mad',
    'maf',
    'mag',
    'mam',
    'maq',
    'mar',
    'mas',
    'mat',
    'mau',
    'mav',
    'maw',
    'mda',
    'mdb',
    'mdt',
    'mdw',
    'mdz',
    'reg',
    'scf',
    'shs',
    'ps1',
    'ps1xml',
    'ps2',
    'ps2xml',
    'psc1',
    'psc2',
    'url',
    'grp',
    'xbap',
    'ocx',
    'nsh',
    'sys',
    'vxd',
    'jnlp',
  ];

  return unsupportedExtensions.includes(extension);
};

export { isSupportedFile, isUnsupportedFile };
