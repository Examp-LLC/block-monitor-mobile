import React from 'react';
import { Image, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, ButtonThemes } from '../../../../core/components/base/Button';
import { Text, TextAlign, TextThemes } from '../../../../core/components/base/Text';
import { NumericKeyboard } from '../../../../core/components/keyboards/numeric/NumericKeyboard';
import { i18n } from '../../../../core/i18n';
import { FullHeightView } from '../../../../core/layout/FullHeightView';
import { Screen } from '../../../../core/layout/Screen';
import { Colors } from '../../../../core/theme/colors';
import { Sizes } from '../../../../core/theme/sizes';
import { authWithTouchId, isTouchIDSupported } from '../../../../core/utils/keychain';
import { settings } from '../../../settings/translations';
import { PASSCODE_LENGTH } from '../../consts';
import { auth } from '../../translations';
import { logos } from '../../../../assets/images';

interface Props {
  passcode: string;
  onSuccess: () => void;
  onCancel: () => void;
  onReset?: () => void;
}

interface State {
  code: string;
  hasError: boolean;
  hasTouchID: boolean;
  erasePromptVisible: boolean;
}

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    backgroundColor: Colors.WHITE
  },
  header: {
    alignItems: 'center',
    height: 80,
    flex: 1,
    marginHorizontal: 20,
    minWidth: 400
  },
  keyboard: {
    flex: 2,
    justifyContent: 'center'
  },
  subheader: {
    marginBottom: Sizes.LARGE,
    marginHorizontal: Sizes.LARGE
  },
  bodyText: {
    padding: 10
  },
  footer: {
    marginBottom: 20
  },
  digit: {
    textAlign: 'center',
    backgroundColor:Colors.GREY_LIGHT,
    width: 50,
    height: 50,
    alignContent: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  digits: {
    textAlign: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: Sizes.LARGE
  },
  logo: {
    width: 90,
    height: 105,
    marginTop: 70
  }
});

const touchIDReason = ' ';

export class EnterPasscodeModalScreen extends React.PureComponent<Props, State> {
  state = {
    code: '',
    hasError: false,
    hasTouchID: false,
    erasePromptVisible: false
  };

  async componentDidMount () {
    this.handleTouchID();
    const hasTouchID = await isTouchIDSupported();
    this.setState({ hasTouchID });
  }

  handleNumberPress = (value: string) => {
    const { code } = this.state;
    const { passcode, onSuccess } = this.props;

    const newCode = code + value;

    this.setState({ hasError: false }, async () => {
      if (newCode.length === PASSCODE_LENGTH) {
        if (newCode === passcode) {
          onSuccess();
          this.setState({
            code: ''
          });
        } else {
          this.setState({
            code: '',
            hasError: true
          });
        }
      } else {
        this.setState({
          code: newCode
        });
      }
    });
  }

  handleDelPress = () => {
    const { code } = this.state;

    if (code.length > 0) {
      this.setState({
        code: code.substr(0, code.length - 1)
      });
    }
  }

  handleTouchID = () => {
    authWithTouchId(touchIDReason).then((value) => {
      if (value === true) {
        this.props.onSuccess();
      }
    });
  }

  confirmErase = () => {
    const { onReset } = this.props;
    onReset && onReset();
    this.toggleConfirmDeletePrompt();
  }

  toggleConfirmDeletePrompt = () => {
    this.setState({ erasePromptVisible: !this.state.erasePromptVisible });
  }

  render () {
    const { hasError, hasTouchID } = this.state;
    const { onReset } = this.props;
    const digits = new Array(4).fill('');

    return (
      <Screen style={styles.view}>
        <FullHeightView>
         <SafeAreaView>
            <View style={styles.header}>
              <Image source={logos.splash} style={styles.logo} />
            </View>
            <View style={styles.subheader}>
              <Text theme={TextThemes.HEADER} textAlign={TextAlign.CENTER} color={Colors.GREY_DARK}>
                {i18n.t(auth.enterPasscodeModal.welcomeBack)}
              </Text>
              <Text theme={TextThemes.HINT} textAlign={TextAlign.CENTER} color={hasError && Colors.RED || Colors.GREY_DARK}>
                {hasError && i18n.t(auth.errors.incorrectPasscode) || i18n.t(auth.enterPasscodeModal.passcodeHint)}
              </Text>
            </View>
              
            <View style={styles.digits}>
              {digits.map((digit, i) => {
                return (
                  <View key={i} style={styles.digit}>
                    <Text
                      theme={TextThemes.HEADER}
                      color={Colors.BLACK}
                      textAlign={TextAlign.CENTER}
                      >
                        {this.state.code[i] && '•'}
                    </Text>
                  </View>
                )
              })}
            </View>
              
            <View style={styles.keyboard}>
              <NumericKeyboard
                onDelPress={this.handleDelPress}
                onPress={this.handleNumberPress}
                onTouchID={hasTouchID ? this.handleTouchID : undefined}
                touchIDReason={hasTouchID ? touchIDReason : undefined}
              />
            </View>
            {onReset && <View style={styles.footer}>
              <TouchableOpacity onPress={this.toggleConfirmDeletePrompt}>
                <Text theme={TextThemes.HINT} textAlign={TextAlign.CENTER} color={Colors.WHITE}>
                  {i18n.t(auth.enterPasscodeModal.forgotPin)}
                </Text>
              </TouchableOpacity>
            </View>}

            <Modal
              animationType='slide'
              transparent={false}
              visible={this.state.erasePromptVisible}
            >
              <SafeAreaView>
                <View>
                  <View style={styles.bodyText}>
                    <Text>{i18n.t(auth.enterPasscodeModal.confirmReset)}</Text>

                    <Button theme={ButtonThemes.ACCENT} onPress={this.toggleConfirmDeletePrompt}>
                      {i18n.t(settings.screens.settings.cancel)}
                    </Button>

                    <Button onPress={this.confirmErase}>
                      {i18n.t(settings.screens.settings.confirmErase)}
                    </Button>
                  </View>
                </View>
              </SafeAreaView>
            </Modal>
          </SafeAreaView>
        </FullHeightView>
      </Screen>
    );
  }
}
