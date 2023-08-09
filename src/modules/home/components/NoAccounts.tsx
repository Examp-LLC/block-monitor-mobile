import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, TextAlign } from '../../../core/components/base/Text';
import { i18n } from '../../../core/i18n';
import { Colors } from '../../../core/theme/colors';
import { FontSizes } from '../../../core/theme/sizes';
import { auth } from '../../auth/translations';
import { actionIcons } from '../../../assets/icons';
import { logos } from '../../../assets/images';

interface Props {
  onPress: () => void;
}

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%'
  }
});

export const NoAccounts: React.FunctionComponent<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity activeOpacity={1} style={styles.view} onPress={onPress}>
      <Image source={logos.splash} style={{alignSelf:'center', marginBottom: 20, width: 100, height: 115}} />
      <Text color={Colors.WHITE} size={FontSizes.LARGE} textAlign={TextAlign.CENTER}>
        {i18n.t(auth.accounts.noAccounts.title)}
      </Text>
      <Text color={Colors.WHITE} textAlign={TextAlign.CENTER}>
        {i18n.t(auth.accounts.noAccounts.hint)}
      </Text>
    </TouchableOpacity>

  );
};
