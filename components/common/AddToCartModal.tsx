import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import {wp} from './Responsive';
import TextBold from '../ui/TextBold';
import TextRegular from '../ui/TextRegular';
import {useAppSelector} from '../../hooks';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

interface ModalProps {
  visible: boolean;
  content?: string | undefined;
  closeCartModal: () => void;
  navigation: NavigationProp<ParamListBase>;
}

const AddToCartModal = (props: ModalProps) => {
  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const {colors} = dashboardReducer;

  return (
    <Modal
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onBackdropPress={props.closeCartModal}
      isVisible={props.visible}
      animationIn={'bounceIn'}
      animationOut={'fadeOut'}
      animationInTiming={500}
      animationOutTiming={500}>
      <View style={styles.cartContainer}>
        <LottieView
          style={styles.lottie}
          source={require('../../assets/lottie/success.json')}
          onAnimationFinish={() => props.closeCartModal()}
          loop={false}
          autoPlay
        />
        <TextBold style={{color: 'black', marginTop: wp(8), fontSize: 5}}>
          Item added to your cart.
        </TextBold>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Cart');
            props.closeCartModal;
          }}
          style={[styles.btn, {borderColor: colors.secondary}]}>
          <TextRegular style={{...styles.text, color: colors.secondary}}>
            Go To the Cart
          </TextRegular>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AddToCartModal;

const styles = StyleSheet.create({
  lottie: {
    width: wp(30),
    height: wp(30),
  },
  cartContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: wp(70),
    height: wp(70),
    alignItems: 'center',
  },
  text: {
    color: 'black',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: wp(12),
    paddingHorizontal: wp(3),
    borderWidth: 2,
    marginVertical: wp(5),
    borderRadius: 5,
  },
});
