import i18nJS from 'i18n-js';
import { findBestAvailableLanguage } from 'react-native-localize';
import ar from '../translations/ar.json';
import bn from '../translations/bn.json';
import de from '../translations/de.json';
import en from '../translations/en.json';
import fa from '../translations/fa.json';
import fr from '../translations/fr.json';
import gu from '../translations/gu.json';
import hi from '../translations/hi.json';
import it from '../translations/it.json';
import ja from '../translations/ja.json';
import ko from '../translations/ko.json';
import mr from '../translations/mr.json';
import pa from '../translations/pa.json';
import pl from '../translations/pl.json';
import pt from '../translations/pt.json';
import ru from '../translations/ru.json';
import ta from '../translations/ta.json';
import te from '../translations/te.json';
import tr from '../translations/tr.json';
import ur from '../translations/ur.json';
import vi from '../translations/vi.json';
import zh from '../translations/zh.json';

const fallback = { languageTag: 'en', isRTL: false };
const { languageTag } = findBestAvailableLanguage(['en', 'ar', 'bn', 'de', 'fa', 'fr', 'gu', 'hi', 'it', 'ja', 'ko', 'mr', 'pa', 'pl', 'pt', 'ru', 'ta', 'te', 'tr', 'ur', 'vi', 'zh']) || fallback;

i18nJS.locale = languageTag;
i18nJS.fallbacks = true;
i18nJS.translations = { ar, bn, de, en, fa, fr, gu, hi, it, ja, ko, mr, pa, pl, pt, ru, ta, te, tr, ur, vi, zh };

export const i18n = i18nJS;
