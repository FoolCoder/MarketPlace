import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../../constant/Fonts';
import {hp, wp} from '../common/Responsive';

interface ModalProps {
  visible: boolean;
  closeModal: () => void;
  chooseImage: () => void;
  openCamera: () => void;
}

export default function ImagePickerModal(props: ModalProps) {
  const {visible, closeModal, chooseImage, openCamera} = props;
  return (
    <Modal
      animationInTiming={1000}
      animationOutTiming={500}
      useNativeDriver={true}
      isVisible={visible}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      style={{margin: 0}}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.options}>
          <Pressable style={styles.option} onPress={chooseImage}>
            <Icon name="image-outline" size={30} color={'#000'} />
            <Text style={{color: '#000'}}>Library </Text>
          </Pressable>
          <Pressable style={styles.option} onPress={openCamera}>
            <Icon name="camera-outline" size={30} color={'#000'} />
            <Text style={{color: '#000'}}>Camera</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  options: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 20,
    height: '40%',
    width: '80%',
  },
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});
