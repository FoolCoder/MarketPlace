import {Field, Formik, FormikProps} from 'formik';
import React, {useState} from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {editProfile, updatePass} from '../../helpers/FormValidation';
import {useAppSelector} from '../../hooks';
import {ColorsI} from '../../models';
import {CustomInput} from '../ui/CustomInput';
import TextBold from '../ui/TextBold';
import TextRegular from '../ui/TextRegular';
import {hp, wp} from './Responsive';
import supaAuthApiServices from '../../services/SupaAuthApiService';
import Loader from '../ui/Loader';
import AuthModal from './AuthModal';
const {ChanePass} = supaAuthApiServices;
interface Props {
  modalVisible?: boolean;
  onClose: (e: boolean) => void;
}
interface Inputfield {
  password: string;
  npassword: string;
  cpassword: string;
}
const ChangePassward = (props: Props) => {
  const formikRef = React.useRef<FormikProps<Inputfield>>(null);

  const [eye, setEye] = useState<boolean>(false);
  const [cEye, setceye] = useState<boolean>(false);
  const [nEye, setneye] = useState<boolean>(false);
  const [loader, setloader] = useState<boolean>(false);
  const [modalVisible1, setmodalVisible1] = useState<boolean>();
  const [text, settext] = useState<string>('');
  const [imgtype, setimgtype] = useState<string>('');

  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const authReducer = useAppSelector(state => state.authReducer);
  const {user} = authReducer;

  const {colors} = dashboardReducer;
  const styles = useStyles(colors);
  const initialValues: Inputfield = {
    password: '',
    cpassword: '',
    npassword: '',
  };
  const {modalVisible, onClose} = props;
  const onSubmit = async (values: any) => {
    setloader(true);
    const formData = new FormData();
    formData.append('old_password', values.password);
    formData.append('password', values.npassword);
    formData.append('password_confirmation', values.cpassword);
    const res = await ChanePass(formData, user!.id);
    if (res?.data.statusCode == 200) {
      setloader(false);
      settext('Password Updated Successfully');
      setimgtype('green-tick');
      setTimeout(() => {
        setmodalVisible1(true);
      }, 2000);
    } else {
      if (res.data.error.old_password) {
        settext('The old password and new password must be different');
      } else {
        settext('Your old Passward is Wrong');
      }
      setloader(false);
      setimgtype('red-tick');

      setTimeout(() => {
        setmodalVisible1(true);
      }, 2000);
    }
  };
  const onCloseModal = () => {
    setmodalVisible1(!modalVisible1);
    props.onClose(!props.modalVisible);
  };

  return (
    <Modal
      isVisible={props.modalVisible ? props.modalVisible : false}
      onBackdropPress={() => {
        props.onClose(!props.modalVisible);
      }}
      animationIn="zoomInUp"
      animationOut="zoomOutDown"

      // style={{borderWidth: 1, height: hp(70), alignItems: 'center'}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.innerModalView}>
            <TextBold
              style={{
                color: colors.primary,
                textAlign: 'center',
                fontSize: wp(1.5),
                top: hp(-3),
              }}>
              Change Passward
            </TextBold>
            <TouchableOpacity
              onPress={() => {
                props.onClose(!props.modalVisible);
              }}>
              <TextBold
                style={{
                  fontSize: wp(1.5),
                  color: '#000',
                  top: wp(-7),
                  right: -8,
                }}>
                x
              </TextBold>
            </TouchableOpacity>
          </View>
          {/* <Text style={[styles.text]}>{props?.text}</Text> */}
          <Formik
            initialValues={initialValues}
            innerRef={formikRef}
            validationSchema={updatePass}
            onSubmit={values => onSubmit(values)}>
            {({handleSubmit}) => (
              <View>
                {user?.is_social == 0 ? (
                  <>
                    <TextRegular style={styles.headerText}>
                      Old Password
                    </TextRegular>

                    <Field
                      key={1}
                      // keyboardType="email-address"
                      component={CustomInput}
                      name="password"
                      setEye={setEye}
                      eye={eye}
                      placeholder="Old Password"
                    />
                  </>
                ) : null}
                <TextRegular style={styles.headerText}>
                  New Password
                </TextRegular>

                <Field
                  key={6}
                  // keyboardType="email-address"
                  component={CustomInput}
                  name="npassword"
                  setEye={setceye}
                  eye={cEye}
                  placeholder="Confirm Password"
                />
                <TextRegular style={styles.headerText}>
                  Confirm Password
                </TextRegular>

                <Field
                  key={7}
                  // keyboardType="email-address"
                  component={CustomInput}
                  name="cpassword"
                  setEye={setneye}
                  eye={nEye}
                  placeholder="New Password"
                />
                <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                  <TextBold>OK</TextBold>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
      <Loader visible={loader} />
      <AuthModal
        modalVisible={modalVisible1!}
        text={text}
        imgtype={imgtype}
        // buttonStyle={{backgroundColor: colors.secondary}}
        onClose={() => onCloseModal()}
      />
    </Modal>
  );
};
const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    centeredView: {
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
      borderColor: '#000',
      // backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: wp(95),
      ...Platform.select({
        ios: {
          height: 'auto',
        },
        android: {
          height: 'auto',
        },
      }),
    },
    innerModalView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // borderWidth: 1,
      width: wp(65),
      alignSelf: 'flex-end',
    },

    text: {
      textAlign: 'center',
      width: wp(60),
      height: hp(6),
      color: '#605a65',
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
      top: wp(5.5),

      alignSelf: 'center',
      borderRadius: 10,
    },
    headerText: {
      marginTop: wp(4.5),
      color: colors.resend,
      marginVertical: hp(1),
      fontSize: Platform.OS == 'ios' ? wp(1.2) : wp(1.4),
      left: 4,
    },
  });
export default ChangePassward;
