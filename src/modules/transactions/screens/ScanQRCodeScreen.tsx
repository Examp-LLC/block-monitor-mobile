import React from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import { isBurstAddress } from '@burstjs/util';
import QRCodeScanner, { Event } from 'react-native-qrcode-scanner';
import { connect } from 'react-redux';
import { i18n } from '../../../core/i18n';
import { routes } from '../../../core/navigation/routes';
import { Colors } from '../../../core/theme/colors';
import { transactions } from '../translations';
import { AuthReduxState } from '../../auth/store/reducer';
import { CURRENCY_SYMBOL } from '../../../../../shared/constants';
import { InjectedReduxProps } from '../../../core/interfaces';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../core/navigation/RootStackParamList';
import { StackNavigationProp, HeaderTitle } from '@react-navigation/stack';
import { Screen } from '../../../core/layout/Screen';
import { FullHeightView } from '../../../core/layout/FullHeightView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { core } from '../../../core/translations';
import { Text as BText, TextThemes } from '../../../core/components/base/Text';
import { titleImages } from '../../../assets/images';
import { FontSizes, Sizes } from '../../../core/theme/sizes';

type ScanRouteProp = RouteProp<RootStackParamList, 'Scan'>;
type AddAccountNavProp = StackNavigationProp<RootStackParamList, 'addAccountStepTwo'>;

interface IProps extends InjectedReduxProps {
  auth: AuthReduxState;
  currency: CURRENCY_SYMBOL | 'Unstoppable';
  route: ScanRouteProp;
  navigation: AddAccountNavProp;
}
type Props = IProps;

class ScanQRCodeScreenComponent extends React.PureComponent<Props> {

  onSuccess = (e: Event) => {
    const { currency, token } = this.props.route.params;
    const address = e.data;
    this.props.navigation.navigate(routes.addAccountStepTwo, {
      address,
      currency,
      token
    });
  }

  render () {
    return (
      <Screen style={{backgroundColor:Colors.WHITE}}>
        <FullHeightView withoutPaddings>
          <View style={{flexDirection:'row', padding: 20}}>
            <TouchableOpacity style={{marginTop:5}} onPress={this.props.navigation.goBack}>
              <BText>{i18n.t(core.actions.back)}</BText>
            </TouchableOpacity>
          </View>

          <View style={{marginTop:40, marginBottom:10, marginHorizontal: 20}}>
            <BText size={FontSizes.MEDIUM} theme={TextThemes.HEADER}>
              {i18n.t(transactions.screens.scan.title)}
            </BText>
          </View>
          <QRCodeScanner
            onRead={this.onSuccess}
          />
        </FullHeightView>
      </Screen>
    );
  }
}

function mapStateToProps () {
  return {};
}

export const ScanQRCodeScreen = connect(mapStateToProps)(ScanQRCodeScreenComponent);
