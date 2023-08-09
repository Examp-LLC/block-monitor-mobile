import AsyncStorage from "@react-native-community/async-storage";
import { AsyncStorageKeys } from "../../enums";
import { i18n } from "../../i18n";
import { load } from "../../utils/storage";

export async function getCurrentLanguage(): Promise<string> {
  return await load(AsyncStorageKeys.currentLanguage) || i18n.currentLocale();
}
