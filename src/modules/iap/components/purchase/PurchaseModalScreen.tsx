import React from 'react';
import { Image, Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Button, ButtonThemes, ButtonSizes } from '../../../../core/components/base/Button';
import { Text, TextAlign, TextThemes } from '../../../../core/components/base/Text';
import { FullHeightView } from '../../../../core/layout/FullHeightView';
import { Screen } from '../../../../core/layout/Screen';
import { Colors } from '../../../../core/theme/colors';
import { FontSizes, Sizes } from '../../../../core/theme/sizes';
import { logos } from '../../../../assets/images';
import { IAP_TIERS } from './PurchaseModal';
import { CURRENCIES } from '../../../../../../shared/constants';
import { ScrollView } from 'react-native-gesture-handler';
import { Subscription } from 'react-native-iap';
import { auth } from '../../../auth/translations';
import { i18n } from '../../../../core/i18n';
import { Input } from '../../../../core/components/base/Input';
import { isIOS } from '../../../../core/utils/platform';

interface Props {
  onPurchase: (purchaseType: IAP_TIERS) => void;
  onSubmitPromoCode: (promoCode: string) => void;
  goBack: () => void;
  subs: Subscription[];
}

interface State {
  showPromoCodeInput: boolean;
  promoCode: string;
  promoCodeIsValid: boolean;
  promoCodeIsDirty: boolean;
}

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    backgroundColor: Colors.WHITE
  },
  header: {
    textAlign: 'center',
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'flex-end'
  },
  keyboard: {
    flex: 2,
    justifyContent: 'center'
  },
  hint: {
    marginBottom: Sizes.MEDIUM
  },
  bodyText: {
    padding: 10
  },
  logo: {
    width: 200,
    height: 53,
    marginBottom: 20,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  footer: {
    marginBottom: 20
  }
});

export class PurchaseModalScreen extends React.PureComponent<Props, State> {
  state = {
    showPromoCodeInput: false,
    promoCode: '',
    promoCodeIsValid: false,
    promoCodeIsDirty: false
  };

  getPrice(id: string) {
    return this.props.subs.find(({ productId }) => productId === id)?.localizedPrice || '';
  }

  handlePurchase(purchaseType: IAP_TIERS) {
    this.props.onPurchase(purchaseType);
  }

  getMaxAccounts(max: number, total: number) {
    return (max * total).toString();
  }


  handlePromoCodeChange = (promoCode: string) => {
    let promoCodeIsValid = false;
    if (promoCode.length === 24) {
      promoCodeIsValid = true;
    }
    const promoCodeIsDirty = promoCode.length > 0;

    this.setState({
      promoCode,
      promoCodeIsValid,
      promoCodeIsDirty
    });
  }

  render() {
    const totalCurrencies = Object.keys(CURRENCIES).length;
    const maxAccountsPerCurrency = [1, 3, 5];

    return (
      <Screen style={styles.view}>
        <ScrollView style={{ width: '100%' }}>
          <FullHeightView withoutPaddings style={{ paddingHorizontal: 15 }}>
            <SafeAreaView>
              <View style={styles.header}>
                <Image source={logos.splash} style={styles.logo} />

              </View>
              <View>

                <Text color={Colors.GREY_DARK} textAlign={TextAlign.CENTER} theme={TextThemes.HEADER}>
                  Block Monitor Pro
                </Text>
                <View style={styles.hint}>
                  <Text color={Colors.GREY_DARK} textAlign={TextAlign.CENTER}>
                    {i18n.t(auth.purchase.tryFree)}
                  </Text>
                </View>
                {/* <View style={{ display: 'flex', flexDirection: 'row' }} >
                  <View style={{ flex: 1, justifyContent: 'flex-start' }} >
                    <Text color={Colors.GREY}>
                      {i18n.t(auth.purchase.watchUpTo, {
                        max: this.getMaxAccounts(maxAccountsPerCurrency[0], totalCurrencies)
                      })}
                    </Text>

                    <Text color={Colors.GREY} theme={TextThemes.HINT}>
                      {i18n.t(auth.purchase.equation, {
                        max: maxAccountsPerCurrency[0],
                        total: totalCurrencies
                      })}
                    </Text>
                  </View>
                </View> */}
                <Button onPress={() => {
                  this.handlePurchase(IAP_TIERS.hobbyistOneMonth)
                }}>
                  {i18n.t(auth.purchase.monthly, {
                    price: this.getPrice('com.blockmon.app.hobbyist.1')
                  })}
                </Button>
                <Text color={Colors.GREY} textAlign={TextAlign.CENTER} theme={TextThemes.HINT}>{i18n.t(auth.purchase.hint1)}</Text>

                <Button onPress={() => {
                  this.handlePurchase(IAP_TIERS.hobbyistSixMonths)
                }}>
                  {i18n.t(auth.purchase.sixMonths, {
                    price: this.getPrice('com.blockmon.app.hobbyist.6')
                  })}
                </Button>
                <Text color={Colors.GREY} textAlign={TextAlign.CENTER} theme={TextThemes.HINT}>{i18n.t(auth.purchase.hint2)}</Text>

                <Button onPress={() => {
                  this.handlePurchase(IAP_TIERS.hobbyistOneMonth)
                }}>
                  {i18n.t(auth.purchase.yearly, {
                    price: this.getPrice('com.blockmon.app.hobbyist.12')
                  })}
                </Button>
                <Text color={Colors.GREY} textAlign={TextAlign.CENTER} theme={TextThemes.HINT}>{i18n.t(auth.purchase.hint3)}</Text>

              </View>

              <View style={{ marginTop: 30 }}>
                <TouchableOpacity onPress={() => {
                  this.setState({
                    showPromoCodeInput: !this.state.showPromoCodeInput
                  })
                }}>
                  <Text color={Colors.GREY} textAlign={TextAlign.CENTER} size={FontSizes.SMALL} underline theme={TextThemes.HINT}>
                    {i18n.t(auth.purchase.havePromoCode)}
                  </Text>
                </TouchableOpacity>
              </View>

              {this.state.showPromoCodeInput &&
                (<KeyboardAvoidingView
                  behavior={isIOS ? "padding" : "height"}>
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}><View>
                    <Input
                      value={this.state.promoCode}
                      onChangeText={this.handlePromoCodeChange}
                    />
                    <Button theme={ButtonThemes.ACCENT} onPress={() => {
                      this.props.onSubmitPromoCode(this.state.promoCode);
                    }}>
                      {i18n.t(auth.purchase.go)}
                    </Button>
                  </View></TouchableWithoutFeedback></KeyboardAvoidingView>)}

              <Text color={Colors.WHITE} size={FontSizes.MEDIUM} theme={TextThemes.HEADER}>
                {i18n.t(auth.purchase.notReadyYet)}
              </Text>
              <Button theme={ButtonThemes.ACCENT} onPress={() => {
                this.props.goBack();
              }}>
                {i18n.t(auth.purchase.goBack)}
              </Button>

            </SafeAreaView>
          </FullHeightView>
        </ScrollView>
      </Screen>
    );
  }
}
