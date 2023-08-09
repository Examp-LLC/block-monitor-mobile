import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { InjectedReduxProps, Account } from '../../../core/interfaces';
import { FullHeightView } from '../../../core/layout/FullHeightView';
import { Screen } from '../../../core/layout/Screen';
import { routes } from '../../../core/navigation/routes';
import { AppReduxState } from '../../../core/store/app/reducer';
import { ApplicationState } from '../../../core/store/initialState';
import { fetchBurstTokenInformation, fetchTokenInformation, loadHistoricalPriceApiData, selectCurrency } from '../../price-api/store/actions';
import { PriceInfoReduxState, PriceType, PriceTypeStrings } from '../../price-api/store/reducer';
import { AccountsList } from '../components/AccountsList';
import { AccountsListHeader } from '../components/AccountsListHeader';
import { EnterPasscodeModal } from '../../auth/components/passcode/EnterPasscodeModal';
import { TermsModal } from '../../auth/components/terms/TermsModal';
import { removeAccount, resetAuthState, setAgreeToTerms, hydrateAccount, hydrateCoinbaseAccount, setTrigger, hydrateLocalAccount } from '../../auth/store/actions';
import { AuthReduxState } from '../../auth/store/reducer';
import { shouldEnterPIN } from '../../auth/store/utils';
import { NoAccounts } from '../components/NoAccounts';
import { titleImages } from '../../../assets/images';
import { HomePieChart } from '../components/HomePieChart';
import { AccountTypes } from '../../coinbase/interfaces/coinbase.interfaces';
import { RootStackParamList } from '../../../core/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from '../../../core/components/base/Text';
import { i18n } from '../../../core/i18n';
import { home } from '../translations';
import { IAP_TIERS, PurchaseModal } from '../../iap/components/purchase/PurchaseModal';
import { makePurchase, userHasSubscription, validatePromoCode } from '../../iap/store/actions';
import { SUBS_ENABLED } from '../../../../../shared/constants';
import { InAppPurchaseReduxState } from '../../iap/store/reducer';

type HomeNavProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface CustomProps extends InjectedReduxProps {
  app: AppReduxState;
  auth: AuthReduxState;
  priceApi: PriceInfoReduxState;
  inAppPurchaseApi: InAppPurchaseReduxState;
  navigation: HomeNavProp;
}

type TProps = CustomProps;

interface State {
  isPINModalVisible: boolean;
  isTermsModalVisible: boolean;
  selectedCurrency: PriceTypeStrings;
  isPurchaseModalVisible: boolean;
  userHasSubscribed: boolean;
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    top: 'auto',
    height: '100%',
    flex: 1
  },
  addAccount: {
    justifyContent: 'center',
    alignContent: 'center',
    flex: 3,
    paddingLeft: 20,
    paddingRight: 20
  },
  addAccountText: {
    marginBottom: 20
  },
  title: {
    margin: 20
  },
  noBalance: {
    textAlign:'center'
  }
});

const priceTypes = [PriceType.BURST, PriceType.BTC, PriceType.USD];

class Home extends React.PureComponent<TProps, State> {

  _checkPinExpiryInterval?: any;
  focusListener: any;
  blurListener: any;

  state = {
    isPINModalVisible: false,
    isTermsModalVisible: false,
    selectedCurrency: priceTypes[1],
    isPurchaseModalVisible: false,
    userHasSubscribed: false
  };

  handleChangeAccount = () => {
    // const navigation = useNavigation();
    // navigation.navigate(routes.accounts);
  }


  constructor (props: TProps) {
    super(props);
    this.updateAllAccounts();

    this.focusListener = props.navigation.addListener('focus', () => {
      this.updateUserSubscriptionStatus();
    });

    this.blurListener = props.navigation.addListener('blur', () => {
      this.updateUserSubscriptionStatus();
    });
  }

  private updateUserSubscriptionStatus() {
    const userHasSubscribed = userHasSubscription(this.props.inAppPurchaseApi, this.props.auth);

    this.setState({
      userHasSubscribed
    });
  }

  componentDidUpdate() {
    if (this._checkPinExpiryInterval) {
      clearInterval(this._checkPinExpiryInterval);
    }
    const checkSessionExpiry = () => {
      const { passcodeTime } = this.props.app.appSettings;
      const { passcodeEnteredTime } = this.props.auth;
      if (shouldEnterPIN(passcodeTime, passcodeEnteredTime)) {
        this.setPINModalVisible(true);
      }
      this.checkTermsModal();
    };
    checkSessionExpiry();
    this._checkPinExpiryInterval = setInterval(checkSessionExpiry, 1000);
  }

  updateAllAccounts = () => {
    try {
      return Promise.all(this.props.auth.accounts.map((account) => {

        if (account.type === AccountTypes.Coinbase) {
          this.props.dispatch(hydrateCoinbaseAccount(account));
        } else {
          this.props.dispatch(hydrateLocalAccount(account));
        }
      }));
    // tslint:disable-next-line: no-empty
    } catch (e) { }
  }

  setPINModalVisible = (isPINModalVisible: boolean) => {
    this.setState({ isPINModalVisible });
  }

  setTermsModalVisible = (isTermsModalVisible: boolean) => {
    this.setState({ isTermsModalVisible });
  }

  setPurchaseModalVisible = (isPurchaseModalVisible: boolean) => {
    this.setState({ isPurchaseModalVisible });
  }

  handleAccountPress = (id: string) => {
    this.props.navigation.navigate(routes.notificationConfig, {
      id
    });
  }

  handleAddAccountPress = async () => {
    this.handleAddAccount();
  }

  handlePINEntered = () => {
    this.setPINModalVisible(false);
  }

  checkTermsModal = () => {
    this.setTermsModalVisible(!this.props.auth.agreeToTerms);
  }

  handleTermsAgreed = () => {
    this.props.dispatch(setAgreeToTerms(true));
  }

  handleAddAccount = () => {
    // @ts-ignore
    this.props.navigation.navigate(routes.addAccountStepOne);
  }

  handlePINCancel = () => {
    this.setPINModalVisible(false);
  }

  handleDelete = (account: Account) => {
    this.props.dispatch(removeAccount(account));
  }

  handlePurchase = (sku: IAP_TIERS) => {
    this.setState({ 
      userHasSubscribed: true 
    });
    this.props.dispatch(makePurchase(sku));
    this.props.navigation.navigate(routes.home);
  }

  handlePromoCodeSubmitted = (promoCode: string) => {
    this.props.dispatch(validatePromoCode(promoCode));
    this.props.navigation.navigate(routes.home);
  }

  handleReset = () => {
    this.props.dispatch(resetAuthState());
    // @ts-ignore
    this.props.navigation.navigate(routes.home);
  }

  handleAccountsListRefresh = () => {
    this.props.dispatch(loadHistoricalPriceApiData());
    this.props.dispatch(fetchTokenInformation());
    this.props.dispatch(fetchBurstTokenInformation());
    return this.updateAllAccounts();
  }

  handleMonitorStatusPressed = () => {
    this.setPurchaseModalVisible(true);
  }

  componentWillUnmount () {
    if (this._checkPinExpiryInterval) {
      clearInterval(this._checkPinExpiryInterval);
    }
  }

  selectCurrency () {
    this.props.dispatch(
      selectCurrency(priceTypes[priceTypes.findIndex(
        (val) => val === this.props.priceApi.selectedCurrency
      ) + 1] || priceTypes[0]
      )
    );
  }

  render () {

    this.updateUserSubscriptionStatus();
    const accounts: Account[] = this.props.auth.accounts || [];
    const priceApi = this.props.priceApi;
    const shouldShowChart = accounts.length && priceApi.historicalPriceInfo;
    const { isTermsModalVisible, isPINModalVisible, isPurchaseModalVisible, userHasSubscribed } = this.state;

    return (
      <Screen>
        <FullHeightView withoutPaddings>
          <AccountsListHeader priceApi={priceApi} accounts={accounts} />
          <View style={styles.wrapper}>

            {shouldShowChart && <HomePieChart
              priceApi={priceApi}
              accounts={accounts}
              priceTypes={priceTypes}
            /> || null}

            {accounts.length && <AccountsList
              accounts={accounts}
              onAccountPress={this.handleAccountPress}
              onAddAccountPress={this.handleAddAccountPress}
              onDelete={this.handleDelete}
              priceApi={this.props.priceApi}
              userHasSubscribed={userHasSubscribed}
              onRefresh={this.handleAccountsListRefresh}
              onMonitorStatusPress={this.handleMonitorStatusPressed}
            /> || <NoAccounts onPress={this.handleAddAccount} />}

            <EnterPasscodeModal
              visible={this.props.auth.agreeToTerms && isPINModalVisible}
              onSuccess={this.handlePINEntered}
              onCancel={this.handlePINCancel}
              onReset={this.handleReset}
            />

            <TermsModal
              visible={isTermsModalVisible}
              onAgree={this.handleTermsAgreed}
            />

            <PurchaseModal
              // visible={true}
              visible={isPurchaseModalVisible}
              onSuccess={this.handlePurchase}
              onSubmitPromoCode={this.handlePromoCodeSubmitted}
              onViewCurrencyList={() => {
                this.setState({
                  isPurchaseModalVisible: false
                })
              }}
              onDismiss={() => {
                this.setState({
                  isPurchaseModalVisible: false
                })
                this.props.navigation.navigate(routes.home);
              }} />
          </View>
        </FullHeightView>
      </Screen>
    );
  }
}

function mapStateToProps (state: ApplicationState) {
  return {
    app: state.app,
    auth: state.auth,
    priceApi: state.priceApi,
    inAppPurchaseApi: state.inAppPurchaseApi
  };
}

export const HomeScreen = connect(mapStateToProps)(Home);
