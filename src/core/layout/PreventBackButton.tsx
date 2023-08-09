import React from 'react';
import { Alert, AlertButton } from 'react-native';
import {
  HeaderBackButton
} from '@react-navigation/stack';
import { i18n } from '../i18n';
import { core } from '../translations';

export const preventBackAction = (onPress?: () => void): void => {
  Alert.alert(
    i18n.t(core.preventBack.title),
    i18n.t(core.preventBack.message),
    getAlertButtons(onPress)
  );
};

export const getAlertButtons = (onPress?: () => void): AlertButton[] => {
  return [
    {
      text: i18n.t(core.actions.ok),
      onPress
    },
    {
      text: i18n.t(core.actions.cancel),
      onPress: () => null
    }
  ];
};
// <HeaderBackButtonProps> - https://github.com/react-navigation/stack/pull/227/files
export class PreventBackButton extends React.PureComponent<any> {
  handlePress = () => {
    preventBackAction(this.props.onPress);
  }

  render () {
    return (
      <HeaderBackButton {...this.props} onPress={this.handlePress} />
    );
  }
}
