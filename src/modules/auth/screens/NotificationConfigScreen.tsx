import React from 'react';
import { Image, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from '../../../core/components/base/Button';
import { Screen } from '../../../core/layout/Screen';
import { Colors } from '../../../core/theme/colors';
import { Text as BText, TextThemes } from '../../../core/components/base/Text';
import { DEFAULT_TRIGGER, TRIGGERS } from '../../../../../shared/constants';
import { i18n } from '../../../core/i18n';
import { ListSeparator } from '../../../core/components/base/ListSeparator';
import { formImages, titleImages } from '../../../assets/images';
import { auth } from '../translations';
import { core } from '../../../core/translations';
import { RootStackParamList } from '../../../core/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { InjectedReduxProps } from '../../../core/interfaces';
import { connect } from 'react-redux';
import { RouteProp } from '@react-navigation/core';
import { FullHeightView } from '../../../core/layout/FullHeightView';
import { setTrigger } from '../store/actions';
import { AuthReduxState } from '../store/reducer';
import { ApplicationState } from '../../../core/store/initialState';
import { FontSizes } from '../../../core/theme/sizes';

type NotificationConfigScreenNavProp = StackNavigationProp<
  RootStackParamList,
  'NotificationConfig'
>;

type NotificationConfigRouteProp = RouteProp<RootStackParamList, 'NotificationConfig'>;

interface IProps extends InjectedReduxProps {
  navigation: NotificationConfigScreenNavProp;
  route: NotificationConfigRouteProp;
  auth: AuthReduxState;
}

type Props = IProps;

const styles = StyleSheet.create({
  list: { 
    borderColor: Colors.GREY_LIGHT, 
    borderBottomWidth: 1, 
    paddingLeft: 20, 
    paddingRight: 20, 
    paddingTop: 10, 
    paddingBottom: 20 
  }
});

interface NotificationConfigState {
  selectedTrigger: TRIGGERS;
}

class NotificationConfigComponent extends React.PureComponent<Props, NotificationConfigState> {


  getDefaultState = () => {

    let { id } = this.props.route.params;
    let account = this.props.auth.accounts.find((account) => account.id === id);
    let trigger = account?.trigger || DEFAULT_TRIGGER;

    if (isNaN(trigger)) trigger = DEFAULT_TRIGGER; // default to both = 2 

    return {
      selectedTrigger: trigger
    }
  }

  state = this.getDefaultState();

  constructor(props: Props) {
    super(props);
  }

  handleConfirm = () => {
    this.props.dispatch(
      setTrigger( {
        trigger: this.state.selectedTrigger, 
        id: this.props.route.params.id
      })
    );
  }

  keyExtractor = (_option: string, index: number) => {
    return index.toString();
  }

  onOptionPress = (selectedTrigger: TRIGGERS) => {
    this.setState({ selectedTrigger })
  }

  getRadioIcon = (trigger: TRIGGERS) => {
    const { selectedTrigger } = this.state;
    return trigger === selectedTrigger ? formImages.radioOn : formImages.radioOff
  }

  getOptionText = (index: string) => {
    switch (Number(index)) {
      case 0:
        return auth.notificationConfig.option0;
      case 1:
        return auth.notificationConfig.option1;
      case 2:
        return auth.notificationConfig.option2;
      case 3:
        return auth.notificationConfig.option3;
    }
  }

  renderOption = ({ item }: ListRenderItemInfo<string>) => {

    return (
      <TouchableOpacity onPress={() => {
        this.onOptionPress(parseFloat(item))
      }}
      style={styles.list}>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>

          <View style={{ flex: 1 }}>
            <BText>
              {i18n.t(this.getOptionText(item) as string)}
            </BText>
          </View>
          <View style={{ alignSelf: 'center' }}>
            <Image source={this.getRadioIcon(parseFloat(item))} style={{ marginRight: 10 }} />
          </View>
      </View>
      </TouchableOpacity>

    );
  }

  render() {
    // fuckin enums are double size
    const data = Object.values(TRIGGERS).filter((item) => !isNaN(Number(item))).map((item) => item.toString());

    return (
      <Screen style={{backgroundColor:Colors.WHITE}}>
        <FullHeightView>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{marginTop:5}} onPress={this.props.navigation.goBack}>
              <BText>{i18n.t(core.actions.back)}</BText>
            </TouchableOpacity>
          </View>

          <View style={{marginTop:40, marginBottom:10}}>
            <BText size={FontSizes.MEDIUM} theme={TextThemes.HEADER}>
              {i18n.t(auth.notificationConfig.header)}
            </BText>
          </View>

          <FlatList
            data={data}
            renderItem={this.renderOption}
            keyExtractor={this.keyExtractor}
            ItemSeparatorComponent={ListSeparator}
          />
          <Button onPress={this.handleConfirm}>
            {i18n.t(core.actions.submit)}</Button>
        </FullHeightView>
      </Screen>
    );
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    auth: state.auth
  };
}

export const NotificationConfigScreen = connect(mapStateToProps)(NotificationConfigComponent);