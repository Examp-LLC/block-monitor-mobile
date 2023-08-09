import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { actionIcons, cryptoIcons } from '../../../assets/icons';
import { Text, TextAlign } from '../../../core/components/base/Text';
import { i18n } from '../../../core/i18n';
import { AccountColors, Colors } from '../../../core/theme/colors';
import { defaultSideOffset, FontSizes, Sizes } from '../../../core/theme/sizes';
import { core } from '../../../core/translations';
import { amountToString } from '../../../core/utils/numbers';
import { PriceInfoReduxState, PriceType } from '../../price-api/store/reducer';
import { Account } from '../../../core/interfaces';
import { CURRENCIES, STATUS } from '../../../../../shared/constants';
import { getPrices } from '../../../core/utils/balance/getPrices';
import { AccountTypes } from '../../coinbase/interfaces/coinbase.interfaces';
import { convertIotaBalance } from '../../../core/utils/balance/iota';

interface IProps {
  onPress: (account: Account) => void;
  onDelete: (account: Account) => void;
  account: Account;
  priceApi?: PriceInfoReduxState;
  accountIndex: number;
}

type Props = IProps;

const styles: any = {
  view: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    backgroundColor: '#22485D',
    padding:20,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  accountCol: {
    flex: 1,
    paddingLeft:5,
    maxWidth: '45%',
  },
  amountCol: {
    padding:0,
    flex: 1
  },
  row: {
    display: 'flex',
    width: '100%'
  },
  cryptoRow: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
  },
  del: {
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto'
  },
  expired: {
    opacity: .25
  },
  icon: { 
    marginLeft: 5,
    width: 15, 
    height: 15 
  }
};

export class AccountListItem extends React.PureComponent<Props> {
  handlePress = () => {
    const { onPress, account } = this.props;
    onPress(account);
  }

  handleDelete = () => {
    const { onDelete, account } = this.props;
    onDelete(account);
  }

  getSwipeButtons = () => [
    {
      component: <Image source={actionIcons.del} style={styles.del} />,
      backgroundColor: Colors.RED,
      underlayColor: Colors.GREY,
      style: styles.buttonStyles,
      onPress: this.handleDelete
    }
  ]

  render () {
    let { address, lastBalance, currency, id, type, name, status, tokenAddress, tokenName, tokenSymbol, tokenDecimals } = this.props.account;
    const { priceApi, accountIndex } = this.props;

    const currencyName = tokenName && tokenName.length ? tokenName : currency;

    const currencySymbol = tokenSymbol && tokenSymbol.length ? tokenSymbol : currency;

    const prices = priceApi && getPrices({
      priceApi, lastBalance, currency, coinbase: type === AccountTypes.Coinbase, tokenAddress, tokenDecimals
    });

    return (
      <Swipeout
        right={this.getSwipeButtons()}
        autoClose={true}
        backgroundColor='transparent'
      >
        <TouchableOpacity onPress={this.handlePress}>
          <View style={[styles.view, status === STATUS.EXPIRED && styles.expired]}>
            <View
              style={{
                backgroundColor: AccountColors[accountIndex],
                width: 25,
                height: 25,
                borderRadius: 25,
                left: -5
              }}
            />
            <View style={styles.accountCol}>
              <View style={{flexDirection:'row'}}> 
                <View style={{}}>
                  {type !== AccountTypes.Coinbase && 
                    <Text color={Colors.WHITE} size={FontSizes.SMALL}>...{address.slice(address.length - 5, address.length)}</Text>}
                  {type === AccountTypes.Coinbase && 
                    <Text color={Colors.WHITE} size={FontSizes.SMALL}>{name || `... ${id.slice(address.length - 5, address.length)}`}</Text>}
                </View>
                <View style={{paddingLeft:5}}>
                  {/* {type !== AccountTypes.Coinbase && <Image 
                    source={{
                      uri: `https://burst-balance-alert.now.sh/api/hashicon?text=${address}&size=s`,
                    }}
                    style={{ width: 20, height: 20, marginRight: 5 }} 
                  />} */}
                </View>
              </View>
              <View style={styles.cryptoRow}>
                <Text size={FontSizes.XSMALL} color={Colors.WHITE}>{tokenAddress && currencyName || CURRENCIES[currency]?.label}</Text>
                  {type === AccountTypes.Coinbase && <Image source={cryptoIcons['Coinbase'].white} style={styles.icon} />}
                  {type !== AccountTypes.Coinbase && cryptoIcons[currency] && <Image source={cryptoIcons[currency].white} style={styles.icon} />}
              </View>
            </View>
            <View style={styles.amountCol}>
              <View style={styles.row}>
                <Text bold size={FontSizes.SMALL} textAlign={TextAlign.RIGHT} color={Colors.WHITE}>
                  {
                    // IOTA: Custom formatting
                    currency === CURRENCIES.MIOTA.ticker ? 
                      convertIotaBalance(prices?.balance || 0) :
                      `${amountToString(prices?.balance || 0)} ${currencySymbol || `Unknown Tokens`}`
                  }
                </Text> 
              </View>
              {priceApi && priceApi.historicalPriceInfo && (
                <View style={styles.row}>
                  <Text size={FontSizes.XSMALL} textAlign={TextAlign.RIGHT} color={Colors.WHITE}>
                    {/* {priceApi.selectedCurrency === PriceType.USD ?
                      i18n.t(core.currency.USD.value, { value: prices?.balanceUSD.toFixed(2) }) :
                      i18n.t(core.currency.BTC.value, { value: amountToString(prices?.balanceBTC || 0) })} */}
                    {i18n.t(core.currency.BTC.value, { value: amountToString(prices?.balanceBTC || 0) })}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Swipeout>
    );
  }
}
