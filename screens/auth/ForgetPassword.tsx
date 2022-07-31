import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
//@ts-ignore
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import Container from '../../components/common/Container';
import TextRegular from '../../components/ui/TextRegular';
import {Formik, Field} from 'formik';
import {resetPasswordValidation} from '../../helpers/FormValidation';
import {CustomInput} from '../../components/ui/CustomInput';
import {hp, wp} from '../../components/common/Responsive';
import TextBold from '../../components/ui/TextBold';
import AuthModal from '../../components/common/AuthModal';
import {useAppSelector} from '../../hooks';
import {ColorsI} from '../../models';
import Loader from '../../components/ui/Loader';
import shopifyApiService from '../../services/ShopifyApiService';
import supaAuthApiService from '../../services/SupaAuthApiService';
import {RouteProp} from '@react-navigation/native';
import {navigate} from '../../helpers/NavigationService';
import LogoWhite from '../../assets/allicons/logo-white.svg';
import deviceInfoModule from 'react-native-device-info';
import {supalogo} from '../../constant/Images';

interface Props {
  navigation: any;
  route: RouteProp<
    {params: {id: number; sendOtp: string; selectField: string}},
    'params'
  >;
}
interface FormikValues {
  password: string;
  cpassword: string;
}

export default function ForgetPassword(props: Props) {
  const [eye, setEye] = useState<boolean>(false);
  const [ceye, setcEye] = useState<boolean>(false);

  const [modalVisible, setmodalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const {colors} = dashboardReducer;
  const styles = useStyles(colors);
  const formikRef = React.useRef(null);
  const initialValues: FormikValues = {
    password: '',
    cpassword: '',
  };
  const onCloseModal = () => {
    setmodalVisible(false);
  };
  const submit = async (values: FormikValues) => {
    setLoading(true);
    const formData: FormData = new FormData();
    formData.append('password', values.password);
    formData.append('password_confirmation', values.cpassword);
    try {
      const res = await supaAuthApiService.resetPassword(
        formData,
        props.route.params.id,
      );

      if ((res.data.statusCode = 200)) {
        setLoading(false);
        props.navigation.navigate('SigninScreen');
      } else {
        setLoading(false);
        console.warn('something went wrong', res);
      }
    } catch (error) {
      console.warn('something went wrong', error);
      setLoading(false);
    }
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
      <KeyboardAwareScrollView automaticallyAdjustContentInsets={true}>
        <Text style={styles.FPtext}> Forget Password</Text>
        <View
          style={{
            flex: 1,
          }}>
          <Formik
            validationSchema={resetPasswordValidation}
            initialValues={initialValues}
            innerRef={formikRef}
            onSubmit={values => submit(values)}>
            {({handleSubmit}) => (
              <View style={styles.InputView}>
                <TextRegular style={styles.headerText}>
                  Enter New Password
                </TextRegular>
                <Field
                  key={1}
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
                  key={2}
                  component={CustomInput}
                  setEye={setcEye}
                  eye={ceye}
                  name="cpassword"
                  placeholder="Confirm Password"
                />
                <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
                  <TextBold>Reset Password</TextBold>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.SignInbtn}>
                  <TextBold style={{color: colors.primary}}>Sign In</TextBold>
                </TouchableOpacity> */}
              </View>
            )}
          </Formik>
          <AuthModal
            modalVisible={modalVisible}
            text={'Password Updated Successfully.'}
            imgtype="green-tick"
            onClose={() => onCloseModal()}
          />
          <Loader visible={loading} />
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
}
const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    FPtext: {
      left: wp(6),
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: wp(4),
      marginTop: hp(5),
    },
    InputView: {
      alignSelf: 'center',
    },
    headerText: {
      marginTop: wp(4),
      color: colors.resend,
      marginLeft: Platform.OS == 'android' ? wp(0.8) : 0,
      fontSize: Platform.OS == 'ios' ? wp(1.2) : wp(1.2),
      marginVertical: hp(1),
    },
    btn: {
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      width: wp(55),
      ...Platform.select({
        android: {
          height: 45,
        },
        ios: {
          height: 45,
        },
      }),
      marginTop: wp(12),
      alignSelf: 'center',
      borderRadius: 10,
    },
    SignInbtn: {
      // backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      width: wp(55),
      ...Platform.select({
        android: {
          height: 45,
        },
        ios: {
          height: 45,
        },
      }),
      marginTop: wp(7),
      alignSelf: 'center',
      borderRadius: 10,
    },
    text: {
      fontSize: wp(4),
      width: wp(85),
      alignSelf: 'center',
      color: colors.title,
      marginTop: hp(3),
    },
  });
