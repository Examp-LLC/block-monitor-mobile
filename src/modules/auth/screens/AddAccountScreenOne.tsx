import React from 'react';
import { StyleSheet, View, Image, Alert, GestureResponderEvent } from 'react-native';
import { connect } from 'react-redux';
import { Button } from '../../../core/components/base/Button';
import { Text as BText, TextThemes } from '../../../core/components/base/Text';
import { HeaderTitle } from '../../../core/components/header/HeaderTitle';
import { i18n } from '../../../core/i18n';
import { InjectedReduxProps } from '../../../core/interfaces';
import { FullHeightView } from '../../../core/layout/FullHeightView';
import { Screen } from '../../../core/layout/Screen';
import { routes } from '../../../core/navigation/routes';
import { ApplicationState } from '../../../core/store/initialState';
import { Colors } from '../../../core/theme/colors';
import { Sizes } from '../../../core/theme/sizes';
import { AuthReduxState } from '../store/reducer';
import { auth } from '../translations';
import { useNavigation } from '@react-navigation/native';
import { CURRENCIES, CURRENCY_SYMBOL, SUBS_ENABLED } from '../../../../../shared/constants';
import { createAccountOnServer, addAccount, createCoinbaseAccountOnServer, createAccountOnDevice } from '../store/actions';
import { titleImages, formImages } from '../../../assets/images';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Currency } from '../components/create/Currency';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../core/navigation/RootStackParamList';
import { UnstoppableButton } from '../components/unstoppable/UnstoppableButton';
import { IAP_TIERS, PurchaseModal } from '../../iap/components/purchase/PurchaseModal';
import { CurrencyListModal } from '../../iap/components/currency-list/CurrencyListModal';
import { makePurchase } from '../../iap/store/actions';
import { defaultSettings } from '../../../core/environment';
import { authorize } from 'react-native-app-auth';
import { CoinbaseButton } from '../../coinbase/components/CoinbaseButton';
import { PayIDButton } from '../../payid/components/PayIDButton';
import { InAppPurchaseReduxState } from '../../iap/store/reducer';
import { getMaxAccounts } from '../store/utils';
import { FIOButton } from '../../fio/components/FIOButton';
import { Notifications } from 'react-native-notifications';
import { isIOS } from '../../../core/utils/platform';

const config = {
  clientId: defaultSettings.coinbaseClientId,
  clientSecret: defaultSettings.coinbaseClientSecret,
  redirectUrl: 'com.blockmon://redirect',
  usePKCE: false,
  scopes: ['wallet:accounts:read'], // https://developers.coinbase.com/docs/wallet/permissions
  serviceConfiguration: {
    authorizationEndpoint: 'https://www.coinbase.com/oauth/authorize',
    tokenEndpoint: 'https://api.coinbase.com/oauth/token',
    revocationEndpoint: 'https://api.coinbase.com/oauth/revoke',
  },
};

type AddAccountScreenNavProp = StackNavigationProp<
  RootStackParamList,
  'addAccountStepOne'
>;

interface IProps extends InjectedReduxProps {
  auth: AuthReduxState,
  navigation: AddAccountScreenNavProp,
  inAppPurchaseApi: InAppPurchaseReduxState
}
type Props = IProps;

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    height: '100%'
  },
  title: {
    margin: 20
  },
  marginHorizontal: {
    marginHorizontal: 20
  },
  form: {
    display: 'flex',
    flexGrow: 1
  },
  scan: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  inputIcon: {
    marginTop: 3,
    marginRight: 2,
    width: 20,
    height: 20,
    backgroundColor: Colors.TRANSPARENT
  },
  total: {
    marginTop: 10
  },
  swipeButtonContainer: {
    marginTop: 20
  },
  chevron: {
    width: 25,
    height: 25,
    marginTop: 3
  },
  hintView: {
    paddingTop: Sizes.SMALL,
    flexGrow: 1
  },
  currency: {
    marginTop: 3,
    marginRight: 5,
    height: 200
  },
  listItem: { 
    borderColor: 'rgba(0,0,0,.1)', 
    borderBottomWidth: 1, 
    paddingLeft: 20, 
    paddingRight: 20, 
    paddingTop: 20, 
    paddingBottom: 20 
  }
});

const UNSTOPPABLE = 'Unstoppable';
const COINBASE = 'Coinbase';
const PAYID = 'PayID';
const FIO = 'FIO';

type AvailableCurrencies = CURRENCY_SYMBOL | typeof UNSTOPPABLE | typeof COINBASE | typeof PAYID | typeof FIO;

interface AddAccountState {
  currency?: AvailableCurrencies;
  address: string;
}

class AddAccountOne extends React.PureComponent<Props, AddAccountState> {
  static navigationOptions = {
    headerTitle: <HeaderTitle>{i18n.t(auth.addAccount.title)}</HeaderTitle>
  };

  getDefaultState = () => {
    return {
      currency: undefined,
      address: ''
    }
  }

  state = this.getDefaultState();

  constructor(props: Props) {
    super(props);
  }

  // handleChangeCurrency = (currency: AvailableCurrencies) => {
  //   this.setState({
  //     currency
  //   });
  // }

  handleAddressChange = (e: GestureResponderEvent) => {
    this.setState({
      // address
    });
  }

  handleChangeCurrency = async (currency: AvailableCurrencies) => {
    this.setState({
      currency
    });
    
    if (currency !== COINBASE) {
      // @ts-ignore
      this.props.navigation.push(routes.addAccountStepTwo, { currency });
    } else {
      await this.handleCoinbase();
    }
  }

  getRadioIcon = (cur: AvailableCurrencies) => {
    const { currency } = this.state;
    return cur === currency ? formImages.radioOn : formImages.radioOff
  }

  getCurrencies = () => {
    return Object.keys(CURRENCIES)
      .filter((symbol) => {
        return CURRENCIES[symbol as CURRENCY_SYMBOL].mobile
      })
      .sort()
      .map((symbol, i) => {
        let currency = symbol as CURRENCY_SYMBOL;
        const maxAccounts = getMaxAccounts(
          this.props.auth.accounts,
          this.props.inAppPurchaseApi.purchases,
          this.props.auth.userIsOnAllowList
        );
        const numberOfAccounts = this.props.auth.accounts.filter((account) => account.currency === currency).length;
        const disabled = numberOfAccounts >= maxAccounts.perCurrency;

        return (
          <View key={i} style={{ opacity: disabled ? .5 : 1 }}>
            <TouchableOpacity
              onPress={() => {
                if (disabled) return;
                this.handleChangeCurrency(currency);
              }}
              style={styles.listItem}>

              <Currency
                currency={currency}
                numberOfAccounts={numberOfAccounts}
                maxAccounts={maxAccounts.perCurrency}
              />

            </TouchableOpacity>
          </View>
        )
      });
  }


  private async handleCoinbase() {
    try {
      // if (!this.props.auth.deviceId && defaultSettings.development !== 'true') {
      //   throw new Error(i18n.t(auth.errors.missingDeviceToken));
      // }

      // Log in to get an authentication token
      const authState = await authorize(config);

      const account = await this.props.dispatch(createCoinbaseAccountOnServer({
        phone: this.props.auth.deviceId || '',
        accessToken: authState.accessToken,
        refreshToken: authState.refreshToken,
        idToken: authState.idToken,
        scopes: authState.scopes,
        accessTokenExpirationDate: authState.accessTokenExpirationDate
      }));

      await this.props.dispatch(addAccount(account));
      this.props.navigation.navigate(routes.home);
    }
    catch (error) {
      this.setState(this.getDefaultState());
      // @ts-ignore
      Alert.alert(error.message);
    }
  }

  isSubmitEnabled = () => {
    return !!this.state.currency;
  }

  render() {
    return (
      <Screen style={{ backgroundColor: Colors.WHITE }}>
        <FullHeightView withoutPaddings>

          <View style={{ marginTop: 20, marginHorizontal: 20 }}>
            <BText theme={TextThemes.HEADER}>
              {i18n.t(auth.addAccount.createAccount)}
            </BText>
            
            <BText color={Colors.GREY}>
              {i18n.t(auth.addAccount.selectCurrency)}
            </BText>
          </View>

          <ScrollView style={{ marginTop: 20 }}>
            {this.getCurrencies()}

            <TouchableOpacity
              onPress={(e) => {
                this.handleChangeCurrency(UNSTOPPABLE);
              }}
              style={styles.listItem}>
              <UnstoppableButton />
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={(e) => {
                this.handleChangeCurrency(COINBASE);
              }}
              style={styles.listItem}>
              <CoinbaseButton />
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={(e) => {
                this.handleChangeCurrency(PAYID);
              }}
              style={styles.listItem}>
              <PayIDButton />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={(e) => {
                this.handleChangeCurrency(FIO);
              }}
              style={styles.listItem}>
              <FIOButton />
            </TouchableOpacity>
          </ScrollView>
        </FullHeightView>
      </Screen>
    );
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    auth: state.auth,
    inAppPurchaseApi: state.inAppPurchaseApi
  };
}

export const AddAccountScreenOne = connect(mapStateToProps)(AddAccountOne);
