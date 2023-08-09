import { isEmpty } from 'lodash';
import React from 'react';
import { View } from 'react-native';
import { Text, TextThemes, TextTransform } from '../../../core/components/base/Text';
import { i18n } from '../../../core/i18n';
import { Colors } from '../../../core/theme/colors';
import { defaultSideOffset, FontSizes, Sizes } from '../../../core/theme/sizes';
import { core } from '../../../core/translations';
import { amountToString } from '../../../core/utils/numbers';
import { PriceInfoReduxState } from '../../price-api/store/reducer';
import { Account } from '../../../core/interfaces';
import { getPrices } from '../../../core/utils/balance/getPrices';
import { AccountTypes } from '../../coinbase/interfaces/coinbase.interfaces';
import { home } from '../translations';

interface Props {
  accounts: Account[];
  priceApi?: PriceInfoReduxState
}

const styles: any = {
  view: {
    marginTop: 10,
    paddingHorizontal: defaultSideOffset
  }
};

export class AccountsListHeader extends React.PureComponent<Props> {
  render () {
    const { accounts, priceApi } = this.props;
    const hasAccounts = !isEmpty(accounts);

    if (!priceApi?.historicalPriceInfo?.prices) return null;

    const totalBalances = accounts.reduce((prev, curr) => {
      const prices = getPrices({ 
        priceApi, 
        lastBalance: curr.lastBalance, 
        currency: curr.currency,
        coinbase: curr.type === AccountTypes.Coinbase,
        tokenAddress: curr.tokenAddress,
        tokenDecimals: curr.tokenDecimals
      })
      return {
        BTC: (prices?.balanceBTC || 0) + prev.BTC,
        USD: (prices?.balanceUSD || 0) + prev.USD
      } 
    }, {
      BTC: 0,
      USD: 0
    });

    return hasAccounts ? ( 
      <View style={styles.view}>
        <Text 
          color={Colors.WHITE} 
          textTransform={TextTransform.UPPERCASE}
          bold
          size={FontSizes.SMALL}
        >{i18n.t(home.screens.welcome.grossBalance)}</Text>
        {totalBalances.USD ? (
          <>
            <Text color={Colors.WHITE} size={FontSizes.LARGE}>
              {i18n.t(core.currency.USD.value, { value: totalBalances.USD.toFixed(2) })}
            </Text>
          </>
        ) : null}
        {totalBalances.BTC ? (
          <>
            <Text color={Colors.WHITE} size={FontSizes.SMALL}>
              {i18n.t(core.currency.BTC.value, { value: amountToString(totalBalances.BTC) })}
            </Text>
          </>
        ) : null}
      </View>
    ) : null;
  }
}
