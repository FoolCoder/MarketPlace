import {RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
//@ts-ignore
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  launchCamera,
} from 'react-native-image-picker';

import Container from '../../components/common/Container';
import {hp, wp} from '../../components/common/Responsive';
import TextBold from '../../components/ui/TextBold';
import {useAppSelector} from '../../hooks';
import {ColorsI} from '../../models';
import Fonts from '../../constant/Fonts';
import TextRegular from '../../components/ui/TextRegular';
import {supalogo} from '../../constant/Images';
import ProfileImg from '../../assets/allicons/icon3.svg';
import {Field, Formik, FormikProps} from 'formik';
import {
  CustomInput,
  CustomPicker,
} from '../../components/ui/CustomInputForEditProfile';
import ImagePickerModal from '../../components/ui/ImagePickerModal';
import SupaAuthApiService from '../../services/SupaAuthApiService';
import ChangePassward from '../../components/common/ChangePassward';
import {useDispatch} from 'react-redux';
import Loader from '../../components/ui/Loader';
import AuthModal from '../../components/common/AuthModal';
import {checkFakeNumber} from '../../utils';
import FastImage from 'react-native-fast-image';
const {UpdateUser} = SupaAuthApiService;
interface Props {
  navigation: any;
  route: RouteProp<{
    Params: {};
  }>;
}
interface Inputfield {
  fullname: string | undefined;
  // email: string;
  gender: string | undefined;
  address: string | undefined;
  city: string | undefined;
  state: string | undefined;
  mobilenumber: string | undefined;
  Email: string | undefined;
}
interface pics {
  name: string;
  uri: string;
  type: string;
}
const EditProfile = (props: Props) => {
  const dispatch = useDispatch();
  const formikRef = React.useRef<FormikProps<Inputfield>>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [loader, setloader] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisible1, setModalVisible1] = useState<boolean>(false);

  const [pic, setpic] = useState<pics[]>([]);
  const [modalVisible2, setmodalVisible2] = useState<boolean>();

  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const authReducer = useAppSelector(State => State.authReducer);
  const {token, user} = authReducer;
  const {colors} = dashboardReducer;
  const styles = useStyles(colors);

  const initialValues: Inputfield = {
    fullname: user?.name ?? undefined,
    Email: user?.email ?? undefined,
    gender: user?.gender ?? undefined,
    address: user?.address! ?? undefined,
    mobilenumber:
      user?.phone!.replace('+92', '').replace('92', '') ?? undefined,
    city: user?.city! ?? undefined,

    state: user?.state ?? undefined,
  };

  const openImagePicker = () => {
    setpic([]);
    var options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else {
        response.assets?.map(e => {
          setpic((prev: any) => {
            return [...prev, {uri: e.uri, name: e.fileName, type: e.type}];
          });
        });
      }
    }).then(() => setModalVisible(false));
  };

  const openCamera = async () => {
    setpic([]);
    var options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    try {
      launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.error(response.errorMessage, 'error Maessage');
        } else {
          response.assets?.map(e => {
            setpic((prev: any) => {
              return [...prev, {uri: e.uri, name: e.fileName, type: e.type}];
            });
          });
        }
      }).then(() => setModalVisible(false));
    } catch (err) {
      console.warn(err);
    }
  };
  const Submit = async (values: Inputfield) => {
    setloader(true);
    const formData = new FormData();
    formData.append('name', values.fullname);
    formData.append('email', values.Email);

    {
      user?.is_social == 1 && checkFakeNumber == user.phone?.slice(4, 9)
        ? formData.append('phone', '+92' + values.mobilenumber)
        : null;
    }
    formData.append('gender', values.gender);
    formData.append('city', values.city);
    formData.append('state', values.state);
    formData.append('address', values.address);
    formData.append('is_social', user?.is_social);

    {
      pic.length == 0 ? null : formData.append('avatar', pic[0]);
    }

    dispatch(UpdateUser(formData, user?.id, token, formikRef));

    if (formikRef.current?.errors.mobilenumber) {
      setloader(false);
      return;
    } else {
      setTimeout(
        () => {
          setloader(false);
        },
        pic.length > 0 ? 5000 : 2000,
      );
      setTimeout(
        () => {
          setmodalVisible2(true);
        },
        pic.length > 0 ? 6500 : 2500,
      );
    }
  };
  const onClose = () => {
    setModalVisible1(!modalVisible1);
  };
  const onCloseModal = () => {
    setmodalVisible2(!modalVisible2);
    // props.onClose(!props.modalVisible);c
  };

  return (
    <Container
      arrowp
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
          <View style={styles.viewContainer}>
            <Text style={styles.title}>Update Profile</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignSelf: 'flex-end',
                right: 5,
                top: hp(4),
              }}>
              <TextRegular style={styles.text}>Profile Pic</TextRegular>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                {user?.avatar || pic.length > 0 ? (
                  <FastImage
                    style={{
                      width: wp(25),
                      height: Platform.OS == 'ios' ? hp(15) : hp(12),
                      borderRadius: 8,
                    }}
                    source={{
                      uri: pic.length > 0 ? pic[0].uri : user?.avatar,
                      priority: FastImage.priority.high,
                    }}
                  />
                ) : (
                  <ProfileImg width={wp(25)} height={hp(15)} />
                )}
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={initialValues}
              innerRef={formikRef}
              // validationSchema={editProfile}
              onSubmit={values => Submit(values as any)}>
              {({handleSubmit}) => (
                <View>
                  <TextRegular style={styles.headerText}>Full Name</TextRegular>
                  <Field
                    key={1}
                    // keyboardType="email-address"
                    // value={user?.name}
                    defaultValue={user?.name}
                    edit={true}
                    setedit={setEdit}
                    component={CustomInput}
                    name="fullname"
                    placeholder="First Name"
                  />
                  <TextRegular style={styles.headerText}>Email</TextRegular>
                  <Field
                    key={2}
                    keyboardType="email-address"
                    value={user?.email}
                    component={CustomInput}
                    name="Email"
                    placeholder="Email"
                  />
                  <TextRegular style={styles.headerText1}>Gender</TextRegular>
                  <Field
                    key={3}
                    // keyboardType="email-address"
                    component={CustomPicker}
                    // value={user?.gender}
                    name="gender"
                    placeholder="Gender"
                  />
                  <Text
                    style={[
                      styles.headerText,
                      {marginTop: hp(0), fontSize: wp(4.2), fontWeight: '400'},
                    ]}>
                    Address
                  </Text>
                  <Field
                    key={8}
                    // keyboardType="email-address"
                    defaultValue={
                      user?.address != 'undefined' ? user?.address : ''
                    }
                    component={CustomInput}
                    name="address"
                    placeholder="Address"
                  />
                  <TextRegular style={styles.headerText}>City</TextRegular>
                  <Field
                    key={11}
                    defaultValue={user?.city == 'undefined' ? '' : user?.city!}
                    component={CustomInput}
                    name="city"
                    placeholder="City"
                  />
                  <TextRegular style={styles.headerText}>
                    State/Province
                  </TextRegular>
                  <Field
                    key={9}
                    component={CustomInput}
                    name="state"
                    placeholder="State/Province"
                    defaultValue={
                      user?.state == 'undefined' || user?.state == 'null'
                        ? ''
                        : user?.state
                    }
                  />
                  <TextRegular style={styles.headerText}>Phone</TextRegular>
                  <Field
                    key={4}
                    countryCode="+92"
                    keyboardType="phone-pad"
                    component={CustomInput}
                    name="mobilenumber"
                    // maxLength={10}
                    defaultValue={
                      user?.phone!.slice(4, 9) == checkFakeNumber
                        ? ''
                        : initialValues.mobilenumber
                    }

                    // placeholder="Phone"
                  />

                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    style={styles.btn}>
                    <TextBold style={styles.btntext}>Save</TextBold>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
          {user?.is_social == 1 ? null : (
            <TouchableOpacity
              onPress={() => setModalVisible1(true)}
              style={styles.btn}>
              <TextBold style={styles.btntext}>Change Passward</TextBold>
            </TouchableOpacity>
          )}
          <ChangePassward modalVisible={modalVisible1} onClose={onClose} />
          <ImagePickerModal
            visible={modalVisible}
            closeModal={() => setModalVisible(false)}
            chooseImage={() => openImagePicker()}
            openCamera={() => openCamera()}
          />
        </KeyboardAwareScrollView>
        <Loader visible={loader} />
        <AuthModal
          modalVisible={modalVisible2!}
          text={'Profile Updated Successfully'}
          imgtype={'green-tick'}
          // buttonStyle={{backgroundColor: colors.secondary}}
          nav={true}
          onClose={() => onCloseModal()}
          navgation={props.navigation}
        />
      </>
    </Container>
  );
};

const useStyles = (color: ColorsI) =>
  StyleSheet.create({
    Container: {
      flex: 1,
    },
    innerView: {
      width: wp(95),
      alignSelf: 'center',
      marginTop: 8,
      flex: 1,
    },
    title: {
      color: color.primary,
      fontSize: wp(8),
      fontFamily: Fonts.SourceSansItalic,
      fontWeight: '700',
      left: Platform.OS == 'android' ? -8 : 0,
    },
    text: {
      color: '#707070',
      right: 15,
      fontWeight: '600',
      fontSize: wp(1.2),
      top: Platform.OS == 'ios' ? 10 : 15,
    },
    InputView: {
      alignSelf: 'center',
      width: wp(90),
    },
    input: {
      borderBottomWidth: 1,
      fontSize: wp(4.5),
      borderColor: '#707070',
    },

    headerText: {
      marginTop: wp(4),
      color: color.resend,
      marginVertical: hp(1),
      fontSize: Platform.OS == 'ios' ? wp(1.2) : wp(1.2),
      left: Platform.OS == 'android' ? 4 : -2,
    },
    headerText1: {
      marginTop: wp(4),
      color: color.resend,
      marginVertical: hp(1),
      fontSize: Platform.OS == 'ios' ? wp(1.2) : wp(1.2),
      left: 0,
    },
    checkbox: {
      alignSelf: 'flex-start',
      marginTop: 8,
      left: 8,
    },
    btn: {
      alignItems: 'center',
      justifyContent: 'center',
      width: wp(50),
      height: hp(6),
      borderRadius: 10,
      backgroundColor: color.secondary,
      alignSelf: 'center',
      marginVertical: 10,
    },
    btntext: {
      color: '#fff',
      fontSize: Platform.OS == 'ios' ? wp(1.3) : wp(1.2),
    },
    viewContainer: {
      flex: 1,
      paddingHorizontal: wp(Platform.OS == 'android' ? 7.5 : 7.8),

      paddingVertical: wp(2),
    },
  });

export default EditProfile;
