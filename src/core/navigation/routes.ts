// we have to describe interface to get proper type-hinting
interface Routes {
  accounts: string;
  addAccountStepOne: 'addAccountStepOne';
  addAccountStepTwo: 'addAccountStepTwo';
  home: 'Home';
  accountDetails: string;
  settings: 'Settings';
  credits: 'Credits';
  scan: 'Scan';
  notificationConfig: 'NotificationConfig';
}

/**
 * List of all in-app routes
 */
export const routes: Routes = {
  accounts: 'accounts',
  addAccountStepOne: 'addAccountStepOne',
  addAccountStepTwo: 'addAccountStepTwo',
  home: 'Home',
  accountDetails: 'accountDetails',
  settings: 'Settings',
  credits: 'Credits',
  scan: 'Scan',
  notificationConfig: 'NotificationConfig',
};
