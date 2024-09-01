import {Alert} from 'react-native';

//Show Popup Alert
const showPopupWithOk = (title, message, okClicked) => {
  Alert.alert(title ? title : 'RN', message ? message : '', [
    {text: 'OK', onPress: () => okClicked && okClicked()},
  ]);
};

//Show Popup with ok and cancel
const showPopupWithOkAndCancel = (title, message, okClicked, cancelClicked) => {
  Alert.alert(title ? title : 'RN', message ? message : '', [
    {
      text: 'cancel',
      onPress: () => cancelClicked && cancelClicked(),
      style: 'cancel',
    },
    {
      text: 'OK',
      onPress: () => okClicked && okClicked(),
    },
  ]);
};

// validate
const validateField = (val, msg) => {
  if (!val) {
    return {
      status: false,
      msg: msg,
    };
  } else {
    return {status: true, msg: ''};
  }
};

export {showPopupWithOk, showPopupWithOkAndCancel, validateField};
