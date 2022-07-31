import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
//@ts-ignore
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import Container from '../../components/common/Container';
import {hp, wp} from '../../components/common/Responsive';
import TextBold from '../../components/ui/TextBold';
import {useAppSelector} from '../../hooks';
import {ColorsI} from '../../models';
import {cimg, cmap, supalogo} from '../../constant/Images';
import {Formik, Field, FormikProps} from 'formik';
import TextRegular from '../../components/ui/TextRegular';
import {CustomInput} from '../../components/ui/CustomInput';
import LogoWhite from '../../assets/allicons/logo-white.svg';
import deviceInfoModule from 'react-native-device-info';
import {DrawerActions} from '@react-navigation/native';
import DrawerImage from '../../assets/allicons/drawer.svg';
import SupaAuthApiServices from '../../services/SupaAuthApiService';
import Loader from '../../components/ui/Loader';
import {Contactvalid} from '../../helpers/FormValidation';
import AuthModal from '../../components/common/AuthModal';

const {ContactUs} = SupaAuthApiServices;

interface props {
  navigation: any;
  uri?: string | undefined;
}
interface data {
  message: string | undefined;
  statusCode: number | null;
}
interface FormikValues {
  email?: string;
  name?: string;
  message?: string;
}
export default function Contactus(props: props) {
  const formikRef = React.useRef<FormikProps<FormikValues>>(null);
  const [name, setname] = useState<string>('');
  const [email, setemail] = useState<string>('');
  const [modal, setmodal] = useState<boolean>(false);
  const [loader, setloader] = useState<boolean>(false);

  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const authReducer = useAppSelector(State => State.authReducer);
  const {token} = authReducer;

  const {colors} = dashboardReducer;
  const styles = useStyles(colors);

  const values: FormikValues = {
    email: '',
    name: '',
    message: '',
  };
  const contactUs: data = {
    message: '',
    statusCode: null,
  };
  const onClose = () => {
    setmodal(false);
  };
  const emailLink = async (str: string) => {
    await Linking.openURL(str);
  };
  const phoneLink = async (str: string) => {
    await Linking.openURL(str);
  };
  const onSubmit = async (values: FormikValues) => {
    setloader(true);
    var Formdata = new FormData();
    Formdata.append('name', values.name);
    Formdata.append('email', values.email);
    Formdata.append('message', values.message);
    const res = await ContactUs(Formdata, token!);

    if (res.data.statusCode == 200) {
      values = {
        name: '',
        email: '',
        message: '',
      };
      setloader(false),
        setTimeout(() => {
          setmodal(true);
        }, 100);
    } else {
      setloader(false);
    }
  };

  return (
    <Container
      drawer={
        <TouchableOpacity
          style={{
            left: wp(4),
            position: 'absolute',
            top: deviceInfoModule.hasNotch() ? hp(7) : hp(4.5),
            marginTop: Platform.OS == 'ios' ? hp(2.2) : 0,
          }}
          onPress={() => props.navigation.dispatch(DrawerActions.openDrawer())}>
          <DrawerImage width={21} height={21} />
        </TouchableOpacity>
      }
      logo={
        <Image
          style={{
            height: Platform.OS == 'ios' ? hp(7) : hp(5.5),
            width: wp(42),
          }}
          source={supalogo}
        />
      }>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={{width: wp(90), alignSelf: 'center'}}>
            <TouchableOpacity
              style={styles.Home}
              onPress={() => props.navigation.navigate('Home')}>
              <Text style={styles.Htext}>{'<'}</Text>
              <Text style={styles.Htext}>Home</Text>
            </TouchableOpacity>
            <TextBold style={styles.contactus}>Contact us</TextBold>
            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(2),
                width: wp(90),
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.text}>
                Address: Shop#306, Y Block Commercial, DHA Phase III, Lahore,
                Pakistan.
              </Text>
              <Image style={{height: 100, width: 145}} source={cimg} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: wp(46),
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: wp(4),
                  color: '#575757',
                }}>
                Email:
              </Text>
              <TouchableOpacity
                onPress={() => emailLink('mailto:support@supa.pk')}
                style={{
                  justifyContent: 'center',
                  borderColor: colors.secondary,
                }}>
                <Text
                  style={{
                    color: colors.secondary,
                    fontSize: wp(4),
                  }}>
                  support@supa.pk
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: wp(66),
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: wp(4),
                  marginVertical: hp(0.5),
                  color: '#575757',
                }}>
                Call/Whatsapp:
              </Text>
              <TouchableOpacity
                onPress={() => phoneLink('tel:(+92) 3111 787 222')}
                style={{
                  justifyContent: 'center',
                  // borderBottomWidth: 1,
                  borderColor: colors.secondary,
                }}>
                <Text
                  style={{
                    color: colors.secondary,
                    fontSize: wp(4),
                  }}>
                  (+92) 3111 787 222
                </Text>
              </TouchableOpacity>
            </View>
            <Image
              style={{
                height: 150,
                width: 250,
                borderRadius: 15,
                alignSelf: 'center',
                marginVertical: wp(3),
              }}
              source={cmap}
            />
          </View>
          <Formik
            initialValues={values}
            innerRef={formikRef}
            validationSchema={Contactvalid}
            onSubmit={value => onSubmit(value)}>
            {({handleSubmit}) => (
              <View style={styles.InputView}>
                <TextRegular style={styles.headerText}>Name</TextRegular>
                <Field
                  key={1}
                  // keyboardType="email-address"
                  component={CustomInput}
                  name="name"
                  placeholder="John De"
                  // placeholder="knlkn"
                />

                <TextRegular style={styles.headerText}>Email</TextRegular>

                <Field
                  key={2}
                  keyboardType="email-address"
                  component={CustomInput}
                  name="email"
                  placeholder="John@supa.pk"
                />
                <TextRegular style={styles.headerText}>Message</TextRegular>
                <Field
                  key={3}
                  keyboardType="email-address"
                  component={CustomInput}
                  name="message"
                  placeholder="Message"
                />
                <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                  <TextBold style={{fontSize: wp(1.3)}}>Send</TextBold>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
        <Loader visible={loader} />
        <AuthModal
          modalVisible={modal}
          text="message sent succecfuly"
          imgtype="green-tick"
          onClose={onClose}
        />
      </View>
    </Container>
  );
}
const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    container: {
      width: wp(100),
      alignSelf: 'center',
      flex: 1,
      backgroundColor: '#fff',
    },
    Home: {
      flexDirection: 'row',
      marginTop: wp(6),
      width: wp(16.5),
      // marginLeft: wp(4),
      borderColor: colors.secondary,
      justifyContent: 'space-between',
    },
    Htext: {
      color: colors.secondary,
      fontSize: wp(4.5),
      fontWeight: '400',
    },
    contactus: {
      fontSize: wp(2.5),
      color: colors.primary,
      marginTop: wp(3),
    },
    text: {
      width: wp(55),
      color: '#575757',
      fontSize: wp(4),
    },

    InputView: {
      alignSelf: 'center',
      width: wp(90),
      paddingHorizontal: wp(Platform.OS == 'android' ? 2.5 : 7.8),
    },
    input: {
      borderBottomWidth: 1,
      fontSize: wp(4.5),
      borderColor: '#707070',
    },
    headerText: {
      marginTop: wp(2.5),
      color: colors.resend,
      marginLeft: wp(Platform.OS == 'android' ? wp(0.2) : wp(0.8)),
      fontSize: Platform.OS == 'ios' ? wp(1.2) : wp(1),
      marginVertical: hp(1),
    },

    btn: {
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      width: wp(35),
      ...Platform.select({
        android: {
          height: 45,
        },
        ios: {
          height: 45,
        },
      }),
      marginTop: wp(10),
      alignSelf: 'flex-end',
      borderRadius: 10,
    },
  });
