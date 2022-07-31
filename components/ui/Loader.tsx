import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import LottieView from 'lottie-react-native';

import Modal from 'react-native-modal';
import {wp} from '../common/Responsive';
import TextRegular from './TextRegular';
interface Props {
  visible: boolean;
  animationOut?: number;
}

function Loader(props: Props) {
  return (
    <View>
      <Modal
        style={styles.modalContainer}
        isVisible={props.visible}
        animationOutTiming={props.animationOut}
        animationIn={'bounceIn'}
        animationOut={'fadeOut'}>
        <View style={styles.modalView}>
          <LottieView
            style={styles.lottie}
            source={require('../../assets/lottie/loader.json')}
            autoPlay
            loop
          />
          <TextRegular style={styles.text}>Please Wait ... </TextRegular>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    height: wp(20),
    width: wp(60),
    alignItems: 'center',
    borderRadius: wp(5),
    flexDirection: 'row',
  },
  lottie: {
    width: wp(20),
    height: wp(20),
  },
  text: {
    color: 'black',
  },
});

export default Loader;
