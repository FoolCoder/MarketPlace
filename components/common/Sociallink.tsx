import React from 'react';
import {View, Text, TouchableOpacity, Linking, Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  youtube,
  twitter,
  WhatsApp,
  ticktok,
  insta,
  facebook,
  icon,
  snap,
  linkedin,
} from '../../constant/Images';
import {hp, wp} from './Responsive';

interface WhatsAppProps {
  productName?: string | undefined;
}
interface Data {
  id: number;
  image: string;
  text: string;
  name?: string | undefined;
}
type Name =
  | 'facebook'
  | 'twitter'
  | 'insta'
  | 'ticktok'
  | 'youtube'
  | 'WhatsApp'
  | 'pintrest'
  | 'linkedin'
  | 'snap';
function SocialLink(props: WhatsAppProps) {
  const message = props?.productName!
    ? props?.productName!
    : 'Welcome to Supa.pk';
  const data: Data[] = [
    {
      id: 1,
      image: twitter,
      text: 'twitter',
      name: 'twitter',
    },
    {
      id: 2,
      name: 'insta',

      image: insta,
      text: 'insta',
    },
    {
      id: 4,
      name: 'facebook',

      image: facebook,
      text: 'facebook',
    },

    {
      id: 5,
      name: 'youtube',
      image: youtube,
      text: 'youtube',
    },
    {
      id: 6,
      name: 'WhatsApp',
      image: WhatsApp,
      text: 'WhatsApp',
    },
    {
      id: 7,
      name: 'pintrest',
      image: icon,
      text: 'WhatsApp',
    },
    {
      id: 8,
      name: 'linkedin',
      image: linkedin,
      text: 'WhatsApp',
    },
    {
      id: 9,
      name: 'snap',
      image: snap,
      text: 'WhatsApp',
    },
  ];
  const openSocialLink = (name: Name) => {
    // let msg = this.state.message;
    // let mobile = this.state.mobileNo;
    if (name == 'WhatsApp') {
      let url = 'whatsapp://send?text=' + message + '&phone=92' + '3111787222';

      Linking.openURL(url)
        .then(data => {
          console.log('WhatsApp Opened successfully ' + data);
        })
        .catch(() => {
          console.log('Make sure WhatsApp installed on your device');
        });
    } else if (name == 'facebook') {
      Linking.openURL('https://www.facebook.com/supapakistan');
    } else if (name == 'twitter') {
      Linking.openURL('https://twitter.com/supa_pk');
    } else if (name == 'insta') {
      Linking.openURL('https://www.instagram.com/supa.pk/');
    } else if (name == 'youtube') {
      Linking.openURL(
        'https://www.youtube.com/channel/UCoMPh-JWiSVrdKgLV492owA/videos',
      );
    } else if (name == 'pintrest') {
      Linking.openURL('https://www.pinterest.com/Supa_pk/');
    } else if (name == 'snap') {
      Linking.openURL('https://www.snapchat.com/add/supa.pk');
    } else if (name == 'linkedin') {
      Linking.openURL('https://www.linkedin.com/in/supa-pk-141556206/');
    }
  };
  return (
    <View
      style={{
        // position: 'absolute',
        // zIndex: 1,
        marginTop: wp(2),
        width: wp(80),
        height: hp(15),
        flexDirection: 'row',
        alignSelf: 'center',
        marginLeft: wp(-8),
      }}>
      {data.map((e: any) => {
        return (
          <TouchableOpacity
            onPress={() => openSocialLink(e?.name)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 1,
            }}>
            <Image style={{width: 40, height: 40}} source={e?.image} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export default SocialLink;
