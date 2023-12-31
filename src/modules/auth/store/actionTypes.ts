export const PATH = 'AUTH_';

export const actionTypes = {
  addAccount: `${PATH}_ADD_ACCOUNT`,
  getAccount: `${PATH}_GET_ACCOUNT`,
  updateAccount: `${PATH}_UPDATE_ACCOUNT`,
  removeAccount: `${PATH}_REMOVE_ACCOUNT`,
  loadAccounts: `${PATH}_LOAD_ACCOUNTS`,
  loadPasscodeEnteredTime: `${PATH}_LOAD_PASSCODE_ENTERED_TIME`,
  setPasscodeEnteredTime: `${PATH}_SET_PASSCODE_ENTERED_TIME`,
  setPasscode: `${PATH}_SET_PASSCODE`,
  loadPasscode: `${PATH}_LOAD_PASSCODE`,
  resetAuthState: `${PATH}_STATE_RESET`,
  setAgreeToTerms: `${PATH}_SET_AGREE_TO_TERMS`,
  loadAgreeToTerms: `${PATH}_LOAD_AGREE_TO_TERMS`,
  setDeviceId: `${PATH}_SET_DEVICE_ID`,
  loadDeviceId: `${PATH}_LOAD_DEVICE_ID`,
  setUserId: `${PATH}_SET_USER_ID`,
  loadUserId: `${PATH}_LOAD_USER_ID`,
  setAllowList: `${PATH}_SET_ALLOW_LIST`,
  setTrigger: `${PATH}_SET_TRIGGER`
};
