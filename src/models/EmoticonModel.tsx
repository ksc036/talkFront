import { EmoticonType } from '@/@types/emoticon';
import { dataURItoUrl } from '@/utils/url';

import type { Base64, EmoticonKey, i18nKey } from '@/@types/common';
import type { EmoticonTab, EmoticonData } from '@/@types/emoticon';

export class EmoticonModel {
  tooltip: i18nKey;
  type: EmoticonType;
  tab: EmoticonTab;
  emoticonMap: Map<EmoticonKey | string, EmoticonData>;
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
  /**
   * @param {String} tooltipI18n 이모티콘탭 툴팁 i18n 키
   * @param {EmoticonType} type 이모티콘 타입
   * @param {Tab} tab  이모티콘탭 아이콘
   * @param {Map} emoticonMap 이모티콘 개인화를 위한 파라미터 (당장 사용하지 않음)
   */
  static globalEmoticonMap = new Map<EmoticonKey | string, EmoticonData>();

  constructor(
    tooltip = '',
    type: EmoticonType = EmoticonType.LEGACY,
    tab: EmoticonTab = { normal: '', active: '' },
    // emoticonMap = new Map(),
    inactiveIcon: JSX.Element = <></>,
    activeIcon: JSX.Element = <></>,
  ) {
    this.tooltip = tooltip;
    this.type = type;
    this.tab = Object.freeze({
      normal: dataURItoUrl(tab.normal),
      active: dataURItoUrl(tab.active),
    });
    this.emoticonMap = new Map();
    this.inactiveIcon = inactiveIcon;
    this.activeIcon = activeIcon;
  }

  /**
   * @param {String} key
   * @param {(String | Base64)} imageURI
   * @param {(String | Base64)} thumbnaileURI
   */
  insertEmoticon(
    key: EmoticonKey,
    imageURI: Base64,
    thumbnaileURI: Base64,
  ): void {
    const image = dataURItoUrl(imageURI);
    const thumbnail = thumbnaileURI ? dataURItoUrl(thumbnaileURI) : image;
    const emoticon = Object.freeze({
      key,
      type: this.type,
      image,
      thumbnail,
    });

    this.emoticonMap.set(key, emoticon);
    EmoticonModel.globalEmoticonMap.set(key, emoticon);
  }

  /**
   * @param {Map} emoticonMap 이모티콘맵
   * @param {boolean} forward 인자로 넘긴 맵을 앞으로 머지할지 뒤로 머지할지 결정
   */
  merge(
    emoticonMap = new Map<EmoticonKey, EmoticonData>(),
    forward = false,
  ): void {
    let arr = [];
    if (forward) {
      arr = Array.from(emoticonMap).concat(Array.from(this.emoticonMap));
    } else {
      arr = Array.from(this.emoticonMap).concat(Array.from(emoticonMap));
    }
    this.emoticonMap = new Map(arr);
  }

  get emoticons(): EmoticonData[] {
    const rtn: EmoticonData[] = [];
    // NOTE: IE11 values 미지원
    this.emoticonMap.forEach((value) => rtn.push(value));

    return rtn;
  }

  static DEFAULT_EMOTICON_KEY = 'slightly smiling face';

  static getEmoticon = (unknownKey: string, strict = false) => {
    const { globalEmoticonMap: map, DEFAULT_EMOTICON_KEY: DEFAULT_KEY } =
      EmoticonModel;

    const [, key] = /^[:](.*?)[:]$/gm.exec(unknownKey) ?? [null, unknownKey];

    return strict ? map.get(key) : map.get(key) ?? map.get(DEFAULT_KEY);
  };
}

/**
 * @typedef Tab
 * @type {object}
 * @property {string} normal 탭 아이콘
 * @property {string} active 마우스 오버할 때, 탭 아이콘
 *
 * @typedef Base64
 * @type {string}
 * @example data:image/gif;base64,R0lGOD...
 *
 * @typedef {import("@/interfaces/emoticon").EmoticonType} EmoticonType
 */
