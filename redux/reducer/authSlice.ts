import {parseSync} from '@babel/core';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {State} from 'react-native-gesture-handler';

// Define a type for the slice state
interface authState {
  token: string | undefined;
  signInLoader: boolean;
  signInError: boolean;
  shopifyToken: string | undefined;
  customNavigationPath: string | undefined;

  user:
    | Partial<{
        city: string;
        created_at: string;
        device_token: string | null;
        email: string;
        email_verified_at: string | null;
        gender: string;
        id: number | null;
        name: string;
        phone: string;
        state: string;
        status: number | null;
        type: number | null;
        updated_at: string;
        address: string | undefined;
        avatar: string | undefined;
        is_social: number | null;
        photo?: string | null;
      }>
    | undefined;
  socialLogin: {
    idToken: string;
    scopes: [];
    serverAuthCode: string;
    user1: {
      email: string;
      familyName: string;
      givenName: string;
      id: string;
      name: string;
      photo: string;
    };
  };
  FcmToken?: {
    token: string;
    os: string;
  };
}
interface Fcmtoken {
  token: string;
  os: string;
}
// Define the initial state using that type
const initialState: authState = {
  token: undefined,
  signInLoader: false,
  signInError: false,
  shopifyToken: undefined,
  user: {
    city: '',
    created_at: '',
    device_token: null,
    email: '',
    email_verified_at: null,
    gender: '',
    id: null,
    name: '',
    phone: '',
    state: '',
    status: null,
    type: null,
    updated_at: '',

    address: '',
    avatar: '',
    is_social: null,
  },
  socialLogin: {
    idToken: '',
    scopes: [],
    serverAuthCode: '',
    user1: {
      email: '',
      familyName: '',
      givenName: '',
      id: '',
      name: '',
      photo: '',
    },
  },
  FcmToken: {
    token: '',
    os: '',
  },
  customNavigationPath: undefined,
};

export const authSlice = createSlice({
  name: 'authSlice',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    authStart: state => {
      state.signInLoader = true;
    },
    authSuccess: (state, action: PayloadAction<any>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.signInLoader = false;
      state.signInError = false;
    },

    authSocial: (state, action: PayloadAction<any>) => {
      state.socialLogin.idToken = action.payload.idToken;
      state.socialLogin.user1 = action.payload.user;
      state.signInLoader = false;
      state.signInError = false;
    },
    updateUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    signupUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },

    authFailed: state => {
      state.signInLoader = false;
      state.signInError = true;
    },
    removeToken: state => {
      state.token = undefined;
      state.signInLoader = false;
      state.user = undefined;
      state.shopifyToken = undefined;
    },
    shopifyAccessToken: (state, action: PayloadAction<string>) => {
      state.shopifyToken = action.payload;
    },
    saveFcmToken: (state, action: PayloadAction<string>) => {
      state.FcmToken?.token != action.payload;
    },
    closeLoader: state => {
      state.signInLoader = false;
    },
    setPath: (state, action: PayloadAction<string | undefined>) => {
      state.customNavigationPath = action.payload;
    },
  },
});

export const {
  authStart,
  authFailed,
  authSuccess,
  removeToken,
  shopifyAccessToken,
  updateUser,
  closeLoader,
  saveFcmToken,
  setPath,
} = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export default authSlice.reducer;
