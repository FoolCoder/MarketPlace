import React, {useEffect, useState} from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  ViewStyle,
  FlatList,
  ScrollView,
} from 'react-native';
import {Colors} from '../../constant/Colors';
import TextBold from '../ui/TextBold';
import {hp, wp} from './Responsive';
import {tick, red_tick} from '../../constant/Images';
import {useAppSelector} from '../../hooks';
import {ColorsI} from '../../models';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {toPairs} from 'lodash';
import FastImage from 'react-native-fast-image';

interface AuthModal {
  modalVisible?: boolean;
  text?: string;
  buttonStyle?: ViewStyle;
  onClose: (e: boolean) => void;
  navigation?: NavigationProp<ParamListBase>;
  loader?: boolean;
}

const CartModal = (props: AuthModal) => {
  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const [CartItems, setcartItem] = useState<any[]>([]);
  const {colors, cartItems, giftItems} = dashboardReducer;
  const styles = useStyles(colors);
  useEffect(() => {
    serCartItem();
  }, [cartItems, giftItems]);
  const serCartItem = () => {
    setcartItem([...cartItems, ...giftItems]);
  };
  const renderCart = (item: any) => {
    return (
      <View
        style={{
          marginVertical: 5,
          alignSelf: 'center',
        }}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 6,
              overflow: 'hidden',
              borderColor: '#ccc',
            }}>
            <FastImage
              source={{uri: item.item.image, priority: FastImage.priority.high}}
              style={{width: 50, height: 40}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              numberOfLines={1}
              style={{
                color: '#000',
                width: wp(60),
                fontSize: wp(3.5),
                fontWeight: '600',
                marginLeft: 5,
              }}>
              {item.item.title}
              {/* {item.item.qty} */}
            </Text>

            <Text
              style={{
                color: '#000',
                fontSize: wp(3.5),
                fontWeight: '600',
                width: wp(8),
                textAlign: 'center',
              }}>
              {item.item.qty}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: 'grey',
            fontSize: wp(3.5),
            fontWeight: '600',
            marginLeft: wp(15),
            top: -8,
          }}>
          {item.item.price}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible ? props.modalVisible : false}
      onRequestClose={() => props.onClose(!props.modalVisible)}
      // style={{borderWidth: 1, height: hp(70), alignItems: 'center'}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextBold
            style={{
              color: colors.secondary,
              fontSize: 6,
              marginTop: cartItems.length != 0 ? wp(5) : wp(2),
              width: wp(85),
              textAlign: 'center',
            }}>
            Cart Items
          </TextBold>
          <View style={{maxHeight: hp(48)}}>
            <View
              style={{
                top: wp(2),
                width: wp(85),
              }}>
              {cartItems?.length == 0 && giftItems?.length == 0 ? (
                <View
                  style={{
                    height: hp(4),
                  }}>
                  <TextBold
                    style={{
                      color: 'grey',
                      textAlign: 'center',
                      fontSize: wp(1.3),
                    }}>
                    Cart is Empty!
                  </TextBold>
                </View>
              ) : (
                <>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={CartItems}
                    renderItem={renderCart}
                  />

                  {/* <FlatList
                    showsVerticalScrollIndicator={false}
                    data={giftItems}
                    renderItem={renderCart}
                  /> */}
                </>
              )}
            </View>
          </View>
          <View
            style={{
              height: hp(8),
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  marginTop: cartItems.length == 0 ? hp(3) : hp(0),
                  marginBottom: cartItems.length == 0 ? hp(2) : hp(0),
                },
              ]}
              onPress={() => {
                props.navigation?.navigate('Catalogue', {
                  screen: 'Cart',
                });
                props.onClose(!props.modalVisible);
              }}>
              <TextBold style={{fontSize: wp(1.2)}}>GoTo Cart</TextBold>
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
      marginTop: hp(2.8),
      borderColor: '#000',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      top: Platform.OS == 'ios' ? hp(3.3) : hp(3),
      left: wp(2),
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      borderWidth: 4,
      borderColor: 'grey',
      //   paddingVertical: 35,
      //   padding: 30,
      alignItems: 'center',
      shadowColor: '#000',
      width: wp(90),
      maxHeight: 'auto',
      minHeight: hp(19),
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
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
      //   top: wp(-4),

      alignSelf: 'center',
      borderRadius: 15,
    },
  });

export default CartModal;
