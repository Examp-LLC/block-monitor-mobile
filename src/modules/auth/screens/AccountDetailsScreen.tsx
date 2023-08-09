import React from 'react';
import { Alert, Clipboard, Image, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { actionIcons } from '../../../assets/icons';
import { Button as BButton, ButtonSizes, ButtonThemes } from '../../../core/components/base/Button';
import { HeaderTitle } from '../../../core/components/header/HeaderTitle';
import { i18n } from '../../../core/i18n';
import { InjectedReduxProps, Account, Transaction } from '../../../core/interfaces';
import { FullHeightView } from '../../../core/layout/FullHeightView';
import { Screen } from '../../../core/layout/Screen';
import { ApplicationState } from '../../../core/store/initialState';
import { Colors } from '../../../core/theme/colors';
import { isIOS } from '../../../core/utils/platform';
import { PriceInfoReduxState } from '../../price-api/store/reducer';
import { AccountDetailsList } from '../components/details/AccountDetailsList';
import { auth } from '../translations';
import { Sizes } from '../../../core/theme/sizes';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Props extends InjectedReduxProps {
  accounts: Account[];
  priceApi: PriceInfoReduxState;
}

type TProps = Props;

const styles = StyleSheet.create({
  copyIcon: {
    margin: 5,
    width: 25,
    height: 25
  }
});

class AccountDetails extends React.PureComponent<TProps> {

  static navigationOptions = ({ navigation }: any) => {
    const { params = {} } = navigation.state;

    const handleCopy = () => {
      Clipboard.setString(params.address);
      Alert.alert(i18n.t(auth.accountDetails.copiedSuccessfully));
    };

    return {
      headerTitle: (
        <HeaderTitle>
          {params.address}
        </HeaderTitle>

      ),

      // This makes no sense because BButton _is_ a TouchableOpacity, but it works
      headerRight: isIOS ?
        (
          <TouchableOpacity onPress={handleCopy}>
            <Image style={styles.copyIcon} source={actionIcons.copy} />
          </TouchableOpacity>
        ) :
        (
          <BButton theme={ButtonThemes.ACCENT} size={ButtonSizes.SMALL} onPress={handleCopy}>
            <Image style={styles.copyIcon} source={actionIcons.copy} />
          </BButton>
        )
    };
  }

  componentDidMount () {
    this.updateTransactions();
  }

  getAccount = () => {
    const route = useRoute();
    // @ts-ignore
    const address = route.params?.address;
    
    return this.props.accounts.find((acc) => acc.address === address);
  }

  updateTransactions = () => {
    const account = this.getAccount();
    if (account) {
      // this.props.dispatch(updateAccountTransactions(account));
    }
  }

  handleTransactionPress = (transaction: Transaction) => {
    // TODO: do something?
    // tslint:disable-next-line
    console.log(transaction);
  }

  render () {
    const { priceApi } = this.props;
    const account = this.getAccount();
    if (!account) {
      return null;
    }

    return (
      <Screen style={{ backgroundColor: Colors.BLUE_DARK }}>
        <FullHeightView withoutPaddings>
          <View>
            <AccountDetailsList
                account={account}
                onTransactionPress={this.handleTransactionPress}
                priceApi={priceApi}
            />
          </View>
        </FullHeightView>
      </Screen>
    );
  }
}

function mapStateToProps (state: ApplicationState) {
  return {
    accounts: state.auth.accounts,
    priceApi: state.priceApi
  };
}

export const AccountDetailsScreen = connect(mapStateToProps)(AccountDetails);
