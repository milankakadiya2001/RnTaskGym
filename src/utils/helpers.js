import AsyncStorage from '@react-native-async-storage/async-storage';

// Set Async Storage Data
const setAsyncStorageData = async (key, value) => {
  const stringData = JSON.stringify(value);
  await AsyncStorage.setItem(key, stringData);
};

// Get Async Storage Data
const getAsyncStorageData = async key => {
  const data = await AsyncStorage.getItem(key);
  return JSON.parse(data);
};

// Remove Async Storage Data
const removeAsyncStorageData = async key => {
  await AsyncStorage.removeItem(key);
};

export {getAsyncStorageData, setAsyncStorageData, removeAsyncStorageData};
