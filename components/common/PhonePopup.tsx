import React from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import {Colors} from '../../constant/Colors';
import TextBold from '../ui/TextBold';
import {hp, wp} from './Responsive';
import {tick, red_tick} from '../../constant/Images';
import {useAppSelector} from '../../hooks';
import {ColorsI} from '../../models';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

interface AuthModal {
  modalVisible: boolean;
  text: string;
  buttonStyle?: ViewStyle;
  onClose: (e: boolean) => void;
  imgtype?: string;
  social?: number | null;
  navgation?: NavigationProp<ParamListBase>;
}
interface props {
  navigation: NavigationProp<ParamListBase>;
}

const AuthModal = (props: AuthModal) => {
  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const {colors} = dashboardReducer;
  const styles = useStyles(colors);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible ? props.modalVisible : false}
      onRequestClose={() => {
        props.onClose(!props.modalVisible);
      }}
      // style={{borderWidth: 1, height: hp(70), alignItems: 'center'}}
    >
      <View style={styles.centeredView}>
        <Image
          style={styles.img}
          source={props.imgtype == 'green-tick' ? tick : red_tick}
        />

        <View style={styles.modalView}>
          <Text style={[styles.text]}>{props?.text}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: wp(65),
              marginBottom: Platform.OS == 'ios' ? 8 : 0,
            }}>
            <TouchableOpacity
              style={[styles.btn, {backgroundColor: undefined}]}
              onPress={() => props.onClose(!props.modalVisible)}>
              <TextBold style={{color: 'grey'}}>Skip</TextBold>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                props.navgation?.navigate('Profile', {
                  screen: 'EditProfile',
                });
                props.onClose(!props.modalVisible);
              }}>
              <TextBold>Update</TextBold>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
      borderColor: '#000',
      backgroundColor: 'rgba(0,0,0,0.5)',
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
      width: wp(80),
      ...Platform.select({
        ios: {
          height: hp(17),
        },
        android: {
          height: hp(19),
        },
      }),
    },
    img: {
      ...Platform.select({
        ios: {
          top: hp(5),
        },
        android: {
          top: hp(6),
        },
      }),
      zIndex: 1,
    },
    text: {
      textAlign: 'center',
      width: wp(60),
      height: hp(6),
      color: '#605a65',
      fontWeight: '600',
      fontSize: wp(4),
    },
    btn: {
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      width: wp(30),
      ...Platform.select({
        android: {
          height: 45,
        },
        ios: {
          height: 45,
        },
      }),
      marginTop: Platform.OS == 'ios' ? wp(1) : wp(3),

      alignSelf: 'center',
      borderRadius: 10,
    },
  });

export default AuthModal;
