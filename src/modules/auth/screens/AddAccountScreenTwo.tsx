import React from 'react';
import { StyleSheet, View, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { connect } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import { Button } from '../../../core/components/base/Button';
import { Text as BText, TextThemes } from '../../../core/components/base/Text';
import { HeaderTitle } from '../../../core/components/header/HeaderTitle';
import { i18n } from '../../../core/i18n';
import { Account, InjectedReduxProps } from '../../../core/interfaces';
import { FullHeightView } from '../../../core/layout/FullHeightView';
import { Screen } from '../../../core/layout/Screen';
import { routes } from '../../../core/navigation/routes';
import { ApplicationState } from '../../../core/store/initialState';
import { Colors } from '../../../core/theme/colors';
import { FontSizes, Sizes } from '../../../core/theme/sizes';
import { AuthReduxState } from '../store/reducer';
import { auth } from '../translations';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { Input, KeyboardTypes } from '../../../core/components/base/Input';
import { CURRENCIES, CURRENCY_SYMBOL, MAX_ACCOUNTS_PER_CURRENCY } from '../../../../../shared/constants';
import {  addAccount, hydrateAccount, createAccountOnDevice } from '../store/actions';
import { titleImages } from '../../../assets/images';
import { Currency } from '../components/create/Currency';
import { RootStackParamList } from '../../../core/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { core } from '../../../core/translations';
import { UnstoppableButton } from '../components/unstoppable/UnstoppableButton';
import { UnstoppableResponse } from '../components/unstoppable/UnstoppableResponse';
import { transactionIcons } from '../../../assets/icons';
import { getMaxAccounts, MaxAccountValues } from '../store/utils';
import { InAppPurchaseReduxState } from '../../iap/store/reducer';
import { PayIDButton } from '../../payid/components/PayIDButton';
import { defaultSettings } from '../../../core/environment';
import { PayIDResponse } from '../../payid/components/PayIDResponse';
import { FIOResponse } from '../../fio/components/FIOResponse';
import { FIOButton } from '../../fio/components/FIOButton';
import { convertHexEndianess } from '@burstjs/util';
import { fetchBurstTokenInformation, fetchTokenInformation } from '../../price-api/store/actions';
import { some } from 'lodash';
var codec = require('xrpl-tagged-address-codec')
const sha1 = require('sha1');

type AddAccountRouteProp = RouteProp<RootStackParamList, 'addAccountStepTwo'>;
type AddAccountNavProp = StackNavigationProp<RootStackParamList, 'addAccountStepTwo'>;

interface IProps extends InjectedReduxProps {
  auth: AuthReduxState;
  currency: CURRENCY_SYMBOL | 'Unstoppable' | 'PayID' | 'FIO';
  route: AddAccountRouteProp;
  navigation: AddAccountNavProp;
  address?: string;
  inAppPurchaseApi: InAppPurchaseReduxState;
}
type Props = IProps;

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    height: '100%'
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
    marginRight: 2,
    marginLeft: 15,
    width: 25,
    height: 25,
    top:-1
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
    marginRight: 5
  },
  row: {
    marginTop:5,
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center'
  }
});

interface AddAccountState {
  address: string;
  addressIsDirty: boolean;
  addressIsValid: boolean;
  submitted: boolean;
  loading: boolean;
  maxAccounts: MaxAccountValues;
  addToken: boolean;
  isEthValidator: boolean;
  tokenAddress: string;
  tokenAddressIsValid: boolean;
  tokenAddressIsDirty: boolean;
  tokenDecimals: string;
  tokenDecimalsIsValid: boolean;
  tokenDecimalsIsDirty: boolean;
}

class AddAccountTwo extends React.PureComponent<Props, AddAccountState> {

  getDefaultState = () => {
    return {
      address: '',
      addressIsValid: false,
      addressIsDirty: false,
      submitted: false,
      loading: false,
      maxAccounts: getMaxAccounts(this.props.auth.accounts, this.props.inAppPurchaseApi.purchases, this.props.auth.userIsOnAllowList),
      addToken: false,
      isEthValidator: false,
      tokenAddress: '',
      tokenAddressIsValid: false,
      tokenAddressIsDirty: false,
      tokenDecimals: '',
      tokenDecimalsIsValid: false,
      tokenDecimalsIsDirty: false
    }
  }
  
  state = this.getDefaultState();

  constructor(props: Props) {
    super(props);
  }

  componentDidUpdate() {
    let { address, token } = this.props.route.params;
    if (address) {
      // some urls begin with bitcoin: and end with ?queryParams
      address = address.replace(/(^\w+:|^)/, '').split('?')[0];
      this.props.route.params.address = undefined;

      if (token) {
        this.handleTokenAddressChange(address);
      } else {
        this.handleAddressChange(address);
      }
    }
  }

  handleAddressChange = (address: string) => {
    const { currency } = this.props.route.params;
    
    let addressIsValid;
    if (currency === 'Unstoppable') {
      addressIsValid = address.toUpperCase().endsWith('.CRYPTO') ||
                       address.toUpperCase().endsWith('.ZIL') ||
                       address.toUpperCase().endsWith('.BLOCKCHAIN') ||
                       address.toUpperCase().endsWith('.BITCOIN') ||
                       address.toUpperCase().endsWith('.COIN') ||
                       address.toUpperCase().endsWith('.NFT') ||
                       address.toUpperCase().endsWith('.WALLET') ||
                       address.toUpperCase().endsWith('.X') ||
                       address.toUpperCase().endsWith('.DAO') ||
                       address.toUpperCase().endsWith('.888');
    } else if (currency === 'PayID') {
      addressIsValid = address.split('$').length === 2;
    } else if (currency === 'FIO') {
      addressIsValid = CURRENCIES.FIO.isAddressValid(address);
    } else {
      addressIsValid = CURRENCIES[currency]?.isAddressValid(address);
    }
    const addressIsDirty = address.length > 0;
    
    this.setState({
      address,
      addressIsValid,
      addressIsDirty
    });
  }

  handleTokenAddressChange = (tokenAddress: string) => {
    const tokenAddressIsValid = CURRENCIES.ETH.isAddressValid(tokenAddress);
    const tokenAddressIsDirty = tokenAddress.length > 0;
    
    this.setState({
      tokenAddress,
      tokenAddressIsValid,
      tokenAddressIsDirty
    });
  }

  handleTokenDecimalsChange = (tokenDecimals: string) => {
    const tokenDecimalsIsValid = !isNaN(parseInt(tokenDecimals)) && 
      parseInt(tokenDecimals).toString() == tokenDecimals && 
      !isNaN(parseInt(tokenDecimals, 10)) &&
      parseInt(tokenDecimals) < 500; // doubt there are any tokens with > 500 decimals
    const tokenDecimalsIsDirty = tokenDecimals.length > 0;
    
    this.setState({
      tokenDecimals,
      tokenDecimalsIsValid,
      tokenDecimalsIsDirty
    });
  }

  handleCreateAccount = async () => {
    let { address, tokenAddress, tokenDecimals, isEthValidator } = this.state;
    const { navigation } = this.props;
    const { currency } = this.props.route.params;

    // if (!this.props.auth.deviceId && defaultSettings.development !== 'true') throw new Error('Please allow push notifications');

    try {
      this.setState({
        submitted: true,
        loading: true
      });
      if (currency === 'Unstoppable') {
        await this.handleCreateUnstoppableAccount(address);
      } else if (currency === 'PayID') {
        await this.handleCreatePayIDAccount(address);
      } else if (currency === 'FIO' && !(address.length === 53 && address.startsWith('FIO'))) {
        await this.handleCreateFIOAccount(address);
      } else {
        // handle X-Addresses
        if (currency === CURRENCIES.XRP.ticker && address.length === 47) {
          address = codec.Decode(address)?.account || address;
        }

        await this.handleCreateRegularAccount(currency, address, tokenAddress, tokenDecimals, isEthValidator);
      }
    } catch (error) {
      this.setState(this.getDefaultState());
      Alert.alert(error?.message || i18n.t(auth.errors.serverErrorAddingAccount));
    }
    this.setState({
      submitted: false,
      loading: false
    });
    navigation.popToTop();
    navigation.navigate(routes.home);
  }

  getCurrencies = () => {
    return Object.keys(CURRENCIES).map((symbol) => {
      let currency = symbol as CURRENCY_SYMBOL;
      
      return {
        label: `${CURRENCIES[currency].label} (${CURRENCIES[currency].ticker})`,
        value: currency
      }
    });
  }

  handleCameraIconPress = () => {
    this.props.navigation.navigate(routes.scan, {
      currency: this.props.route.params.currency
    });
  }

  handleAddTokenCameraIconPress = () => {
    this.props.navigation.navigate(routes.scan, {
      currency: this.props.route.params.currency,
      token: true
    });
  }

  isSubmitEnabled = () => {
    const { currency } = this.props.route.params;
    if (this.state.addToken && currency === 'ETH') {
      return this.state.addressIsValid && this.state.addressIsDirty &&
        this.state.tokenAddressIsValid && this.state.tokenAddressIsDirty &&
        this.state.tokenDecimalsIsValid && this.state.tokenDecimalsIsDirty &&
        !this.state.submitted;
    } else if (this.state.addToken) {
      return this.state.addressIsValid && this.state.addressIsDirty &&
        this.state.tokenAddressIsValid && this.state.tokenAddressIsDirty &&
        !this.state.submitted;
    } else {
      return this.state.addressIsValid && this.state.addressIsDirty && !this.state.submitted;
    }
  }

  handlePaste = async () => {
    const address = await Clipboard.getString();
    this.handleAddressChange(address);
  }

  handleAddTokenPaste = async () => {
    const address = await Clipboard.getString();
    this.handleTokenAddressChange(address);
  }

  private async handleCreateRegularAccount(currency: string, address: string, tokenAddress: string, tokenDecimals: string, isEthValidator = false) {
    
    if (tokenAddress?.length && currency === 'ETH') {
      await this.props.dispatch(fetchTokenInformation([tokenAddress]));
    } else if (tokenAddress?.length && currency === 'BURST') {
      await this.props.dispatch(fetchBurstTokenInformation([tokenAddress]));
    }
    const hasAccount = some(this.props.auth.accounts, (item) => 
    tokenAddress && tokenAddress.length ? 
      item.address === address && tokenAddress === item.tokenAddress :
      item.address === address && item.currency === currency);

    if (hasAccount) {
      throw new Error(i18n.t(auth.errors.accountExist));
    }

    const account = await this.props.dispatch(createAccountOnDevice({ 
      currency: currency as CURRENCY_SYMBOL, 
      address, 
      tokenAddress, 
      deviceId: this.props.auth.deviceId as string,
      tokenDecimals,
      isEthValidator
    }));

    await this.props.dispatch(addAccount(account));
    Alert.alert(i18n.t(auth.addAccount.success));
  }

  private async handleCreateUnstoppableAccount(address: string) {
    let added = false;

    const response = await fetch(`https://unstoppabledomains.com/api/v1/${address.toLowerCase()}`)
    const responseBody: UnstoppableResponse = await response.json();
    if (responseBody && responseBody.addresses) {
      const addresses = Object.keys(responseBody.addresses);
      for (const key of addresses) {

        if (!CURRENCIES[key as CURRENCY_SYMBOL]?.api) continue;

        if (this.userHasTooManyAddresses(key)) continue;

        const hasAccount = some(this.props.auth.accounts, (item) => item.address === address);
    
        if (hasAccount) {
          continue;
        }

        const account = await this.props.dispatch(createAccountOnDevice({ 
          currency: key as CURRENCY_SYMBOL, 
          address: responseBody.addresses[key as CURRENCY_SYMBOL], 
          deviceId: this.props.auth.deviceId as string,
        }));
        await this.props.dispatch(addAccount(account));
        added = true;
      }
      if (added) {
        Alert.alert(i18n.t(auth.addAccount.success));
      } else {
        Alert.alert(i18n.t(auth.errors.noUnstoppableAddressesFound));
      }
    } else {
      Alert.alert(i18n.t(auth.errors.noUnstoppableAddressesFound));
    } 
  }

  private userHasTooManyAddresses(key: string) {
    // if youve exceeded the maxAccountsPerCurrency
    return (this.props.auth.accounts.filter(
        (account) => account.currency === key
    ).length >= this.state.maxAccounts.perCurrency) ||

    // or if you have exceeded one free address
    (this.props.auth.accounts.length >= this.state.maxAccounts.total);
  }

  private async handleCreatePayIDAccount(address: string) {
    let added = false;

    const user = address.split('$')[0];
    const domain = address.split('$')[1];

    const response = await fetch(`https://${domain}/${user}`, {
      headers: {
        'PayID-Version': '1.0',
        'Accept': 'application/payid+json',
      },
    })
    const responseBody: PayIDResponse = await response.json();
    if (responseBody && responseBody.addresses) {
      for (const index in responseBody.addresses) {

        let address = responseBody.addresses[index].addressDetails.address;

        if (!address) continue;
        
        let key = responseBody.addresses[index].paymentNetwork;

        if (key === 'XRPL') {
          key = 'XRP';
          // handle x-address https://github.com/xpring-eng/xpring-js#x-address-encoding
          address = codec.Decode(address)?.account || address;
        }

        if (!CURRENCIES[key as CURRENCY_SYMBOL]?.api) continue;

        if (this.userHasTooManyAddresses(key)) continue;
        
        const hasAccount = some(this.props.auth.accounts, (item) => item.address === address);
    
        if (hasAccount) {
          continue;
        }

        const account = await this.props.dispatch(createAccountOnDevice({ 
          currency: key as CURRENCY_SYMBOL, 
          address, 
          deviceId: this.props.auth.deviceId as string,
        }));
        await this.props.dispatch(addAccount(account));
        added = true;
      }
      if (added) {
        Alert.alert(i18n.t(auth.addAccount.success));
      } else {
        Alert.alert(i18n.t(auth.errors.noUnstoppableAddressesFound));
      }
    } else {
      Alert.alert(i18n.t(auth.errors.noUnstoppableAddressesFound));
    }
  }

  private async handleCreateFIOAccount(address: string) {
    let added = false;

    const namehash = stringToUint128Hash(address.toLowerCase());

    const response = await fetch(`https://fio.greymass.com/v1/chain/get_table_rows`, {
      method: 'post',
      body: JSON.stringify({
        "json":true,
        "code":"fio.address",
        "scope":"fio.address",
        "table":"fionames",
        "table_key":"",
        "lower_bound":namehash,
        "upper_bound":namehash,
        "index_position":5,
        "key_type":"i128",
        "limit":1,
        "reverse":false,
        "show_payer":false
      }),
    })
    const responseBody: FIOResponse = await response.json();
    if (responseBody && responseBody.rows) {
      for (const index in responseBody.rows) {

        if (responseBody.rows[index]?.addresses?.length) {
          for (const addressIndex in responseBody.rows[index].addresses) {
        
            let key = responseBody.rows[index].addresses[addressIndex].token_code;

            if (key === 'XRPL') key = 'XRP';

            if (!CURRENCIES[key as CURRENCY_SYMBOL]?.api) continue;

            if (this.userHasTooManyAddresses(key)) continue;

            const hasAccount = some(this.props.auth.accounts, (item) => item.address === address);
        
            if (hasAccount) {
              continue;
            }

            const account = await this.props.dispatch(createAccountOnDevice({ 
              currency: key as CURRENCY_SYMBOL, 
              address: responseBody.rows[index].addresses[addressIndex].public_address, 
              deviceId: this.props.auth.deviceId as string
            }));
            await this.props.dispatch(addAccount(account));
            added = true;
          }
        }
      }
      if (added) {
        Alert.alert(i18n.t(auth.addAccount.success));
      } else {
        Alert.alert(i18n.t(auth.errors.noUnstoppableAddressesFound));
      }
    } else {
      Alert.alert(i18n.t(auth.errors.noUnstoppableAddressesFound));
    }
  }

  setAddTokenToggleCheckBox (addToken: boolean) {
    this.setState({
      addToken
    })
  }

  setEthValidatorToggleCheckBox (isEthValidator: boolean) {
    this.setState({
      isEthValidator
    })
  }

  render () {
    const { address, addToken, tokenAddress, tokenDecimals, isEthValidator } = this.state;
    const { currency } = this.props.route.params;

    const RecipientRightIcons = (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.handlePaste}>
          <Image source={transactionIcons.paste} style={styles.inputIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleCameraIconPress}>
          <Image source={transactionIcons.camera} style={styles.inputIcon} />
        </TouchableOpacity>
      </View>
    );

    const TokenAddressRightIcons = (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.handleAddTokenPaste}>
          <Image source={transactionIcons.paste} style={styles.inputIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleAddTokenCameraIconPress}>
          <Image source={transactionIcons.camera} style={styles.inputIcon} />
        </TouchableOpacity>
      </View>
    );

    return (
      <Screen style={{backgroundColor:Colors.WHITE}}>
        <FullHeightView>
          <ScrollView>
            <TouchableOpacity style={{marginTop:5}} onPress={this.props.navigation.goBack}>
              <BText>{i18n.t(core.actions.back)}</BText>
            </TouchableOpacity>
            
            <View style={{ marginVertical: 20 }}>
              <BText theme={TextThemes.HEADER}>
                {i18n.t(auth.addAccount.createAccount)}
              </BText>
              
              <BText color={Colors.GREY}>
                {i18n.t(auth.addAccount.selectedCurrency)}
              </BText>
            </View>

            {currency === 'Unstoppable' &&
              <UnstoppableButton
              ></UnstoppableButton>
            } 
            {currency === 'PayID' &&
              <PayIDButton
              ></PayIDButton>
            } 
            {currency === 'FIO' &&
              <FIOButton
              ></FIOButton>
            } 
            {currency !== 'Unstoppable' && currency !== 'PayID' && currency !== 'FIO' && <Currency
              currency={currency}
              maxAccounts={this.state.maxAccounts.perCurrency}
              numberOfAccounts={this.props.auth.accounts.filter((account) => account.currency === currency).length}
            />}

            <View style={{marginTop:60}}>
              <BText>
                {i18n.t(auth.addAccount.address)}
              </BText>
            </View>

            <Input
              value={address}
              onChangeText={this.handleAddressChange}
            />

            <View style={styles.row}>
              <TouchableOpacity onPress={this.handleCameraIconPress} style={styles.row}>
                <Image source={transactionIcons.camera} style={styles.inputIcon} />
                <BText color={Colors.GREY} size={FontSizes.SMALL}>
                  Scan QR Code
                </BText>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handlePaste} style={styles.row}>
                <Image source={transactionIcons.paste} style={styles.inputIcon} />
                <BText color={Colors.GREY} size={FontSizes.SMALL}>
                  Paste Address
                </BText>
              </TouchableOpacity>
            </View>


            {currency === 'ETH' && (<>
              <View style={{flexDirection:'row', marginTop:60, marginLeft: 5}}>
                <CheckBox
                  disabled={false}
                  value={isEthValidator}
                  onValueChange={() => isEthValidator ? this.setEthValidatorToggleCheckBox(false) : this.setEthValidatorToggleCheckBox(true)}
                />
                <View style={{marginTop:10, marginLeft:10}}>
                  <TouchableOpacity onPress={() => isEthValidator ? this.setEthValidatorToggleCheckBox(false) : this.setEthValidatorToggleCheckBox(true)}>
                    <BText>
                      {i18n.t(auth.addAccount.isEthValidator)}
                    </BText>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{flexDirection:'row', marginTop:40, marginLeft: 5}}>
                <CheckBox
                  disabled={false}
                  value={addToken}
                  onValueChange={() => addToken ? this.setAddTokenToggleCheckBox(false) : this.setAddTokenToggleCheckBox(true)}
                />
                <View style={{marginTop:10, marginLeft:10}}>
                  <TouchableOpacity onPress={() => addToken ? this.setAddTokenToggleCheckBox(false) : this.setAddTokenToggleCheckBox(true)}>
                    <BText>
                      {i18n.t(auth.addAccount.addToken)}
                    </BText>
                  </TouchableOpacity>
                </View>
              </View>
            </>)}

            {currency === 'SIGNA' && (<>
              <View style={{flexDirection:'row', marginTop:40, marginLeft: 5}}>
                <CheckBox
                  disabled={false}
                  value={addToken}
                  onValueChange={() => addToken ? this.setAddTokenToggleCheckBox(false) : this.setAddTokenToggleCheckBox(true)}
                />
                <View style={{marginTop:10, marginLeft:10}}>
                  <TouchableOpacity onPress={() => addToken ? this.setAddTokenToggleCheckBox(false) : this.setAddTokenToggleCheckBox(true)}>
                    <BText>
                      {i18n.t(auth.addAccount.addToken)}
                    </BText>
                  </TouchableOpacity>
                </View>
              </View>
            </>)}

            {addToken && (
              <>
                <View style={{marginTop:40}}>
                  <BText>
                    {i18n.t(auth.addAccount.tokenAddress)}
                  </BText>
                </View>
                <Input
                  value={tokenAddress}
                  onChangeText={this.handleTokenAddressChange}
                  rightIcons={TokenAddressRightIcons}
                />
                {currency === 'ETH' && (<View style={{marginTop:10}}>
                  <BText>
                    {i18n.t(auth.addAccount.tokenDecimals)}
                  </BText>
                  <View>
                    <Input
                      value={tokenDecimals}
                      onChangeText={this.handleTokenDecimalsChange}
                      keyboardType={KeyboardTypes.NUMERIC}
                      />
                  </View>
                </View>)}
              </>
            )}

            <Button disabled={!this.isSubmitEnabled()} onPress={this.handleCreateAccount}>
              {i18n.t(auth.addAccount.createAccount)}
            </Button>

            {this.state.loading && <ActivityIndicator size="large" color="#ffffff" />}

          </ScrollView>
        </FullHeightView>
      </Screen>
    );
  }
}

function stringToUint128Hash(message: string){
  const hash = sha1(message);
  const i28 = hash.substr(0, hash.length - 8);
  return `0x${convertHexEndianess(i28)}`;
}

function mapStateToProps (state: ApplicationState) {
  return {
    auth: state.auth,
    inAppPurchaseApi: state.inAppPurchaseApi
  };
}

export const AddAccountScreenTwo = connect(mapStateToProps)(AddAccountTwo);
