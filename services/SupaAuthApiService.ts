import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {
  CommonActions,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import {Alert} from 'react-native';

import {supa_base_url} from '../utils';
import {
  AuthResponseModel,
  BannerI,
  ColorsResponseI,
  OtpResponse,
  Collection_IdResponse,
} from '../models';
import store, {AppDispatch, AppThunk} from '../redux/store';
import {
  authStart,
  authFailed,
  authSuccess,
  updateUser,
} from '../redux/reducer/authSlice';
import {
  saveColors,
  failColors,
  shopifyUserId,
  saveCollectioId,
  saveSaleId,
  Banner,
} from '../redux/reducer/dashboardSlice';
import {Colors} from '../constant/Colors';
import {useAppSelector} from '../hooks';
import shopifyApiService from './ShopifyApiService';
import {ShopifyAcessToken} from './GraphQLApi';
// const authReducer = useAppSelector(State => State.authReducer);
// const {token} = authReducer;
interface contactUs {
  data: {message: string; statusCode: number};
}

class SupaAuthApiService {
  supaInstance: AxiosInstance;

  private baseApiUrl: string = supa_base_url;
  public navigation: NavigationProp<ParamListBase> | undefined;

  constructor() {
    this.supaInstance = axios.create({
      baseURL: this.baseApiUrl,
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      timeout: 300000,
    } as AxiosRequestConfig);
  }
  setNavigation = (navigation: NavigationProp<ParamListBase>) => {
    this.navigation = navigation;
  };
  getRedux = () => {
    const authReducer = useAppSelector(State => State.authReducer);
    const dashboardReducer = useAppSelector(state => state.dashboardReducer);

    const {token, user} = authReducer;
    return dashboardReducer;
  };
  setAuth = (userAuth: string) => {
    this.supaInstance.defaults.headers.common['Authorization'] =
      'Bearer ' + userAuth;
  };
  getColors = (): AppThunk => async (dispatch: AppDispatch) => {
    try {
      const res = await this.supaInstance.get<AxiosResponse<ColorsResponseI>>(
        'config/color',
      );

      let [primary, secondary] = res.data?.data?.value.split(',');
      let colorObj = {
        primary,
        secondary,
        gradient1: Colors.gradient1,
        gradient2: Colors.gradient2,
        title: Colors.title,
        resend: Colors.resend,
      };
      dispatch(saveColors(colorObj));
    } catch (error) {
      let colorObj = {
        primary: Colors.primary,
        secondary: Colors.secondary,
        gradient1: Colors.gradient1,
        gradient2: Colors.gradient2,
        title: Colors.title,
        resend: Colors.resend,
      };
      dispatch(saveColors(colorObj));
      console.warn('fail to get colors', error);
      dispatch(failColors());
    }
    return true;
  };

  getCollectionId1 = (): AppThunk => async (dispatch: AppDispatch) => {
    try {
      const res = await this.supaInstance.get<
        AxiosResponse<Collection_IdResponse[]>
      >('config/screen_collection');

      if (res.status == 200) {
        dispatch(saveCollectioId(res?.data?.data[0] as any));
        dispatch(saveSaleId(res?.data?.data[1] as any));
      }

      // dispatch(saveCollectioId(res.data.data))
    } catch (error) {
      console.error(error);
    }
  };
  getbanner1 = (): AppThunk => async (dispatch: AppDispatch) => {
    try {
      const res = await this.supaInstance.get<BannerI>('config/banner');

      if (res?.status == 200) {
        dispatch(Banner(res.data.data));
      }
    } catch (error) {
      console.log('this is banner error', error);
    }
  };

  signinUser =
    (
      values: any,
      formikRef: any,
      navigation: any,
      email: string,
      path: any,
    ): AppThunk =>
    async (dispatch: AppDispatch) => {
      try {
        dispatch(authStart());

        const res = await this.supaInstance.post<AuthResponseModel<any>>(
          'login',
          values,
        );

        // return true;
        if (res.data.statusCode == 200) {
          const shopifyResponse = await shopifyApiService.shopifySignin(email);

          dispatch(
            shopifyUserId(shopifyResponse.data?.customers![0]?.id ?? undefined),
          );
          dispatch(authSuccess(res.data));
          this.setAuth(res.data.token!);

          setTimeout(() => {
            if (!store.getState().authReducer.signInLoader) {
              {
                path
                  ? navigation.navigate(path, {
                      cartm: true,
                    })
                  : navigation.dispatch(
                      CommonActions.reset({
                        index: 1,
                        routes: [{name: 'HomeTabs'}],
                      }),
                    );
              }
            }
          }, 400);
        } else {
          dispatch(authFailed());
          formikRef.current?.setErrors({
            email: 'Email is invalid!',
            password: 'Password is wrong!',
          });
        }
      } catch (e) {
        dispatch(authFailed());
        console.error(e);
      }
    };
  signupUser =
    (
      values: FormData,
      phone: string,
      formikRef: any,
      navigation: any,
      email: any,
      passward: any,
      custmerId: any,
    ): AppThunk =>
    async (dispatch: AppDispatch) => {
      try {
        // dispatch(authStart());
        const res = await this.supaInstance.post<AuthResponseModel<any>>(
          'regstr',
          values,
        );

        // return true;
        if (res.data.statusCode == 200) {
          dispatch(authSuccess(''));
          const formData: FormData = new FormData();
          formData.append('email', email);
          formData.append('password', passward);
          ShopifyAcessToken(email, passward);
          //! donot need formik here
          //@ts-ignore
          dispatch(this.signinUser(formData, '', navigation, email));
          // setTimeout(() => {
          //   if (!store.getState().authReducer.signInLoader) {
          //     navigation.navigate('VerifyOtp', {
          //       id: res.data.data.id,
          //       sendOtp: phone.slice(3),
          //       selectField: '',
          //       screenFlag: false,
          //       formikRef,
          //       navigation,
          //       email,
          //       passward,
          //     });
          //   }
          // }, 500);
        } else {
          dispatch(authFailed());
          shopifyApiService.deleteUser(custmerId);
          formikRef.current?.setErrors({
            name: res.data?.error?.name ? 'Name is already exist.' : undefined,
            mobilenumber: res.data?.error?.phone
              ? 'Mobile Number is already exist.'
              : undefined,
            email: res.data?.error?.email
              ? 'Email is already exist.'
              : undefined,
          });
        }
      } catch (e: any) {
        console.log(e.message, 'signup error');

        dispatch(authFailed());
      }
    };
  socialLoginFirstTime =
    (values: any, email: string, passward: string, path: any): AppThunk =>
    async (dispatch: AppDispatch) => {
      try {
        const res = await this.supaInstance.post<AuthResponseModel<any>>(
          'regstr',
          values,
        );
        // return true;
        if (res.data.statusCode == 200) {
          //* After signup we need to login to get user.

          const formData: FormData = new FormData();
          formData.append('email', email);
          formData.append('password', passward);
          //@ts-ignore
          dispatch(this.socialLogin(formData, email));
          //! TODO FIX
          setTimeout(() => {
            if (!store.getState().authReducer.signInLoader) {
              {
                path
                  ? this.navigation!.navigate(path)
                  : this.navigation!.dispatch(
                      CommonActions.reset({
                        index: 1,
                        routes: [{name: 'HomeTabs'}],
                      }),
                    );
              }
            }
          }, 400);
        } else {
          console.warn('sowething went wrong!');
          dispatch(authFailed());
        }
      } catch (e: any) {
        console.log(e.message, 'signup error');

        dispatch(authFailed());
      }
    };
  RecoverPassword = async (
    value: any,
    selectedField: string,
  ): Promise<AuthResponseModel<OtpResponse>> => {
    return Promise.resolve(
      this.supaInstance.post(`recover-password/${selectedField}`, value),
    );
  };
  socialLogin =
    (values: any, email: string, path: any): AppThunk =>
    async (dispatch: AppDispatch) => {
      console.log([path, '...............']);
      dispatch(authStart());
      try {
        const res = await this.supaInstance.post<AuthResponseModel<any>>(
          'login',
          values,
        );

        if (res.data.statusCode == 200) {
          const shopifyResponse = await shopifyApiService.shopifySignin(email);

          dispatch(
            shopifyUserId(shopifyResponse.data?.customers![0]?.id ?? undefined),
          );
          dispatch(authSuccess(res.data));
          this.setAuth(res.data.token!);
          setTimeout(() => {
            if (!store.getState().authReducer.signInLoader) {
              {
                path
                  ? this.navigation!.navigate(path)
                  : this.navigation!.dispatch(
                      CommonActions.reset({
                        index: 1,
                        routes: [{name: 'HomeTabs'}],
                      }),
                    );
              }
            }
            // this.navigation?.navigate('Home');
          }, 400);
        } else {
          Alert.alert('Something went wrong!');
          dispatch(authFailed());
        }
      } catch (e) {
        Alert.alert('Something went wrong!', e);
        dispatch(authFailed());
        console.error(e, 'thi sis is error');
      }
    };

  VerifyOtp = async (data: any): Promise<AxiosResponse<OtpResponse>> => {
    return await Promise.resolve(this.supaInstance.post('verify-otp', data));
  };
  reSendOtp = async (
    data: any,
    selectedField: string,
  ): Promise<AxiosResponse> => {
    return await Promise.resolve(
      this.supaInstance.post(`resend-otp/${selectedField}`, data),
    );
  };
  resetPassword = async (
    values: any,
    id: number,
  ): Promise<AxiosResponse<OtpResponse>> => {
    return await this.supaInstance.post(`reset-password/${id}`, values);
  };

  ContactUs = async (data: any, token: string) => {
    this.setAuth(token);
    return this.supaInstance
      .post<contactUs>('contact-us', data)
      .catch(function (error) {
        console.log(error);
      });
    // return this.supaInstanceI.post<contactUs>('contact-us', data);
  };
  UpdateUser =
    (data: any, id: any, token: any, formikRef: any): AppThunk =>
    async (dispatch: AppDispatch) => {
      this.setAuth(token);
      const res = await this.supaInstance.post(`update-user/${id}`, data);

      if (res.data.statusCode == 200) {
        dispatch(updateUser(res.data.user));

        // return true;
      } else {
        formikRef.current?.setErrors({
          mobilenumber: res.data?.error
            ? 'Mobile Number is already exist.'
            : undefined,
        });
      }
      // return true;
    };
  ChanePass = async (data: any, id: any) => {
    return await this.supaInstance.post(`change-password/${id}`, data);
  };
  saveToken = async (id: number, token: string) => {
    // console.log('id token', id, token);

    try {
      const formData: FormData = new FormData();
      formData.append('device_token', token);
      const res = await this.supaInstance.post(`update-user/${id}`, formData);
    } catch (error) {
      console.log(error);
    }
  };
  Notification = async (token: any) => {
    this.setAuth(token);
    try {
      return await this.supaInstance.get('notifications-list');
    } catch (error) {
      console.error(error);
    }
  };
  handleTokenForIos = async (token: string | undefined) => {
    return await fetch('https://iid.googleapis.com/iid/v1:batchImport', {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAAPvcjNJY:APA91bF_Ivj7nuxfG3QNDR1gXH-haB2KK0-TaQ6Fjqp3bs0LxSVAyTrWE1V4ou-xthskEAYhCjwG5i4N1uALGGnXIcBq7oGgfN6c-M2Gu9fIcMM_8nELMJa_PSAupClybgYJBp7R7nJA',
      },
      method: 'POST',
      body: JSON.stringify({
        application: 'com.unitedpayday',
        sandbox: true,
        apns_tokens: [token?.toString()],
      }),
    });
  };
}
const supaAuthApiService = new SupaAuthApiService();

export default supaAuthApiService;
