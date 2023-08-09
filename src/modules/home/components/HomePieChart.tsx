import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import {
  PriceInfoReduxState,
} from '../../price-api/store/reducer';
import { Account } from '../../../core/interfaces';
import { getPrices } from '../../../core/utils/balance/getPrices';
import { AccountColors, Colors } from '../../../core/theme/colors';
import { AccountTypes } from '../../coinbase/interfaces/coinbase.interfaces';
import { Text, TextThemes } from '../../../core/components/base/Text';
import { FontSizes } from '../../../core/theme/sizes';
import { i18n } from '../../../core/i18n';
import { home } from '../translations';
import { amountToString } from '../../../core/utils/numbers';

interface ChartData {
  [key: string]: number | Date;
  // day: Date;
  // `account[0-n]`: number;
}

interface Props {
  accounts: Account[];
  priceApi: PriceInfoReduxState;
  priceTypes: string[];
}

interface State {
  selectedSlice: {
    label: string;
    value: number;
  };
  labelWidth: number
}

const styles = StyleSheet.create({
  zeroBalance: {
    height: 280,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});


export class HomePieChart extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedSlice: {
        label: '',
        value: -1
      },
      labelWidth: 0
    }
  }

  render() {

    const { selectedSlice } = this.state;
    const { label, value } = selectedSlice;
    const { priceApi } = this.props;

    const getAccountColors = (colors: string[]): string[] => {
      return (colors.length > this.props.accounts.length) ?
        colors : getAccountColors(colors.concat(colors));
    };

    const accountColors = getAccountColors(AccountColors);

    const pieData = this.props.accounts
      .map(({ lastBalance, currency, type, tokenAddress, tokenDecimals }) => {
        return getPrices({
          priceApi: this.props.priceApi,
          lastBalance,
          currency,
          coinbase: type === AccountTypes.Coinbase,
          tokenAddress,
          tokenDecimals
        })
      })
      .filter((getPricesResponse) => {
        if (getPricesResponse.balanceBTC) return getPricesResponse;
      })
      .map(({ balanceBTC, balance }, index) => {
        const tokenAddress = this.props.accounts[index].tokenAddress;

        const currencySymbol = tokenAddress ? priceApi?.tokenPriceInfo &&
          priceApi?.tokenPriceInfo[tokenAddress]?.symbol : this.props.accounts[index].currency;
        return ({
          value: balanceBTC,
          svg: {
            fill: accountColors[index],
            // onPress: () => console.log('press', index),
          },
          arc: { outerRadius: (70 + (20 / (this.props.accounts.length - index))) + '%', padAngle: label === `pie-${index}` ? 0.1 : 0 },
          key: `pie-${index}`,
          onPress: () => this.setState({
            selectedSlice: {
              label: currencySymbol || '',
              value: balance || 0
            }
          })
        })
      });

    const atLeastOneAccountHasBalance = pieData.filter(({ value }) => value).length;

    return (atLeastOneAccountHasBalance &&
      <View>
        <PieChart
          outerRadius={'100%'}
          innerRadius={'45%'}
          style={{ height: 280 }}
          data={pieData}
        />
        {value > -1 && <View style={{
          position: 'absolute',
          top: 110,
          width: '100%',
          alignItems: 'center',
          alignContent: 'center'
        }}>
          <Text textShadow theme={TextThemes.HEADER} color={Colors.WHITE}>
            {`${amountToString(value, 2)}`}
          </Text>
          <Text color={Colors.GREY_LIGHT} theme={TextThemes.ACCENT}>
            {label.toUpperCase()}
          </Text>
        </View>}
      </View>
      ||
      <View style={styles.zeroBalance}>
        <Text color={Colors.WHITE} bold size={FontSizes.LARGE}>{i18n.t(home.screens.welcome.zeroBalance)}</Text>
        <Text color={Colors.BLUE_GREY}>{i18n.t(home.screens.welcome.emptyAddresses)}</Text>
      </View>

    )
  }
}

