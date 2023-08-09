export const auth = {
  passcode: {
    passcode: 'auth.passcode.passcode'
  },
  setPasscodeModal: {
    enterAgain: 'auth.modals.setPasscode.enterAgain',
    passcodeHint: 'auth.modals.setPasscode.passcodeHint'
  },
  enterPasscodeModal: {
    passcodeHint: 'auth.modals.enterPasscode.passcodeHint',
    forgotPin: 'auth.modals.enterPasscode.forgotPin',
    confirmReset: 'auth.modals.enterPasscode.confirmReset',
    welcomeBack: 'auth.modals.enterPasscode.welcomeBack'
  },
  accounts: {
    title: 'auth.screens.accounts.title',
    noAccounts: {
      hint: 'auth.screens.accounts.noAccounts.hint',
      title: 'auth.screens.accounts.noAccounts.title'
    },
    addAccount: 'auth.screens.accounts.addAccount',
    createAccount: 'auth.screens.accounts.createAccount'
  },
  accountDetails: {
    noTransactions: {
      title: 'auth.screens.accountDetails.noTransactions.title'
    },
    copiedSuccessfully: 'auth.screens.accountDetails.copiedSuccessfully',
    copy: 'auth.screens.accountDetails.copy'
  },
  createAccount: {
    step: 'auth.screens.createAccount.step',
    title: 'auth.screens.createAccount.title',
    notePassphrase: 'auth.screens.createAccount.notePassphrase',
    notePassphraseHint: 'auth.screens.createAccount.notePassphraseHint',
    notePassphraseHint2: 'auth.screens.createAccount.notePassphraseHint2',
    howToGenerate: 'auth.screens.createAccount.howToGenerate',
    generateSeed: 'auth.screens.createAccount.generateSeed',
    generatedPercent: 'auth.screens.createAccount.generatedPercent',
    createAccount: 'auth.screens.createAccount.createAccount',
    enterPin: 'auth.screens.createAccount.enterPin',
    enterPinHint: 'auth.screens.createAccount.enterPinHint',
    next: 'core.actions.next'
  },
  addAccount: {
    title: 'auth.screens.addAccount.title',
    createAccount: 'auth.screens.addAccount.createAccount',
    hint: 'auth.screens.addAccount.hint',
    importAccount: 'auth.screens.addAccount.importAccount',
    selectCurrency: 'auth.screens.addAccount.selectCurrency',
    selectedCurrency: 'auth.screens.addAccount.selectedCurrency',
    address: 'auth.screens.addAccount.address',
    success: 'auth.screens.addAccount.success',
    addToken: 'auth.screens.addAccount.addToken',
    tokenAddress: 'auth.screens.addAccount.tokenAddress',
    tokenDecimals: 'auth.screens.addAccount.tokenDecimals',
    isEthValidator: 'auth.screens.addAccount.isEthValidator'
  },
  importAccount: {
    import: 'auth.screens.importAccount.import',
    activeAccount: 'auth.screens.importAccount.activeAccount',
    activeAccountHint: 'auth.screens.importAccount.activeAccountHint',
    passiveAccountHint: 'auth.screens.importAccount.passiveAccountHint',
    title: 'auth.screens.importAccount.title',
    showPassphrase: 'auth.screens.importAccount.showPassphrase'
  },
  errors: {
    accountExist: 'auth.errors.accountExist',
    serverErrorAddingAccount: 'auth.errors.serverErrorAddingAccount',
    incorrectAddress: 'auth.errors.incorrectAddress',
    incorrectPassphrase: 'auth.errors.incorrectPassphrase',
    insecurePin: 'auth.errors.insecurePin',
    incorrectPasscode: 'auth.errors.incorrectPasscode',
    noUnstoppableAddressesFound: 'auth.errors.noUnstoppableAddressesFound',
    missingDeviceToken: 'auth.errors.missingDeviceToken'
  },
  models: {
    account: {
      id: 'models.account.id',
      address: 'models.account.address',
      pin: 'models.account.pin',
      passphrase: 'models.account.passphrase'
    },
    passcode: {
      passcode: 'auth.models.passcode.passcode'
    }
  },
  purchase: {
    watchUpTo: 'auth.modals.purchase.watchUpTo',
    notReadyYet: 'auth.modals.purchase.notReadyYet',
    goBack: 'auth.modals.purchase.goBack',
    equation: 'auth.modals.purchase.equation',
    monthly: 'auth.modals.purchase.monthly',
    sixMonths: 'auth.modals.purchase.sixMonths',
    yearly: 'auth.modals.purchase.yearly',
    tryFree: 'auth.modals.purchase.tryFree',
    viewCurrencyList: 'auth.modals.purchase.viewCurrencyList',
    hint1: 'auth.modals.purchase.hint1',
    hint2: 'auth.modals.purchase.hint2',
    hint3: 'auth.modals.purchase.hint3',
    go: 'auth.modals.purchase.go',
    havePromoCode: 'auth.modals.purchase.havePromoCode'
  },
  currencyList: {
    header: 'auth.modals.currencyList.header',
    fullySupported: 'auth.modals.currencyList.fullySupported',
    supportedViaCoinbase: 'auth.modals.currencyList.supportedViaCoinbase',
    coinbaseHint: 'auth.modals.currencyList.coinbaseHint',
  },
  notificationConfig: {
    header: 'auth.screens.notificationConfig.header',
    option0: 'auth.screens.notificationConfig.option0',
    option1: 'auth.screens.notificationConfig.option1',
    option2: 'auth.screens.notificationConfig.option2',
    option3: 'auth.screens.notificationConfig.option3',
    successHeader: 'auth.screens.notificationConfig.successHeader',
    successBody: 'auth.screens.notificationConfig.successBody',
  }
};
