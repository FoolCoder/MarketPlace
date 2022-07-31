import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {hp, wp} from './Responsive';

interface WhatsAppProps {
  productName?: string | undefined;
}

function WhatsApp(props: WhatsAppProps) {
  const message = props?.productName!
    ? props?.productName!
    : '\nWelcome to Supa.pk';

  const openWhatsApp = () => {
    // let msg = this.state.message;
    // let mobile = this.state.mobileNo;

    let url =
      'whatsapp://send?text=' +
      message +
      '\nMay i help you!' +
      '&phone=92' +
      '3111787222';

    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened successfully ' + data);
      })
      .catch(() => {
        console.log('Make sure WhatsApp installed on your device');
      });
  };
  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        zIndex: 1,
        borderRadius: 50,
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25D366',
        bottom: wp(5),
        right: wp(5),
      }}>
      <TouchableOpacity onPress={() => openWhatsApp()} style={{}}>
        <MaterialCommunityIcons name="whatsapp" color={'#fff'} size={40} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
export default WhatsApp;
