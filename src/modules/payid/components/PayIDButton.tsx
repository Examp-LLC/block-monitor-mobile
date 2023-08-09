

import React, { ReactElement } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, TextThemes } from '../../../core/components/base/Text';
import { FontSizes, Sizes } from '../../../core/theme/sizes';
import { cryptoIcons } from '../../../assets/icons';
import { Colors } from '../../../core/theme/colors';

interface Props {
  rightElement?: ReactElement;
}

const styles = StyleSheet.create({
  view: {
    paddingBottom: Sizes.SMALL
  }
});

export const PayIDButton: React.FunctionComponent<Props> = ({ rightElement }: Props) => {
  return (

    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <View style={{}}>
        <Image source={cryptoIcons.PayID.icon} style={{ width: 50, height: 50 }} />
      </View>

      <View style={{ flex: 1, paddingLeft: 20 }}>
        <Text>
          PayString
        </Text>
        <Text size={FontSizes.SMALL} color={Colors.GREY}>
          Import using PayString address
        </Text>
      </View>
    </View>
  );
};
