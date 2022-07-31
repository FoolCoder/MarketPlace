import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Alert,
  Image,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {hp, wp} from '../../components/common/Responsive';
import TextRegular from '../../components/ui/TextRegular';
import TextBold from '../../components/ui/TextBold';
import Container from '../../components/common/Container';
import AuthModal from '../../components/common/AuthModal';
import {useAppSelector} from '../../hooks';
import {ColorsI} from '../../models';
import supaAuthApiService from '../../services/SupaAuthApiService';
const {signinUser} = supaAuthApiService;
import LogoWhite from '../../assets/allicons/logo-white.svg';
import {ShopifyAcessToken} from '../../services/GraphQLApi';

import Loader from '../../components/ui/Loader';
import deviceInfoModule from 'react-native-device-info';
import {useDispatch} from 'react-redux';
import {supalogo} from '../../constant/Images';

interface Props {
  navigation: any;
  route: RouteProp<
    {
      params: {
        id: number;
        sendOtp: string;
        selectField: string;
        screenFlag: boolean;
        flag: boolean;
        formikRef: any;
        navigation: any;
        email: any;
        passward: any;
      };
    },
    'params'
  >;
}

const VerifyOtp: React.FC<Props> = ({navigation, route}) => {
  const inputRef = useRef(null);
  const [otp, setOtp] = useState<string | undefined>(undefined);
  const [modalVisible, setmodalVisible] = useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [userId, setuserId] = useState<number | string>();
  const [textt, setText] = useState<string>('');
  const [imgt, setimgT] = useState<string>('');
  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const {colors} = dashboardReducer;
  const styles = useStyles(colors);
  const dispatch = useDispatch();
  useEffect(() => {
    setuserId(route?.params?.id);
  });
  function errorFunction() {
    setTimeout(() => {
      setmodalVisible(true);
    }, 300);
  }

  const sendOtp = async (code: string | undefined) => {
    if (code == undefined || code.length != 4) {
      setText('Wrong/Empty Otp Entered.');
      setimgT('red-tick');
      setmodalVisible(true);
    } else {
      setLoading(true);
      const formData: FormData = new FormData();
      formData.append('confirm_code', code);
      formData.append('user_id', userId);
      try {
        const res = await supaAuthApiService.VerifyOtp(formData);

        if (res.data.statusCode == 200) {
          setLoading(false);
          supaAuthApiService.setAuth(res.data.token!);
          if (route.params.screenFlag) {
            navigation.navigate('ForgotPassword', {id: userId!});
          } else {
            const formData: FormData = new FormData();
            formData.append('email', route.params.email);
            formData.append('password', route.params.passward);
            ShopifyAcessToken(route.params.email, route.params.passward);
            dispatch(
              signinUser(
                formData,
                route.params.formikRef,
                route.params.navigation,
                route.params.email,
              ),
            );
            // navigation.navigate('HomeTabs');
          }
        } else {
          setLoading(false);
          setText('Invalid Code Entered.');
          setimgT('red-tick');
          errorFunction();
        }
      } catch (error) {
        console.warn('somthing went wrong', error);
        setLoading(false);
        setText('Something went wrong.');
        setimgT('red-tick');
        errorFunction();
      }
    }
  };
  const resendOtp = async () => {
    type selectedField = 'phone' | 'email' | undefined;

    let selectedField: selectedField = undefined;

    const formData: FormData = new FormData();
    if (route.params.selectField == 'phone') {
      formData.append('phone', '+92' + route.params.sendOtp);
      selectedField = 'phone';
    } else if (route.params.selectField == 'email') {
      formData.append('email', route.params.sendOtp.toLowerCase());
      selectedField = 'email';
    }
    setLoading(true);

    const res = await supaAuthApiService
      .reSendOtp(formData, selectedField!)
      .catch(err => {
        setLoading(false);
        console.log(err);
      });

    if (res?.status == 200) {
      setTimeout(() => {
        setmodalVisible(true);
      }, 500);
      setText('A verification code has been sent to your Phone/email address.');
      setimgT('green-tick');
      setLoading(false);
    }
    setLoading(false);
  };
  const onCloseModal = () => {
    setmodalVisible(false);
  };

  return (
    <Container
      headerTitle=""
      logo={
        <Image style={{height: hp(5.5), width: wp(42)}} source={supalogo} />
      }>
      <>
        <Text style={styles.title}>Verify Code</Text>
        <TextRegular style={styles.text1}>
          A verification code has been sent to your Phone/email address.
        </TextRegular>
        <TextRegular style={styles.text}>Please enter Code sent to</TextRegular>
        <View style={styles.numberView}>
          <Text style={styles.number}>
            {route.params.screenFlag
              ? route.params.flag
                ? `+92 ${route.params.sendOtp}`
                : ` ${route.params.sendOtp}`
              : `${route.params.email}\n +92${route.params.sendOtp}`}
          </Text>
          {/* <TouchableOpacity
            onPress={() => {
              Alert.alert('Change nunber');
            }}>
            <TextRegular style={styles.changeNum}>
              Change Phone number
            </TextRegular>
            <View style={styles.borderLine} />
          </TouchableOpacity> */}
        </View>
        <OTPInputView
          ref={inputRef}
          style={styles.OtpView}
          pinCount={4}
          // editable
          autoFocusOnLoad={false}
          keyboardAppearance="light"
          onCodeChanged={code => {
            setOtp(code);
          }}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={code => {
            sendOtp(code);
          }}
        />
        <TouchableOpacity style={styles.continue} onPress={() => sendOtp(otp)}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resend} onPress={() => resendOtp()}>
          <Text style={styles.resendText}>Resend Code</Text>
        </TouchableOpacity>
        <AuthModal
          modalVisible={modalVisible}
          text={textt}
          imgtype={imgt}
          onClose={() => onCloseModal()}
        />
        <Loader visible={loading} />
      </>
    </Container>
  );
};
export default VerifyOtp;
const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    Container: {
      flex: 1,
      backgroundColor: colors.secondary,
    },
    title: {
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: wp(7),
      marginLeft: wp(3),
      marginTop: hp(6),
    },
    numberView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: wp(90),
    },
    text: {
      marginTop: hp(3),
      marginLeft: wp(3),
      color: '#605a65',
    },
    text1: {
      marginTop: hp(1),
      marginLeft: wp(3),
      color: '#605a65',
      width: wp(90),
    },
    number: {
      marginLeft: wp(3),
      color: '#34283e',
      fontWeight: 'bold',
    },
    changeNum: {
      // marginLeft: wp(3),

      fontSize: wp(0.8),
      color: '#34283e',
      borderBottomColor: '#000',
    },
    OtpView: {
      width: wp(65),
      height: hp(15),
      alignSelf: 'center',
    },
    underlineStyleBase: {
      // width: 40,
      // height: 45,
      borderWidth: 0,
      borderBottomWidth: 2,
      borderBottomColor: colors.secondary,
      fontWeight: 'bold',
      fontSize: wp(5),
      color: '#605a65',
      justifyContent: 'center',
    },

    underlineStyleHighLighted: {
      borderColor: '#03DAC6',
    },
    continue: {
      justifyContent: 'center',
      width: wp(65),
      height: hp(7),
      backgroundColor: colors.secondary,
      borderRadius: 7,
      alignItems: 'center',
      alignSelf: 'center',
    },
    continueText: {
      color: '#ffff',
      fontWeight: 'bold',
      fontSize: wp(4),
    },

    resend: {
      justifyContent: 'center',
      width: wp(60),
      height: hp(6),
      alignItems: 'center',
      alignSelf: 'center',
    },
    resendText: {
      color: colors.resend,
      fontWeight: 'bold',
      fontSize: wp(4),
    },
    borderLine: {
      height: 2,
      borderColor: colors.secondary,
    },
  });
