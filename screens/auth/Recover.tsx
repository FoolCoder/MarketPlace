import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import {Formik, Field, FormikProps} from 'formik';
import {useNavigation} from '@react-navigation/native';

import {StackNavigationProp} from '@react-navigation/stack';
import Container from '../../components/common/Container';
import TextRegular from '../../components/ui/TextRegular';
import {CustomInput} from '../../components/ui/CustomInput';
import {hp, wp} from '../../components/common/Responsive';
import TextBold from '../../components/ui/TextBold';
import AuthModal from '../../components/common/AuthModal';
import {useAppSelector} from '../../hooks';
import {ColorsI} from '../../models';
import {RecoverScehma} from '../../helpers/FormValidation';
import supaAuthApiService from '../../services/SupaAuthApiService';
import {AuthStackI} from '../../navigation/RootStackParams';
import Loader from '../../components/ui/Loader';
import {number, string} from 'yup/lib/locale';
import deviceInfoModule from 'react-native-device-info';
import LogoWhite from '../../assets/allicons/logo-white.svg';
import {supalogo} from '../../constant/Images';

interface FormikValues {
  email: string;
  phoneNum: string;
}

type Props = StackNavigationProp<AuthStackI, 'ForgotPassword'>;

const ForgetPassword: React.FC<Props> = () => {
  const [modalVisible, setmodalVisible] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<AuthStackI>>();
  const formikRef = React.useRef<FormikProps<FormikValues>>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [flag, setflag] = React.useState<boolean>(false);

  const [userId, setUserId] = React.useState<number | undefined>(undefined);
  const [phoneNum, setphoneNum] = useState<string>('');
  const [sField, setsField] = useState<string | undefined>(undefined);
  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const {colors} = dashboardReducer;
  const styles = useStyles(colors);
  useEffect(() => {}, [phoneNum]);
  const password: FormikValues = {
    email: '',
    phoneNum: '',
  };
  const onCloseModal = () => {
    setmodalVisible(false);
    navigation.navigate('VerifyOtp', {
      id: userId!,
      sendOtp: phoneNum,
      selectField: sField,
      screenFlag: true,
      flag,
    } as any);
  };

  const onSubmit = async (values: FormikValues) => {
    type selectedField = 'phone' | 'email' | undefined;

    let selectedField: selectedField = undefined;

    if (values.email == '' && values.phoneNum == '') {
      Alert.alert('One Field is Required');
    } else if (values.email != '' && values.phoneNum != '') {
      Alert.alert('only one field required');
    } else {
      const formData: FormData = new FormData();
      if (values.phoneNum) {
        setphoneNum(values.phoneNum);
        setflag(true);
        formData.append('recover_phone', '+92' + values.phoneNum);
        selectedField = 'phone';
      } else if (values.email) {
        setphoneNum(values.email);
        setflag(false);
        formData.append('recover_email', values.email.toLowerCase());
        selectedField = 'email';
      }

      setsField(selectedField);
      setLoading(true);
      try {
        const res = await supaAuthApiService.RecoverPassword(
          formData,
          selectedField!,
        );
        console.log(res);

        if (res.data.statusCode == 200) {
          setLoading(false);
          setTimeout(() => {
            setmodalVisible(true);
          }, 500);
          setUserId(res.data.data?.id);
        } else {
          if (selectedField == 'email') {
            Alert.alert(res.data?.error!);
          } else {
            Alert.alert(res.data?.error!);
          }
          setLoading(false);
        }
      } catch (error) {
        console.log('error', error);
        setLoading(false);
      }
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
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Text style={styles.FPtext}> Forget Password</Text>
        <Loader visible={loading} />

        <Formik
          initialValues={password}
          innerRef={formikRef}
          validationSchema={RecoverScehma}
          onSubmit={values => onSubmit(values)}>
          {({handleSubmit, handleChange}) => (
            <View style={styles.InputView}>
              <TextRegular style={styles.headerText}>
                Recover by Email
              </TextRegular>
              <Field
                key={2}
                component={CustomInput}
                name="email"
                placeholder="John@supa.pk"
              />
              <Text style={styles.Or}>OR</Text>
              <TextRegular style={styles.headerText}>
                Recover by Phone
              </TextRegular>
              <Field
                key={5}
                component={CustomInput}
                name="phoneNum"
                countryCode="+92"
              />

              <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                <TextBold>Recover Password</TextBold>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('SigninScreen')}
                style={styles.SignInbtn}>
                <TextBold style={{color: colors.secondary}}>Sign In</TextBold>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <View style={styles.signinContainer}>
          <TextRegular style={styles.commonText}>
            Don't have an account?
          </TextRegular>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignupScreen');
            }}>
            <TextRegular style={{...styles.commonText, marginTop: wp(2)}}>
              Sign Up Now!
            </TextRegular>
            <View style={styles.borderLine} />
          </TouchableOpacity>
        </View>
        <AuthModal
          modalVisible={modalVisible}
          text={
            'A verification code has been sent to your Phone/email address. '
          }
          imgtype="green-tick"
          buttonStyle={{backgroundColor: colors.secondary}}
          onClose={() => onCloseModal()}
        />
      </View>
    </Container>
  );
};
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
      marginLeft: wp(Platform.OS == 'android' ? 1 : 0),
      fontSize: Platform.OS == 'ios' ? wp(1.2) : wp(1.2),
      marginVertical: hp(1),
    },
    Or: {
      marginTop: hp(4),
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
      marginTop: wp(15),
      alignSelf: 'center',
      borderRadius: 10,
    },
    SignInbtn: {
      // backgroundColor: colors.secondary,
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
      marginTop: wp(5),
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
    signinContainer: {
      width: wp(80),
      alignItems: 'flex-start',
      marginTop: wp(5),
      left: wp(6),
    },
    commonText: {
      fontSize: 4,
      color: colors.secondary,
      marginTop: wp(6),
      // fontWeight: 'bold',
    },
    borderLine: {
      borderBottomWidth: 1,
      borderColor: colors.secondary,
    },
  });
export default ForgetPassword;
