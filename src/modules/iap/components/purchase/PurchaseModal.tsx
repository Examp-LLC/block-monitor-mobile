import React from 'react';
import { Modal } from 'react-native';
import { connect } from 'react-redux';
import { InjectedReduxProps } from '../../../../core/interfaces';
import { AppReduxState } from '../../../../core/store/app/reducer';
import { ApplicationState } from '../../../../core/store/initialState';
import { InAppPurchaseReduxState, inAppPurchaseApi } from '../../store/reducer';
import { PurchaseModalScreen } from './PurchaseModalScreen';

interface OwnProps {
  visible: boolean;
  onSuccess: (purchaseType: IAP_TIERS) => void;
  onSubmitPromoCode: (promoCode: string) => void;
  onCancel?: () => void;
  onDismiss?: () => void;
  onReset?: () => void;
  onViewCurrencyList?: () => void;
}

export enum IAP_TIERS {
  hobbyistOneMonth = 'com.blockmon.app.hobbyist.1', 
  hobbyistSixMonths = 'com.blockmon.app.hobbyist.6', 
  hobbyistTwelveMonths = 'com.blockmon.app.hobbyist.12'
};

interface InjectedProps extends InjectedReduxProps {
  app: AppReduxState;
  inAppPurchaseApi: InAppPurchaseReduxState;
}

type Props = OwnProps & InjectedProps;

class PurchaseModalComponent extends React.PureComponent<Props> {
  handleSubmit = (purchaseType: IAP_TIERS) => {
    this.props.onSuccess(purchaseType);
  }

  handleDismiss = () => {
    const { onDismiss } = this.props;

    onDismiss && onDismiss();
  }

  handleCancel = () => {
    const { onCancel } = this.props;

    onCancel && onCancel();
  }

  handleViewCurrencyListClick = () => {
    const { onViewCurrencyList } = this.props;

    onViewCurrencyList && onViewCurrencyList();
  }


  render () {
    if (!this.props.inAppPurchaseApi.availableSubscriptions) return (
      <></>
    );
    
    return (
      <Modal
        animationType={'slide'}
        visible={this.props.visible}
        // visible={false}
        transparent={false}
        onRequestClose={this.handleCancel}
        onDismiss={this.handleDismiss}
      >
          <PurchaseModalScreen
              onPurchase={this.handleSubmit}
              goBack={this.handleDismiss}
              onSubmitPromoCode={this.props.onSubmitPromoCode}
              subs={this.props.inAppPurchaseApi.availableSubscriptions}
          />
      </Modal>
    );
  }
}

function mapStateToProps (state: ApplicationState) {
  return {
    app: state.app,
    auth: state.auth,
    inAppPurchaseApi: state.inAppPurchaseApi
  };
}

export const PurchaseModal = connect(mapStateToProps)(PurchaseModalComponent);
