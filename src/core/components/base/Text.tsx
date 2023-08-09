import React from 'react';
import { StyleSheet, Text as RNText } from 'react-native';
import { Colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { FontSizes } from '../../theme/sizes';
import { isIOS } from '../../utils/platform';

export enum TextThemes {
  DEFAULT = 'DEFAULT',
  ACCENT = 'ACCENT',
  HEADER = 'HEADER',
  HINT = 'HINT',
  DANGER = 'DANGER'
}

export enum TextAlign {
  AUTO = 'auto',
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
  JUSTIFY = 'justify'
}

export enum TextTransform {
  NONE = 'none',
  UPPERCASE = 'uppercase',
  LOWERCASE = 'lowercase',
  CAPITALIZE = 'capitalize'
}

interface Props {
  children: string | string[] | JSX.Element | JSX.Element[];
  theme?: TextThemes;
  color?: string;
  size?: FontSizes | number;
  disabled?: boolean;
  disabledColor?: Colors | string;
  bold?: boolean;
  thin?: boolean;
  underline?: boolean;
  textAlign?: TextAlign;
  textTransform?: TextTransform;
  textShadow?: boolean;
  selectable?: boolean;
  numberOfLines?: number;
}

const defaultTheme = TextThemes.DEFAULT;
const defaultAlign = TextAlign.LEFT;

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.roboto,
    fontSize: FontSizes.MEDIUM,
    fontWeight: 'normal',
    textAlign: defaultAlign,
    color: Colors.GREY_DARK
  },
  textAccent: {
    color: Colors.BLUE
  },
  textHeader: {
    fontSize: FontSizes.LARGE,
    fontWeight: 'bold'
  },
  textHint: {
    color: Colors.GREY,
    fontSize: FontSizes.SMALL
  },
  textDanger: {
    color: Colors.PINK,
    fontSize: FontSizes.SMALL,
    textAlign: TextAlign.CENTER
  },
  textDisabled: {
    color: Colors.GREY_DARK
  },
  underline: {
    textDecorationStyle: 'solid',
    textDecorationColor: Colors.BLUE,
    textDecorationLine: 'underline',
    textAlignVertical: 'top'
  },
  textShadow: {
    textShadowColor: Colors.GREY_DARK, 
    textShadowOffset: { 
      width: 0.5, 
      height: 0.5 
    }, 
    textShadowRadius: 3
  }
});

// TODO: Create new universal text component according to mockups
export const Text: React.FunctionComponent<Props> = (props) => {
  const { theme = defaultTheme,
    textAlign,
    textTransform,
    textShadow,
    color,
    size,
    disabled,
    disabledColor,
    bold,
    underline,
    thin,
    numberOfLines
  } = props;
  const style: any = [
    styles.text,
    theme === TextThemes.ACCENT && styles.textAccent,
    theme === TextThemes.DANGER && styles.textDanger,
    theme === TextThemes.HEADER && styles.textHeader,
    theme === TextThemes.HINT && styles.textHint,
    textAlign && { textAlign },
    textTransform && { textTransform },
    underline && styles.underline,
    textShadow && styles.textShadow,
    color && { color },
    // bold && { fontFamily: bold && fonts.robotoBold },
    size && { fontSize: size },
    disabled && styles.textDisabled,
    disabledColor && { color: disabledColor },
    bold && { fontWeight: 'bold' },
    thin && { fontWeight: 'light' }
  ];

  return (
    <RNText style={style} selectable={props.selectable} numberOfLines={numberOfLines}>
      {props.children}
    </RNText>
  );
};
