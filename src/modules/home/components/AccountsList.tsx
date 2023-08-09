import { toString } from 'lodash';
import React from 'react';
import { FlatList, ListRenderItemInfo, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListSeparator } from '../../../core/components/base/ListSeparator';
import { AccountColors, Colors } from '../../../core/theme/colors';
import { PriceInfoReduxState } from '../../price-api/store/reducer';
import { AccountListItem } from './AccountListItem';
import { Account } from '../../../core/interfaces';
import { Text } from '../../../core/components/base/Text';
import { FontSizes, Sizes } from '../../../core/theme/sizes';

interface Props {
  accounts: Account[];
  onAccountPress: (id: string) => void;
  onAddAccountPress: () => void;
  onDelete: (account: Account) => void;
  priceApi?: PriceInfoReduxState;
  userHasSubscribed: boolean;
  onRefresh: () => Promise<void[]> | undefined;
  onMonitorStatusPress: () => void;
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1
  },
  container: {
    height: 'auto'
  },
  emptyContainer: {
    height: '100%'
  },
  monitorStatus: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    textAlign: 'right',
    paddingVertical: 10,
    paddingHorizontal: Sizes.MEDIUM
  },
  monitorIndicator: {
    height: 10,
    width: 10,
    borderRadius: 10,
    marginRight: 10
  },
  monitorDisabled: {
    backgroundColor: Colors.RED
  },
  monitorEnabled: {
    backgroundColor: Colors.GREEN
  },
  monitorText: {

  }
});

interface State {
  isRefreshing: boolean;
}

export class AccountsList extends React.PureComponent<Props, State> {

  state = {
    isRefreshing: false
  };

  keyExtractor = (account: Account, index: number) => {
    return toString(account.id || index);
  }
  getContainerStyle = () => {
    return this.props.accounts.length ? styles.container : styles.emptyContainer;
  }

  onRefresh = async () => {
    this.setState({ isRefreshing: true });
    await this.props.onRefresh();
    this.setState({ isRefreshing: false });
  }

  renderAccountItem = ({ item }: ListRenderItemInfo<Account>) => {
    const { onDelete, onAccountPress, priceApi, accounts } = this.props;
    const accountIndex = accounts.findIndex(({ currency, id }) => 
      (id === item.id) && currency === item.currency) % AccountColors.length;

    return (
      <AccountListItem
        onDelete={onDelete}
        onPress={() => {
          onAccountPress(item.id)
        }}
        account={item}
        accountIndex={accountIndex}
        priceApi={priceApi}
      />
    );
  }

  onMonitorStatusPress = () => {
    this.props.onMonitorStatusPress();
  }

  render () {
    const { accounts, userHasSubscribed } = this.props;
    return (
      <>
      <FlatList
        contentContainerStyle={this.getContainerStyle()}
        style={styles.flatList}
        data={accounts}
        renderItem={this.renderAccountItem}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={ListSeparator}
        refreshControl={
          <RefreshControl
          refreshing={this.state.isRefreshing}
          onRefresh={this.onRefresh}
          colors={[Colors.WHITE]}
          tintColor={Colors.WHITE}
          />
        }
        />
        <View style={styles.monitorStatus}>
          <View style={[styles.monitorIndicator, userHasSubscribed ? styles.monitorEnabled : styles.monitorDisabled]}>
          </View>
          { userHasSubscribed ? 
            <Text size={FontSizes.XSMALL} color={Colors.WHITE}>Monitoring Active</Text> :
            <TouchableOpacity activeOpacity={1} style={styles.monitorText} onPress={this.onMonitorStatusPress}>
              <Text underline size={FontSizes.XSMALL} color={Colors.BLUE}>Monitoring Disabled</Text>
            </TouchableOpacity>}
        </View>
      </>
    );
  }
}
