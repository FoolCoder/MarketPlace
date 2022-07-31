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
  nav?: boolean;
  width?: ViewStyle;
  height?: ViewStyle;
  buttonTitle?: string;
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
      }}>
      <View style={styles.centeredView}>
        <Image
          style={styles.img}
          source={props.imgtype == 'green-tick' ? tick : red_tick}
        />

        <View style={styles.modalView}>
          <Text style={[styles.text]}>{props?.text}</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              if (props.nav) {
                props.navgation?.goBack();

                props.onClose(!props.modalVisible);
              } else {
                props.onClose(!props.modalVisible);
              }
            }}>
            {props.buttonTitle ? (
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                }}>
                {props.buttonTitle}
              </Text>
            ) : (
              <TextBold>OK</TextBold>
            )}
          </TouchableOpacity>
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
          height: 'auto',
        },
        android: {
          height: 'auto',
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
      width: wp(70),
      height: 'auto',
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
      top: wp(2),

      alignSelf: 'center',
      borderRadius: 10,
    },
  });

export default AuthModal;
