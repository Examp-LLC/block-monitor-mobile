import { isIOS } from '../utils/platform';

export interface Fonts {
  roboto: string;
  robotoBold: string;
}

const iOSFonts: Fonts = {
  roboto: 'Roboto',
  robotoBold: 'Roboto Black'
}; 

const androidFonts: Fonts = {
  roboto: 'Roboto',
  robotoBold: 'RobotoBlack'
};

export const fonts: Fonts = isIOS ? iOSFonts : androidFonts;
