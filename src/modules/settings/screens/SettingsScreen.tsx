import { translations } from 'i18n-js';
import React from 'react';
import { Modal, SafeAreaView, StyleSheet, View, Image, Linking, ScrollView, TouchableOpacity } from 'react-native';
import VersionNumber from 'react-native-version-number';
import { connect } from 'react-redux';
import { Button, ButtonThemes } from '../../../core/components/base/Button';
import { Text, TextThemes } from '../../../core/components/base/Text';
import { HeaderTitle } from '../../../core/components/header/HeaderTitle';
import { i18n } from '../../../core/i18n';
import { InjectedReduxProps } from '../../../core/interfaces';
import { FullHeightView } from '../../../core/layout/FullHeightView';
import { Screen } from '../../../core/layout/Screen';
import { routes } from '../../../core/navigation/routes';
import { AppReduxState } from '../../../core/store/app/reducer';
import { ApplicationState } from '../../../core/store/initialState';
import { Colors } from '../../../core/theme/colors';
import { FontSizes, Sizes } from '../../../core/theme/sizes';
import { resetAuthState } from '../../auth/store/actions';
import { saveLanguage } from '../../../core/store/app/actions';
import { AuthReduxState } from '../../auth/store/reducer';
import { settings } from '../translations';
import { titleImages } from '../../../assets/images';
import { RootStackParamList } from '../../../core/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { BSelect } from '../../../core/components/base/BSelect';
import RNRestart from "react-native-restart";
import { loadPurchasesFromServer, restorePurchses } from '../../iap/store/actions';
import { SUBS_ENABLED } from '../../../../../shared/constants';
import { isIOS } from '../../../core/utils/platform';

type SettingsScreenNavProp = StackNavigationProp<
  RootStackParamList,
  'Settings'
>;

interface IProps extends InjectedReduxProps {
  auth: AuthReduxState;
  app: AppReduxState;
  navigation: SettingsScreenNavProp;
}
type Props = IProps;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  hintView: {
    paddingTop: Sizes.SMALL,
    flexGrow: 1
  },
  bodyText: {
    padding: 10
  },
  flexBottom: {
    flex: 1,
    alignItems: 'center',
    marginBottom:20
  },
  title: {
    marginBottom: 40
  },
  row: {
    flexDirection: 'row',
    minHeight: 50,
    borderBottomWidth:1,
    borderBottomColor: Colors.GREY_LIGHT,
    alignItems:'center'
  },
  col1: {

  },
  col2: { 
    flex: 1, 
    alignItems: 'flex-end' 
  }
});
class Settings extends React.PureComponent<Props> {

  state = {
    erasePromptVisible: false,
    selectedLanguage: false,
    appMustRestart: false
  };

  static navigationOptions = {
    headerTitle: <HeaderTitle>{i18n.t(settings?.screens.settings.title)}</HeaderTitle>
  };

  toggleConfirmDeletePrompt = () => {
    this.setState({ erasePromptVisible: !this.state.erasePromptVisible });
  }

  confirmErase = () => {
    this.props.dispatch(resetAuthState());
    this.props.navigation.navigate(routes.home);
    this.toggleConfirmDeletePrompt();
  }

  handleLanguageChange = (language: string) => {
    i18n.locale = language;
    this.setState({
      selectedLanguage: language,
      appMustRestart: true
    })
    this.props.dispatch(saveLanguage(language));
    this.forceUpdate();
  }

  getLocales = () => {
    return Object.keys(translations).map((locale) => {
      return {
        value: locale,
        label: locale
      };
    });
  }

  restoreSubscription = () => {
    this.props.dispatch(restorePurchses());
  }

  restartNow = () => {
    RNRestart.Restart();
  }

  render () {
    const manageSubURL = isIOS ? 'itms-apps://apps.apple.com/account/subscriptions' : 'https://play.google.com/store/account/subscriptions';
    return (
      <Screen style={{backgroundColor:Colors.WHITE}}>
        <FullHeightView>
          <ScrollView>
          <Text theme={TextThemes.HEADER}>{i18n.t(settings.screens.settings.title)}</Text>

          <View style={[styles.row, { marginTop: 40 }]}>
            <Text bold color={Colors.GREY_DARK} size={FontSizes.MEDIUM}>{i18n.t(settings.screens.settings.general)}</Text>
          </View>
            <View style={styles.row}>
              <View style={{width:'100%'}}>
                {/* <Text color={Colors.GREY_DARK} size={FontSizes.SMALL}>{i18n.t(settings.screens.settings.changeLanguage)}</Text> */}

                <BSelect
                  style={{}}
                  value={this.state.selectedLanguage || i18n.t(settings.screens.settings.changeLanguage)}
                  items={this.getLocales()}
                  onChange={this.handleLanguageChange}
                  placeholder={i18n.t(settings.screens.settings.changeLanguage)}
                />
              </View>
            </View>

            {this.state.appMustRestart && 
              <View style={styles.row}>
                <View style={styles.col1}>
                  <Text color={Colors.GREEN} size={FontSizes.SMALL}>{i18n.t(settings.screens.settings.appMustRestart)}</Text>
                </View>
                <View style={styles.col2}>
                  <TouchableOpacity onPress={this.restartNow}>
                    <Text color={Colors.GREY_DARK} size={FontSizes.MEDIUM}>{i18n.t(settings.screens.settings.restartNow)}</Text>
                  </TouchableOpacity>
                </View>
              </View>}

            <View style={[styles.row, { marginTop: 40 }]}>
              <Text bold color={Colors.GREY_DARK} size={FontSizes.MEDIUM}>
                {i18n.t(settings.screens.settings.about)}
              </Text>
            </View>

            <View style={[styles.row]}>
              <View style={styles.col1}>
                <TouchableOpacity onPress={() => {
                    Linking.openURL('https://block-monitor.com/privacy.html');
                }}>
                  <Text color={Colors.GREY_DARK} size={FontSizes.SMALL}>
                  {i18n.t(settings.screens.settings.privacy)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={[styles.row]}>
              <View style={styles.col1}>
                <TouchableOpacity onPress={() => {
                    Linking.openURL('https://block-monitor.com/terms.html');
                }}>
                  <Text color={Colors.GREY_DARK} size={FontSizes.SMALL}>
                  {i18n.t(settings.screens.settings.terms)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.row]}>
              <View style={styles.col1}>
                <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate(routes.credits);
                }}>
                  <Text color={Colors.GREY_DARK} size={FontSizes.SMALL}>
                  {i18n.t(settings.screens.settings.attributions)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>


            {SUBS_ENABLED && <View style={[styles.row]}>
              <View style={styles.col1}>
                <TouchableOpacity onPress={() => {
                  Linking.openURL(manageSubURL);
                }}>
                  <Text color={Colors.GREY_DARK} size={FontSizes.SMALL}>
                  {i18n.t(settings.screens.settings.manageSubscription)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>}

            {SUBS_ENABLED && <View style={[styles.row]}>
              <View style={styles.col1}>
                <TouchableOpacity onPress={this.restoreSubscription}>
                  <Text color={Colors.GREY_DARK} size={FontSizes.SMALL}>
                  {i18n.t(settings.screens.settings.restoreSubscription)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>}

            <View style={{marginTop:40}}>
              <Text bold color={Colors.GREY_DARK} size={FontSizes.MEDIUM}>
                {i18n.t(settings.screens.settings.getSupport)}
              </Text>
            </View>

            <View style={[styles.row]}>
              <View style={styles.col1}>
                <Text color={Colors.GREY_DARK} size={FontSizes.SMALL}>
                  Twitter
                </Text>
              </View>
              <View style={styles.col2}>
                <TouchableOpacity onPress={() => {
                  Linking.openURL('https://twitter.com/BlockMonitorApp');
                }}>
                  <Text color={Colors.BLUE} size={FontSizes.SMALL}>
                    @BlockMonitorApp
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.row]}>
              <View style={styles.col1}>
                <TouchableOpacity onPress={() => {
                    Linking.openURL('https://discord.gg/GAqNByfqZ3');
                  }}>
                  <Text color={Colors.GREY_DARK} size={FontSizes.SMALL}>
                    Discord
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            

            <View style={[styles.row, { marginBottom: 40 }]}>
              <View style={styles.col1}>
                <TouchableOpacity onPress={() => {
                    Linking.openURL('https://t.me/ExampLLC');
                  }}>
                  <Text color={Colors.GREY_DARK} size={FontSizes.SMALL}>
                    Telegram
                  </Text>
                </TouchableOpacity>
              </View>
            </View>


            <View style={[styles.row, { marginBottom: 40 }]}>
              <View style={styles.col1}>
                <TouchableOpacity onPress={this.toggleConfirmDeletePrompt}>
                  <Text color={Colors.RED} size={FontSizes.SMALL}>
                    {i18n.t(settings.screens.settings.erase)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.flexBottom, styles.bodyText]}>
              <Text color={Colors.GREY} size={FontSizes.XSMALL}>
                Block Monitor {VersionNumber.appVersion} ({VersionNumber.buildVersion})
              </Text>
              <Text color={Colors.GREY} size={FontSizes.XSMALL}>
                {i18n.t(settings.screens.settings.copyright)}
              </Text>
            </View>

            <Modal
              animationType='slide'
              transparent={false}
              visible={this.state.erasePromptVisible}
              // tslint:disable-next-line: jsx-no-lambda
              onRequestClose={() => {
                // Alert.alert('Modal has been closed.');
              }}
            >
              <SafeAreaView>

                <View>
                  <View style={styles.bodyText}>
                    <Text>{i18n.t(settings.screens.settings.confirmReset)}</Text>

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
          </ScrollView>
        </FullHeightView>
      </Screen>
    );
  }
}

function mapStateToProps (state: ApplicationState) {
  return {
    auth: state.auth
  };
}

export const SettingsScreen = connect(mapStateToProps)(Settings);
