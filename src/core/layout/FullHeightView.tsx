import React from 'react';
import { StyleSheet, View, ViewProps, SafeAreaView } from 'react-native';
import { Colors } from '../theme/colors';
import { defaultSideOffset, Sizes } from '../theme/sizes';

interface Props extends ViewProps {
  withoutPaddings?: boolean;
}

const styles = StyleSheet.create({
  view: {
    height: '100%',
    display: 'flex',
    flexGrow: 1,
    paddingVertical: Sizes.MEDIUM,
    paddingHorizontal: defaultSideOffset
  },
  withoutPaddings: {
    paddingVertical: 0,
    paddingHorizontal: 0
  }
});

export class FullHeightView extends React.PureComponent<Props> {
  render () {
    const { style, withoutPaddings, children, ...rest } = this.props;

    return (
      <SafeAreaView style={[styles.view, withoutPaddings && styles.withoutPaddings, style]} {...rest}>
        {children}
      </SafeAreaView>
    );
  }
}
