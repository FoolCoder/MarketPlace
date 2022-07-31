import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  TextInput,
  Image,
  Pressable,
} from 'react-native';
import {Formik, Field, FormikProps} from 'formik';
import {useDispatch} from 'react-redux';
//@ts-ignore
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Modal from 'react-native-modal';
//@ts-ignore
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';

import {ColorsI, RegisterShopifyI} from '../../models';

import TextRegular from '../../components/ui/TextRegular';
import TextBold from '../../components/ui/TextBold';
import Container from '../../components/common/Container';
import {hp, wp} from '../../components/common/Responsive';
import {CustomInput} from '../../components/ui/CustomInput';
import {signinValidation} from '../../helpers/FormValidation';
import {useAppSelector} from '../../hooks';
import supaAuthApiService from '../../services/SupaAuthApiService';
import Loader from '../../components/ui/Loader';
import LogoWhite from '../../assets/allicons/logo-white.svg';
import deviceInfoModule from 'react-native-device-info';
import {ShopifyAcessToken} from '../../services/GraphQLApi';
import {Google_WebClientID} from '../../utils';
import store from '../../redux/store';
import {authFailed, authStart} from '../../redux/reducer/authSlice';
import shopifyApiService from '../../services/ShopifyApiService';
import {shopifyUserId} from '../../redux/reducer/dashboardSlice';
import {supalogo} from '../../constant/Images';
import {RotateInUpLeft} from 'react-native-reanimated';
import {
  getNavigationPath,
  setNavigationPath,
} from '../../helpers/helperFunction';

const {signinUser, socialLogin, socialLoginFirstTime} = supaAuthApiService;

interface Props {
  navigation: NavigationProp<ParamListBase>;
  loader?: boolean;
  route: RouteProp<
    {
      // key: string;
      // name: string;
      params: {cart?: boolean; path?: any};
    },
    'params'
  >;
}

interface MyFormValues {
  email: string;
  password: string;
}
GoogleSignin.configure({
  webClientId: Google_WebClientID,
  offlineAccess: true,
});
const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    handleSocialLogin(userInfo.user);
    // this.setState({userInfo});
  } catch (error: any) {
    console.log(error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
};
const SigninScreen = (props: Props) => {
  const [eye, setEye] = useState<boolean>(false);
  const [loader, setloader] = useState<boolean>(false);
  const dispatch = useDispatch();
  const authReducer = useAppSelector(state => state.authReducer);
  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const {colors, shopifyCustomerId} = dashboardReducer;
  const styles = useStyles(colors);

  setNavigationPath(props.route?.params?.path);

  const initialValues: MyFormValues = {
    email: '',
    password: '',
  };
  const formikRef = useRef<FormikProps<MyFormValues>>(null);
  const submit = async (values: MyFormValues) => {
    dispatch(authStart());
    const formData: FormData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);
    ShopifyAcessToken(values.email, values.password);
    dispatch(
      signinUser(
        formData,
        formikRef,
        props.navigation,
        values.email,
        props.route?.params?.path,
      ),
    );
  };
  return (
    <Container
      headerTitle=""
      //* Here we are checking either our user navigate from cart screen after clicking checkout button
      arrowp={props.route.params?.cart ?? false}
      logo={
        <Image style={{height: hp(5.5), width: wp(42)}} source={supalogo} />
      }>
      <>
        <KeyboardAwareScrollView automaticallyAdjustContentInsets={true}>
          <Loader visible={authReducer.signInLoader} />
          <View style={styles.viewContainer}>
            <TextBold style={styles.title}>Sign In</TextBold>
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              onSubmit={values => submit(values)}
              validationSchema={signinValidation}>
              {({handleSubmit, isValid}) => (
                <>
                  <TextRegular style={styles.headerText}>Email</TextRegular>
                  <Field
                    key={1}
                    keyboardType="email-address"
                    component={CustomInput}
                    name="email"
                    placeholder="Email"
                  />
                  <TextRegular style={styles.headerText}>Password</TextRegular>
                  <Field
                    key={2}
                    component={CustomInput}
                    setEye={setEye}
                    eye={eye}
                    name="password"
                    placeholder="Password"
                  />
                </>
              )}
            </Formik>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Recover')}
              style={styles.forgotPassword}>
              <TextRegular style={styles.commonText}>
                Forgot Password?
              </TextRegular>
            </TouchableOpacity>
            <View style={styles.socialLoginContainer}>
              {/* <TouchableOpacity
                style={{
                  ...styles.gmailBtn,
                  backgroundColor: '#045BA5',
                  marginRight: wp(3),
                }}>
                <TextRegular style={{color: 'white'}}>Facebook</TextRegular>
              </TouchableOpacity> */}
              <TouchableOpacity onPress={signIn} style={styles.gmailBtn}>
                <TextRegular style={{color: 'white'}}>Gmail</TextRegular>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => formikRef.current?.handleSubmit()}
              style={styles.btn}>
              <TextBold>Sign In</TextBold>
            </TouchableOpacity>
            <View style={styles.signinContainer}>
              {/* <TextRegular style={styles.commonText}>
                Don't have an account?
              </TextRegular> */}
              <TouchableOpacity
                style={[styles.btn, {marginLeft: wp(4)}]}
                onPress={() => {
                  props.navigation.navigate('SignupScreen');
                }}>
                <TextBold
                  style={{
                    ...styles.commonText,
                    marginTop: wp(2),
                    color: '#fff',
                  }}>
                  Sign Up Now!
                </TextBold>
                {/* <View style={styles.borderLine} /> */}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {/* <Modal isVisible style={{alignItems: 'center'}}>
          <View style={styles.phoneModal}>
            <TextBold style={{fontSize: 6, color: colors.primary}}>
              Add Phone Number
            </TextBold>
            <TextRegular style={{color: 'black', alignSelf: 'flex-start'}}>
              Phone No:
            </TextRegular>
            <TextInput
              style={{
                marginTop: wp(20),
                borderBottomWidth: 1,
                width: wp(70),
                fontSize: 20,
              }}
              placeholder="03XX-XXXXXXX"
              onChangeText={handlePhoneNumber}
            />
          </View>
        </Modal> */}
      </>
    </Container>
  );
};
const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewContainer: {
      flex: 1,
      paddingHorizontal: wp(Platform.OS == 'android' ? 8.5 : 7.8),
      paddingVertical: wp(10),
    },
    margin: {
      marginTop: wp(10),
    },
    accountView: {
      flexDirection: 'row',
      marginTop: wp(3),
    },
    privacyView: {
      flexDirection: 'row',
      marginVertical: wp(2),
    },
    logo: {
      marginBottom: wp(10),
    },
    forgotPassword: {
      flexGrow: 1,
      width: wp(80),
      alignItems: 'flex-end',
    },
    commonText: {
      fontSize: 4,
      color: colors.secondary,
      marginTop: wp(4),
    },
    signinContainer: {
      width: wp(80),
      alignItems: 'flex-start',
      marginTop: wp(1),
    },

    borderLine: {
      borderBottomWidth: 1,
      borderColor: colors.secondary,
    },
    headerText: {
      marginTop: wp(6),
      color: colors.resend,
      fontSize: Platform.OS == 'ios' ? wp(1.2) : wp(1.2),
      marginVertical: hp(1),
    },
    title: {
      color: colors.primary,
      fontSize: wp(2),
      marginBottom: wp(1),
    },
    btn: {
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: wp(2),
      width: wp(60),
      ...Platform.select({
        android: {
          height: 45,
        },
        ios: {
          height: 45,
        },
      }),
      flexGrow: 1,
      alignSelf: 'center',
      borderRadius: 10,
    },
    socialLoginContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: wp(10),
      width: wp(60),
      justifyContent: 'center',
      alignSelf: 'center',
    },
    gmailBtn: {
      backgroundColor: '#D00303',
      height: wp(12),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      flex: 1,
    },
    phoneModal: {
      width: wp(80),
      height: wp(60),
      backgroundColor: 'white',
      alignItems: 'center',
      borderRadius: 10,
      paddingTop: wp(5),
    },
  });
export default SigninScreen;
function handleSocialLogin(user: {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}) {
  const path = getNavigationPath();
  const dispatch: any = store.dispatch;
  const PASSWORD = '12345678@'; // !TODO FIX IN CASE OF SOCIAL LOGIN CANNOT BE CHANGED
  const PHONE_NUMBER = '92' + '300000' + Math.floor(Math.random() * 9999); // !RANDOM PHONE NUMBER BUT START WITH 000 IMPORTANT
  dispatch(authStart());

  var shopifyRegistrationObj: RegisterShopifyI = {
    customer: {
      first_name: user.givenName!,
      last_name: user.familyName!,
      email: user.email,
      phone: PHONE_NUMBER,
      verified_email: true,
      addresses: [
        {
          country: 'Pakistan',
        },
      ],
      password: PASSWORD,
      password_confirmation: PASSWORD,
    },
  };
  shopifyApiService
    .registerUserOnShopify(shopifyRegistrationObj)

    .then(res => {
      if (res.status == 201) {
        dispatch(shopifyUserId(res.data?.customer!?.id ?? undefined));
        ShopifyAcessToken(user.email, PASSWORD);

        var supaRegistrationObj = {
          name: user.givenName! + ' ' + user.familyName!,
          email: user.email,
          phone: '+' + PHONE_NUMBER,
          gender: '',
          city: '',
          state: 'Pakistan',
          password: PASSWORD,
          password_confirmation: PASSWORD,
          is_social: 1,
          type: 'user',
        };
        const formData: FormData = new FormData();

        Object.entries(supaRegistrationObj).forEach(item =>
          formData.append(item[0], item[1]),
        );
        dispatch(socialLoginFirstTime(formData, user.email, PASSWORD, path));
      } else {
        errorFunction();
        dispatch(authFailed());
      }
    })
    .catch(err => {
      //! In case User already exist
      console.warn('Shopify signup failed! trying login now.', err);
      const formData: FormData = new FormData();
      formData.append('email', user.email);
      formData.append('password', PASSWORD);

      ShopifyAcessToken(user.email, PASSWORD);
      dispatch(socialLogin(formData, user.email, path));
    });
}
function errorFunction() {
  Alert.alert('Something went wrong!');
}
