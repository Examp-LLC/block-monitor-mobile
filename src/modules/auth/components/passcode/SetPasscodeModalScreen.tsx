import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { Button } from '../../../../core/components/base/Button';
import { Text, TextAlign, TextThemes } from '../../../../core/components/base/Text';
import { NumericKeyboard } from '../../../../core/components/keyboards/numeric/NumericKeyboard';
import { i18n } from '../../../../core/i18n';
import { InjectedReduxProps } from '../../../../core/interfaces';
import { FullHeightView } from '../../../../core/layout/FullHeightView';
import { Screen } from '../../../../core/layout/Screen';
import { AppReduxState } from '../../../../core/store/app/reducer';
import { ApplicationState } from '../../../../core/store/initialState';
import { Colors } from '../../../../core/theme/colors';
import { Sizes } from '../../../../core/theme/sizes';
import { core } from '../../../../core/translations';
import { PASSCODE_LENGTH } from '../../consts';
import { setPasscode } from '../../store/actions';
import { AuthReduxState } from '../../store/reducer';
import { auth } from '../../translations';
import { logos } from '../../../../assets/images';
import { SafeAreaView } from 'react-native-safe-area-context';

interface InjectedProps extends InjectedReduxProps {
  app: AppReduxState,
  auth: AuthReduxState
}

interface OwnProps {
  onSuccess: () => void;
  onCancel: () => void;
}

type Props = OwnProps & InjectedProps;

interface State {
  code: string;
  savedCode: string;
  hasError: boolean;
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
    marginTop: 50
  }
});

class SetPasscodeModal extends React.PureComponent<Props, State> {
  state = {
    code: '',
    savedCode: '',
    hasError: false
  };

  handleNumberPress = (value: string) => {
    const { code, savedCode } = this.state;
    const newCode = code + value;

    this.setState({ hasError: false }, async () => {
      if (newCode.length === PASSCODE_LENGTH) {
        if (savedCode) {
          if (newCode === savedCode) {
            await this.props.dispatch(setPasscode(savedCode));
            this.setState({
              code: '',
              savedCode: ''
            });
            this.props.onSuccess();
          } else {
            this.setState({
              code: '',
              hasError: true
            });
          }
        } else {
          this.setState({
            code: '',
            savedCode: newCode
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

  render () {
    const { hasError, savedCode } = this.state;
    const hint = !savedCode
      ? i18n.t(auth.setPasscodeModal.passcodeHint)
      : i18n.t(auth.setPasscodeModal.enterAgain);
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
                    {hint}
                </Text>
                {hasError && (
                  <Text theme={TextThemes.HINT} textAlign={TextAlign.CENTER} color={Colors.WHITE}>
                    {i18n.t(auth.errors.incorrectPasscode)}
                  </Text>
                )}
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
              />
            </View>
          </SafeAreaView>
        </FullHeightView>
      </Screen>
    );
  }
}

function mapStateToProps (state: ApplicationState) {
  return {
    app: state.app,
    auth: state.auth
  };
}

export const SetPasscodeModalScreen = connect(mapStateToProps)(SetPasscodeModal);
