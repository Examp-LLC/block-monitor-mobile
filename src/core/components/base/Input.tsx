import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { FontSizes } from '../../theme/sizes';
import { Text, TextThemes } from './Text';

export enum KeyboardTypes {
  DEFAULT = 'default',
  EMAIL = 'email-address',
  NUMERIC = 'numeric',
  PHONE = 'phone-pad'
}

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  hint?: string;
  keyboardType?: KeyboardTypes;
  maxLength?: number;
  secure?: boolean;
  placeholder?: string;
  disabled?: boolean;
  rightIcons?: React.ReactElement;
}

const color = Colors.GREY_DARK;

const styles = StyleSheet.create({
  wrapper: {
    // borderColor: Colors.BLUE,
    // borderWidth: 1,
    flexDirection: 'row',
    // shadowColor: Colors.BLACK,
    // shadowOffset: {
    //   width: 0,
    //   height: 1
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3
    alignItems: 'center',
  },
  text: {
    fontFamily: fonts.roboto,
    fontWeight: 'normal',
    fontSize: FontSizes.MEDIUM,
    color,
    borderWidth: 1,
    borderColor: Colors.GREY_LIGHT,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    width: '100%',
    flex: 1
  },
  end: {
    marginLeft: 'auto'
  }
});

export const Input: React.FunctionComponent<Props> = (props) => {
  const { keyboardType, maxLength, disabled, value, secure, placeholder, hint, onChangeText, rightIcons } = props;

  return (
    <View style={styles.wrapper}>
      {hint && <Text theme={TextThemes.HINT}>{hint}</Text>}
      <TextInput
        value={value}
        maxLength={maxLength}
        editable={!disabled}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        returnKeyType={'done'}
        secureTextEntry={secure}
        style={styles.text}
        selectionColor={color}
        placeholder={placeholder}
        placeholderTextColor={Colors.GREY}
      />
      <View style={styles.end}>
          {rightIcons}
      </View>
    </View>
  );
};
