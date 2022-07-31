import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Container from '../../components/common/Container';
import {hp, wp} from '../../components/common/Responsive';
import {useAppSelector} from '../../hooks';
import {ColorsI} from '../../models';
import Octicons from 'react-native-vector-icons/Octicons';
import Fonts from '../../constant/Fonts';
import {Field, Formik, FormikProps} from 'formik';
//@ts-ignore
import ModalDropdown from 'react-native-modal-dropdown';
//@ts-ignore
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
//@ts-ignore
import CheckBox from 'react-native-check-box';
import TextBold from '../../components/ui/TextBold';
import {ScreenStackHeaderBackButtonImage} from 'react-native-screens';
import {CustomInput} from '../../components/ui/CustomInput';
import TextRegular from '../../components/ui/TextRegular';
import {shipAddress} from '../../helpers/FormValidation';
import shopifyApiService from '../../services/ShopifyApiService';
import Loader from '../../components/ui/Loader';

interface Props {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<
    {
      Params: {};
    },
    'Params'
  >;
}
interface Inputfield {
  fname: string;
  lname: string;
  add1: string;
  add2: string;
  mobilenumber: string;
  city: string;
  zip: string;
  // country: string;
}
const AddAddress = (props: Props) => {
  const formikRef = React.useRef<FormikProps<Inputfield>>(null);
  const [loader, setloader] = useState<boolean>(false);

  const [country, setCountry] = useState<string>('');

  const [Check, setCheck] = useState<boolean>(false);
  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const {colors} = dashboardReducer;
  const styles = useStyles(colors);
  const initialValues: Inputfield = {
    fname: '',
    lname: '',
    add1: '',
    add2: '',
    mobilenumber: '',
    city: '',
    zip: '',
    // country: '',
  };
  const submit = async (values: Inputfield) => {
    setloader(true);
    const newAddressObj = {
      address: {
        address1: values.add1,
        address2: values.add2,
        city: values.city,
        first_name: values.fname,
        last_name: values.lname,
        phone: values.mobilenumber,
        country: 'Pakistan',
        zip: values.zip,
        default: Check,
      },
    };

    const res = await shopifyApiService.createAddress(
      dashboardReducer.shopifyCustomerId!,
      newAddressObj,
    );
    if (res.status == 201) {
      values = {
        fname: '',
        lname: '',
        add1: '',
        add2: '',
        mobilenumber: '',
        city: '',
        zip: '',
        // country: '',
      };
      setloader(false);
      props.navigation.navigate('ShippingAddress');
    } else {
      console.error('error');
      setloader(false);
    }
  };
  return (
    <Container arrow headerTitle="Shipping Address">
      <KeyboardAwareScrollView>
        <View style={styles.Container}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: hp(1),
              marginLeft: Platform.OS == 'android' ? wp(6) : wp(4),
              alignItems: 'center',
            }}>
            <Octicons name="location" size={25} color={'#085A06'} />
            <Text
              style={{
                color: colors.resend,
                fontSize: wp(4.8),
                fontFamily: Fonts.SourceSansBold,
                left: 8,
                fontWeight: '700',
              }}>
              Add Shipping Address
            </Text>
          </View>

          <Formik
            initialValues={initialValues}
            innerRef={formikRef}
            validationSchema={shipAddress}
            onSubmit={values => submit(values)}>
            {({handleSubmit}) => (
              <View style={styles.inputView}>
                <TextRegular style={styles.headerText}>Full Name</TextRegular>
                <Field
                  key={1}
                  // keyboardType="email-address"
                  component={CustomInput}
                  name="fname"
                  placeholder="First Name"
                />
                {/* <TextRegular style={styles.headerText}>Last Name</TextRegular>
                <Field
                  key={2}
                  // keyboardType="email-address"
                  component={CustomInput}
                  name="lname"
                  placeholder="Last Name"
                /> */}
                <TextRegular style={styles.headerText}>Address</TextRegular>
                <Field
                  key={3}
                  // keyboardType="email-address"
                  component={CustomInput}
                  name="add1"
                  placeholder="Address"
                />
                {/* <TextRegular style={styles.headerText}>Address 2</TextRegular>
                <Field
                  key={8}
                  // keyboardType="email-address"
                  component={CustomInput}
                  name="add2"
                  placeholder="Address 2"
                /> */}
                <TextRegular style={styles.headerText}>Phone</TextRegular>
                <Field
                  key={4}
                  keyboardType="phone-pad"
                  component={CustomInput}
                  countryCode="+92"
                  placeholder="3075566654"
                  name="mobilenumber"
                  // placeholder="Phone"
                />
                <TextRegular style={styles.headerText}>City</TextRegular>
                <Field
                  key={5}
                  // keyboardType="email-address"
                  component={CustomInput}
                  name="city"
                  placeholder="City"
                />
                <TextRegular style={styles.headerText}>Zip Code</TextRegular>
                <Field
                  key={6}
                  // keyboardType="email-address"
                  component={CustomInput}
                  name="zip"
                  placeholder="Zip Code"
                />
                <TextRegular
                  style={{
                    marginTop: wp(4),
                    color: colors.resend,
                    marginLeft: wp(
                      Platform.OS == 'android' ? wp(0.1) : wp(-1.5),
                    ),
                    fontSize: wp(1.2),
                    marginBottom: 12,
                  }}>
                  Country
                </TextRegular>
                <View style={styles.dropDownStyle}>
                  <TextRegular style={styles.headerText1}>Pakistan</TextRegular>
                </View>
                {/* <ModalDropdown
                  // options={['Pakistan']}
                  defaultValue={'Pakistan'}
                  dropdownStyle={styles.dropDownStyle}
                  dropdownTextStyle={{
                    fontSize: wp(4),
                    fontWeight: '500',
                    color: 'grey',
                    // fontFamily: 'BebasNeue-Regular',
                  }}
                  hide
                  textStyle={{
                    fontWeight: '500',
                    fontSize: wp(4),
                  }}
                  style={{
                    width: wp(85),
                    borderBottomWidth: 1,
                    alignSelf: 'center',
                    borderColor: '#949494',
                    // height: hp(5),
                  }}
                  onSelect={(index: any, value: any) => {
                    setCountry(value);
                  }}></ModalDropdown> */}
                <CheckBox
                  isChecked={Check}
                  onClick={() => setCheck(!Check)}
                  checkBoxColor="grey"
                  uncheckedCheckBoxColor="grey"
                  rightText={'Default'}
                  rightTextStyle={{
                    color: 'grey',
                    fontSize: wp(4),
                    fontWeight: '600',
                  }}
                  style={styles.checkbox}
                />
                <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
                  <TextBold style={styles.btntext}>Save</TextBold>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
        <Loader visible={loader} />
      </KeyboardAwareScrollView>
    </Container>
  );
};
const useStyles = (color: ColorsI) =>
  StyleSheet.create({
    Container: {
      flex: 1,
      height: hp(80),
      backgroundColor: '#fff',
      borderRadius: 10,
      marginTop: hp(1),
      alignSelf: 'center',
      width: wp(98),
      elevation: 1,
      shadowColor: 'grey',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.8,
      shadowRadius: 1,
    },

    inputView: {
      alignSelf: 'center',
      width: wp(90),
      paddingHorizontal: wp(Platform.OS == 'android' ? 2.5 : 7.8),
      marginTop: hp(2),
    },
    input: {
      // borderWidth: 1,
      width: wp(90),
      // marginVertical: 6,
      borderRadius: 8,
      borderColor: 'grey',
      fontSize: wp(3.5),
      paddingLeft: 8,
    },
    headerText: {
      marginTop: wp(4),
      color: color.resend,
      marginLeft: wp(Platform.OS == 'android' ? wp(0.1) : wp(-1)),
      fontSize: Platform.OS == 'ios' ? wp(1.2) : wp(1.2),
      marginVertical: hp(1),
    },
    headerText1: {
      marginTop: wp(-1.22),
      color: color.resend,
      marginLeft: wp(Platform.OS == 'android' ? wp(0.1) : wp(0.1)),
      fontSize: Platform.OS == 'ios' ? wp(1.2) : wp(1.1),
      bottom: 2,
      // marginVertical: hp(1),
    },
    checkbox: {
      alignSelf: 'flex-start',
      marginTop: 8,
      marginLeft: Platform.OS == 'android' ? -2 : wp(-5.5),
      width: wp(30),
    },
    btn: {
      alignItems: 'center',
      justifyContent: 'center',
      width: wp(90),
      height: hp(6),
      borderRadius: 10,
      backgroundColor: color.secondary,
      alignSelf: 'center',
      marginVertical: 10,
    },
    btntext: {
      color: '#fff',
      fontSize: Platform.OS == 'ios' ? wp(1.3) : wp(1.1),
    },
    dropDownStyle: {
      width: wp(85),
      borderBottomWidth: 1,
      right: 5,
      // height: hp(5),
      borderColor: 'grey',
      alignSelf: 'center',
      left: 0,
      marginTop: 5,
    },
  });
export default AddAddress;
