import React, {useState, useRef} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Formik, Field, FormikProps} from 'formik';
import {useDispatch} from 'react-redux';

//@ts-ignore
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import TextRegular from '../../components/ui/TextRegular';
import Container from '../../components/common/Container';
import {hp, wp} from '../../components/common/Responsive';
import {CustomInput, CustomPicker} from '../../components/ui/CustomInput';
import {registration} from '../../helpers/FormValidation';
import TextBold from '../../components/ui/TextBold';
import shopifyApiService from '../../services/ShopifyApiService';
import {ColorsI, RegisterShopifyI} from '../../models';
import Loader from '../../components/ui/Loader';
import supaAuthApiService from '../../services/SupaAuthApiService';
import LogoWhite from '../../assets/allicons/logo-white.svg';

import {useAppSelector} from '../../hooks';
import {authFailed, authStart} from '../../redux/reducer/authSlice';
import deviceInfoModule from 'react-native-device-info';
import {shopifyUserId} from '../../redux/reducer/dashboardSlice';
import {ShopifyAcessToken} from '../../services/GraphQLApi';
import {supalogo} from '../../constant/Images';
import store from '../../redux/store';
import AuthModal from '../../components/common/AuthModal';
const {signupUser} = supaAuthApiService;

interface Props {
  navigation: any;
}

interface MyFormValues {
  name: string;
  email: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  mobilenumber: string;
  password: string;
  cpassword: string;
}

const SignupScreen = (props: Props) => {
  const [eye, setEye] = useState<boolean>(false);
  const [cEye, setCeye] = useState<boolean>(false);
  const [modalVisible1, setmodalVisible1] = useState<boolean>();

  const formikRef = useRef<FormikProps<MyFormValues>>(null);
  const dispatch = useDispatch();
  const authReducer = useAppSelector(state => state.authReducer);
  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const {colors} = dashboardReducer;
  const styles = useStyles(colors);
  const initialValues: MyFormValues = {
    name: '',
    email: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    mobilenumber: '',
    password: '',
    cpassword: '',
  };
  function errorFunction() {
    formikRef.current!?.setErrors({
      mobilenumber: 'Phone number already exist.',
      email: 'Email already exist.',
    });
  }
  const submit = async (values: MyFormValues) => {
    // return true;
    const defaultAddress = '00000';
    dispatch(authStart());
    const [firstName, lastName] = values.name.trim().split(' ');
    var shopifyRegistrationObj: RegisterShopifyI = {
      customer: {
        first_name: firstName,
        last_name: lastName ? lastName : firstName,
        email: values.email,
        phone: '92' + values.mobilenumber,
        verified_email: true,
        addresses: [
          {
            address1: values.address ?? defaultAddress,
            phone: '92' + values.mobilenumber,
            zip: '00000',
            city: values.city,
            province: values.state,
            country: 'Pakistan',
          },
        ],
        password: values.password,
        password_confirmation: values.cpassword,
      },
    };
    shopifyApiService
      .registerUserOnShopify(shopifyRegistrationObj)

      .then(res => {
        console.log('shopify response', res);

        if (res.status == 201) {
          dispatch(shopifyUserId(res.data?.customer!?.id ?? undefined));
          ShopifyAcessToken(values.email, values.password);

          var supaRegistrationObj = {
            name: values.name,
            email: values.email,
            phone: '+92' + values.mobilenumber,
            gender: values.gender,
            city: values.city,
            state: values.state,
            password: values.password,
            password_confirmation: values.cpassword,
            type: 'user',
          };
          const formData: FormData = new FormData();

          Object.entries(supaRegistrationObj).forEach(item =>
            formData.append(item[0], item[1]),
          );
          dispatch(
            signupUser(
              formData,
              supaRegistrationObj.phone,
              formikRef,
              props.navigation,
              values.email,
              values.password,
              res.data?.customer!?.id,
            ),
          );
        } else {
          setmodalVisible1(true);

          // errorFunction();
          dispatch(authFailed());
        }
      })
      .catch(async err => {
        console.warn('Shopify signup failed!', err);
        setmodalVisible1(true);

        // const d = await shopifyApiService.deleteUser(
        //   dashboardReducer.shopifyCustomerId! ?? '',
        // );
        // console.log(d, dashboardReducer.shopifyCustomerId!, 'vchjw');
        // if (!store.getState().authReducer.signInLoader) {
        // errorFunction();
        dispatch(authFailed());
      });
  };
  const onCloseModal = () => {
    setmodalVisible1(!modalVisible1);
  };
  return (
    <Container
      headerTitle=""
      logo={
        <Image
          style={{
            height: Platform.OS == 'ios' ? hp(7) : hp(5.5),
            width: wp(42),
          }}
          source={supalogo}
        />
      }>
      <>
        <KeyboardAwareScrollView automaticallyAdjustContentInsets={true}>
          {/* <Loader visible={authReducer.signInLoader} /> */}
          <View style={styles.viewContainer}>
            <TextBold style={styles.title}>Sign Up</TextBold>
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              onSubmit={values => submit(values)}
              validationSchema={registration}>
              {({handleSubmit, isValid}) => (
                <>
                  <TextRegular style={styles.headerText}>Full Name</TextRegular>
                  <Field
                    key={0}
                    childState
                    component={CustomInput}
                    name="name"
                    placeholder="Full Name"
                  />
                  <TextRegular style={styles.headerText}>Email</TextRegular>
                  <Field
                    key={1}
                    keyboardType="email-address"
                    component={CustomInput}
                    name="email"
                    placeholder="Email"
                  />
                  <TextRegular style={styles.headerText1}>Gender</TextRegular>
                  <Field
                    key={2}
                    component={CustomPicker}
                    name="gender"
                    placeholder="gender"
                  />
                  <TextRegular style={styles.headerText2}>Address</TextRegular>
                  <Field
                    key={3}
                    component={CustomInput}
                    name="address"
                    placeholder="Address"
                  />
                  <TextRegular style={styles.headerText}>City</TextRegular>
                  <Field
                    key={4}
                    component={CustomInput}
                    name="city"
                    placeholder="City"
                  />
                  <TextRegular style={styles.headerText}>
                    State/Province
                  </TextRegular>
                  <Field
                    key={5}
                    component={CustomInput}
                    name="state"
                    placeholder="State/Province"
                  />
                  <TextRegular style={styles.headerText}>
                    Phone Number
                  </TextRegular>
                  <Field
                    key={6}
                    keyboardType="number-pad"
                    component={CustomInput}
                    name="mobilenumber"
                    placeholder="3075577654"
                    countryCode="+92"
                  />
                  <TextRegular style={styles.headerText}>Password</TextRegular>
                  <Field
                    key={7}
                    component={CustomInput}
                    setEye={setEye}
                    eye={eye}
                    name="password"
                    placeholder="Password"
                  />
                  <TextRegular style={styles.headerText}>
                    Confirm Password
                  </TextRegular>
                  <Field
                    key={8}
                    component={CustomInput}
                    setEye={setCeye}
                    eye={cEye}
                    name="cpassword"
                    placeholder="Confirm Password"
                  />
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    style={styles.btn}>
                    <TextBold>Sign Up</TextBold>
                  </TouchableOpacity>
                  <View style={styles.signinContainer}>
                    <TextRegular style={styles.commonText}>
                      Already have an account?
                    </TextRegular>
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate('SigninScreen');
                      }}>
                      <TextRegular
                        style={{...styles.commonText, marginTop: wp(2)}}>
                        Sign In Here!
                      </TextRegular>
                      <View style={styles.borderLine} />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Formik>
          </View>
          <Loader visible={authReducer.signInLoader} />
        </KeyboardAwareScrollView>
        <AuthModal
          modalVisible={modalVisible1!}
          text={
            'Oops, Something Wrong. Make sure your phone number and email are unique.'
          }
          imgtype={'red-tick'}
          // buttonStyle={{backgroundColor: colors.secondary}}
          onClose={() => onCloseModal()}
        />
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
    headerText: {
      marginTop: wp(4),
      color: colors.resend,
      fontSize: Platform.OS == 'ios' ? wp(1.2) : wp(1.2),
      marginVertical: hp(1),
    },
    headerText1: {
      marginTop: wp(4),
      color: colors.resend,
      fontSize: Platform.OS == 'ios' ? wp(1.2) : wp(1.2),
      marginBottom: 5,
      // marginVertical: hp(1),
    },
    headerText2: {
      marginTop: wp(0.5),
      color: colors.resend,
      fontSize: Platform.OS == 'ios' ? wp(1.2) : wp(1.2),
      marginBottom: 5,

      // marginVertical: hp(1),
    },
    btn: {
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
      alignSelf: 'center',
      marginTop: wp(9),
      borderRadius: 10,

      width: wp(50),
      ...Platform.select({
        android: {
          height: 45,
        },
        ios: {
          height: 45,
        },
      }),
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
    commonText: {
      fontSize: 4,
      color: colors.secondary,
      marginTop: wp(5),
    },
    title: {
      color: colors.primary,
      fontSize: wp(2),
      marginBottom: wp(1),
    },
  });
export default SignupScreen;
