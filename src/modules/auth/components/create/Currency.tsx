import React, { ReactElement } from 'react';
import { View, Image } from "react-native";
import { Text, TextThemes } from "../../../../core/components/base/Text";
import { CURRENCIES, CURRENCY_SYMBOL } from "../../../../../../shared/constants";
import { Colors } from "../../../../core/theme/colors";
import { cryptoIcons } from '../../../../assets/icons';
import { i18n } from '../../../../core/i18n';
import { core } from '../../../../core/translations';
import { FontSizes } from '../../../../core/theme/sizes';

interface Props {
  currency: CURRENCY_SYMBOL;
  numberOfAccounts: number;
  rightElement?: ReactElement;
  maxAccounts: number;
}

export const Currency: React.FunctionComponent<Props> = ({ maxAccounts, currency, numberOfAccounts, rightElement }: Props) => {

  const used = Math.sign(maxAccounts-numberOfAccounts) === -1 ? 0 : maxAccounts-numberOfAccounts;
  return (
    <View style={{display: 'flex', flexDirection: 'row'}}>
      {cryptoIcons[currency] && <View>
        <Image source={cryptoIcons[currency].icon} style={{ width: 50, height: 50 }} />
      </View>}

      <View style={{ flex: 1, paddingLeft: 20 }}>
        <Text>
          {CURRENCIES[currency].label}
        </Text>
        <Text size={FontSizes.SMALL} color={Colors.GREY}>
          {i18n.t(core.currency.available, {
            x: used,
            y: maxAccounts
          })}
        </Text>
      </View>
    </View>
  );
}