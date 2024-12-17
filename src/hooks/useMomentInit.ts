import { useEffect } from 'react';

import moment from 'moment';
import momentTZ from 'moment-timezone';

import 'moment/locale/ko';
import 'moment/locale/en-gb';

export const useMomentInit = (): void => {
  useEffect(() => {
    const onLanguageChanged = (language: string) => {
      moment.locale(language);
      momentTZ.locale(language);
    };

    onLanguageChanged('ko');
    // onLanguageChanged(i18n.language);
    // i18n.on('languageChanged', onLanguageChanged);

    // return () => i18n.off('languageChanged', onLanguageChanged);
  }, []);
};
