import * as React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { actionIcons } from '../../../assets/icons';
import { Colors } from '../../theme/colors';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { fonts } from '../../theme/fonts';
import { FontSizes, Sizes } from '../../theme/sizes';
import { Text as BText } from './Text';

interface Props {
  value: any;
  items: Array<SelectItem<any>>
  title?: string;
  style?: any;
  rightElement?: React.ReactNode;
  onChange: (value: any) => void;
  placeholder?: string;
}

export interface SelectItem<T> extends Item {
  value: T;
}

const defaultStyles: any = {
  fontSize: FontSizes.SMALL,
  fontFamily: fonts.roboto,
  fontWeight: 'normal',
  color: Colors.BLUE
};

const styles: any = {
  wrapper: {
    marginBottom: Sizes.MEDIUM
  },
  inputIOS: {
    ...defaultStyles
  },
  inputAndroid: {
    ...defaultStyles
  },
  iconContainer: {
    top:0
  },
  placeholder: {
    color: Colors.GREY_DARK
  },
  chevron: {
    width: 25,
    height: 25,
  }
};

export class BSelect extends React.PureComponent<Props> {
  render () {
    const { rightElement, items, value, title, placeholder = '' } = this.props;
    const placeholderObject = {
      value: null,
      label: placeholder
    };
    return (
      <View >
        {title ? (
          <BText size={FontSizes.SMALL} color={Colors.BLUE}>{title}</BText>
        ) : null}

        <RNPickerSelect
          onValueChange={this.props.onChange}
          items={items}
          value={value}
          style={styles}
          useNativeAndroidPickerStyle={false}
          placeholder={placeholderObject}
          Icon={rightElement ? () => rightElement : () => {
            return <Image source={actionIcons.chevronDown} style={styles.chevron} />;
          }}
        />
      </View>
    );
  }
}
