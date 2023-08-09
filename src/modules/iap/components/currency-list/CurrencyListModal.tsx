import React from 'react';
import { Modal } from 'react-native';
import { connect } from 'react-redux';
import { InjectedReduxProps } from '../../../../core/interfaces';
import { AppReduxState } from '../../../../core/store/app/reducer';
import { ApplicationState } from '../../../../core/store/initialState';
import { InAppPurchaseReduxState } from '../../store/reducer';
import { CurrencyListModalScreen } from './CurrencyListModalScreen';

interface OwnProps {
  visible: boolean;
  onCancel?: () => void;
  onDismiss?: () => void;
  onReset?: () => void;
}

export enum IAP_TIERS {
  hobbyistOneMonth = 'com.blockmon.app.hobbyist.1', 
  hobbyistSixMonths = 'com.blockmon.app.hobbyist.6', 
  hobbyistTwelveMonths = 'com.blockmon.app.hobbyist.12',
  enthusiastOneMonth = 'com.blockmon.app.enthusiast.1', 
  enthusiastSixMonths = 'com.blockmon.app.enthusiast.6',
  enthusiastTwelveMonths = 'com.blockmon.app.enthusiast.12',
  investorOneMonth = 'com.blockmon.app.investor.1', 
  investorSixMonths = 'com.blockmon.app.investor.6', 
  investorTwelveMonths = 'com.blockmon.app.investor.12'
};

interface InjectedProps extends InjectedReduxProps {
  app: AppReduxState;
  inAppPurchaseApi: InAppPurchaseReduxState;
}

type Props = OwnProps & InjectedProps;

class CurrencyListModalComponent extends React.PureComponent<Props> {

  handleDismiss = () => {
    const { onDismiss } = this.props;

    onDismiss && onDismiss();
  }

  handleCancel = () => {
    const { onCancel } = this.props;

    onCancel && onCancel();
  }


  render () {
    return (
      <Modal
        animationType={'slide'}
        visible={this.props.visible}
        // visible={false}
        transparent={false}
        onRequestClose={this.handleCancel}
        onDismiss={this.handleDismiss}
      >
          <CurrencyListModalScreen
              goBack={this.handleDismiss}
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

export const CurrencyListModal = connect(mapStateToProps)(CurrencyListModalComponent);
