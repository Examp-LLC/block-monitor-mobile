

import React, { ReactElement } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text } from '../../../../core/components/base/Text';
import { i18n } from '../../../../core/i18n';
import { FontSizes, Sizes } from '../../../../core/theme/sizes';
import { auth } from '../../translations';
import { cryptoIcons } from '../../../../assets/icons';
import { Colors } from '../../../../core/theme/colors';

interface Props {
  rightElement?: ReactElement;
}

const styles = StyleSheet.create({
  view: {
    paddingBottom: Sizes.SMALL
  }
});

export const UnstoppableButton: React.FunctionComponent<Props> = ({ rightElement }: Props) => {
  return (

    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <View style={{}}>
        <Image source={cryptoIcons.Unstoppable.icon} style={{ width: 50, height: 50 }} />
      </View>

      <View style={{ flex: 1, paddingLeft: 20 }}>
        <Text>
          Unstoppable Domains
        </Text>
        <Text size={FontSizes.SMALL} color={Colors.GREY}>
          Import using .crypto, .nft, etc.
        </Text>
      </View>
    </View>
  );
};
