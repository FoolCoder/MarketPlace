import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
//@ts-ignore
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Progress from 'react-native-progress';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import Modal from 'react-native-modal';
// import Icon from 'react-native-vector-icons/FontAwesome';

import Container from '../../components/common/Container';
import {useAppSelector} from '../../hooks';
import {wp} from '../../components/common/Responsive';
import TextRegular from '../../components/ui/TextRegular';
import deviceInfoModule from 'react-native-device-info';
import TextBold from '../../components/ui/TextBold';
import {useDispatch} from 'react-redux';
import {
  addCartItems,
  addGiftsToCart,
  CartItems,
  removeCartItems,
  removeGifts,
} from '../../redux/reducer/dashboardSlice';
import shopifyApiService from '../../services/ShopifyApiService';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import {tokenExist} from '../../utils/tokenValidation';
import {Colors} from '../../constant/Colors';
import AuthModal from '../../components/common/AuthModal';

const SHIPPINGCOST: number = 2000;
interface Props {
  navigation: NavigationProp<ParamListBase>;
  loader?: boolean;
  route: RouteProp<
    {
      // key: string;
      // name: string;
      params: {cartm?: boolean};
    },
    'params'
  >;
}

const Cart = (props: Props) => {
  // const navigation: any = useNavigation();
  const [loader, setLoader] = useState<boolean>(false);
  const [note, setNote] = useState<string | undefined>(undefined);
  const [unregisterUserModal, setUnregisterUserModal] =
    useState<boolean>(false);

  const dashboardReducer = useAppSelector(state => state.dashboardReducer);

  var cartItemsCost =
    _.size(dashboardReducer.cartItems) > 0
      ? dashboardReducer.cartItems
          //@ts-ignore
          .reduce(
            (acc: number, item: CartItems) =>
              acc + item.qty * Number(item.price),
            0,
          )
          .toFixed(2)
      : 0;
  var giftItemsCost =
    _.size(dashboardReducer.giftItems) > 0
      ? dashboardReducer.giftItems
          //@ts-ignore
          .reduce(
            (acc: number, item: CartItems) =>
              acc + item.qty * Number(item.price),
            0,
          )
          .toFixed(2)
      : 0;
  const totalAmount = Number(cartItemsCost) + Number(giftItemsCost);

  const {colors} = dashboardReducer;
  const dispatch = useDispatch();

  function calculateProgress() {
    if (Number(totalAmount) >= SHIPPINGCOST) {
      return 1;
    } else {
      return Number(totalAmount) / SHIPPINGCOST;
    }
  }
  function createCheckout() {
    if (!tokenExist()) {
      setUnregisterUserModal(true);
    } else {
      //* function for complete checkout api
      finalCheckout();
    }
  }
  async function finalCheckout() {
    setUnregisterUserModal(false);
    setLoader(true);
    const checkout_items = dashboardReducer.cartItems?.map(item => ({
      variant_id: item.variantId,
      quantity: item.qty,
    }));
    const checkout_items1 = dashboardReducer.giftItems?.map(item => ({
      variant_id: item.variantId,
      quantity: item.qty,
    }));
    // const gift_Card_Ids = dashboardReducer.gifts.map(item => {
    //   return {id: item.id, qty: 1};
    // });

    const checkoutItemsObj = {
      checkout: {
        line_items: [...checkout_items, ...checkout_items1],
        note: note ?? '',
      },
    };

    const res = await shopifyApiService.checkoutApi(checkoutItemsObj);

    setLoader(false);
    if (res?.status == 201) {
      props.navigation.navigate('CompleteCheckout', {
        url: res.data?.checkout?.web_url,
      });
    }
  }
  function colorScenario() {
    if (SHIPPINGCOST > Number(totalAmount)) {
      const color =
        SHIPPINGCOST - Number(totalAmount) < 1000
          ? 'yellow'
          : SHIPPINGCOST - Number(totalAmount) > 1000
          ? 'red'
          : colors.secondary;
      return color;
    }
    return colors.secondary;
  }
  const onCloseModal = () => {
    createCheckout();
    // setmodalVisible1(!modalVisible1);
    // props.onClose(!props.modalVisible);
  };

  return (
    <Container arrow headerTitle="Cart">
      <>
        <ScrollView
          scrollEnabled
          contentContainerStyle={styles.cartListContainer}>
          <View>
            {dashboardReducer.cartItems.map(item => {
              return (
                <View key={item.variantId} style={styles.cartView}>
                  <FastImage
                    style={styles.img}
                    source={{
                      uri: String(item.image),
                      priority: FastImage.priority.high,
                    }}
                  />
                  <View style={styles.textContainer}>
                    <TextRegular style={styles.text}>{item.title}</TextRegular>
                    <TextRegular
                      style={{
                        color: colors.primary,
                        fontSize: 3,
                        marginTop: wp(1),
                      }}>
                      SKU: {item.sku!}
                    </TextRegular>
                    <TextBold style={styles.priceStyle}>
                      {String(item.price)}
                    </TextBold>
                  </View>
                  <View style={styles.btnContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        if (item.inventory_quantity! < item.qty + 1) {
                          Alert.alert('Maximum quantity is selected!');
                        } else {
                          dispatch(
                            addCartItems({
                              ...item,
                              qty: item.qty + 1,
                            }),
                          );
                        }
                      }}>
                      <AntDesign name="pluscircleo" size={22} color={'grey'} />
                    </TouchableOpacity>
                    <TextRegular style={styles.qtyText}>
                      {String(item.qty)}
                    </TextRegular>
                    <TouchableOpacity
                      onPress={() => {
                        if (item.qty > 1) {
                          dispatch(
                            addCartItems({
                              ...item,
                              qty: item.qty - 1,
                            }),
                          );
                        } else {
                          dispatch(
                            removeCartItems({
                              ...item,
                              qty: item.qty - 1,
                            }),
                          );
                        }
                      }}>
                      <AntDesign name="minuscircleo" size={22} color="grey" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          {dashboardReducer.giftItems?.map(item => {
            return (
              <View key={item.variantId} style={styles.cartView}>
                <FastImage
                  style={styles.img}
                  source={{
                    uri: String(item.image),
                    priority: FastImage.priority.high,
                  }}
                />
                <View style={styles.textContainer}>
                  <TextRegular style={styles.text}>{item.title}</TextRegular>
                  <TextRegular
                    style={{
                      color: colors.primary,
                      fontSize: 3,
                      marginTop: wp(1),
                      borderWidth: 1,
                    }}>
                    SKU: {item?.sku!}
                  </TextRegular>
                  <TextBold style={styles.priceStyle}>
                    {String(item.price)}
                  </TextBold>
                </View>
                <View style={styles.btnContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      if (item.inventory_quantity! < item.qty + 1) {
                        Alert.alert('Maximum quantity is selected!');
                      } else {
                        dispatch(addGiftsToCart([item]));
                      }
                    }}>
                    <AntDesign name="pluscircleo" size={22} color={'grey'} />
                  </TouchableOpacity>
                  <TextRegular style={styles.qtyText}>
                    {String(item.qty)}
                  </TextRegular>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(removeGifts([item]));
                    }}>
                    <AntDesign name="minuscircleo" size={22} color="grey" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.noteContainer}>
          <TextRegular
            style={{
              alignSelf: 'flex-start',
              paddingHorizontal: wp(5),
              marginTop: wp(3),
              color: '#34283E',
              fontSize: 4.5,
            }}>
            Order Instructions
          </TextRegular>
          <TextInput
            onChangeText={text => setNote(text)}
            style={styles.textInputStyle}
            // placeholder="Note"
            multiline
          />
        </View>
        <View style={styles.checkoutContainer}>
          <View style={styles.priceView}>
            <TextRegular style={styles.priceText}>Total Price</TextRegular>
            <TextRegular style={styles.priceText}>
              Rs:
              {String(totalAmount)}
            </TextRegular>
          </View>
          <View style={styles.progress}>
            {Number(totalAmount) < 2000 ? (
              <TextRegular style={{color: 'black'}}>
                Only Rs. {Math.round(SHIPPINGCOST - Number(totalAmount)) as any}
                /- More to get free shipping
              </TextRegular>
            ) : null}
            <Progress.Bar
              progress={calculateProgress()}
              width={260}
              style={{marginTop: wp(2)}}
              color={colorScenario()}
            />
          </View>
          {(dashboardReducer.cartItems?.length > 0 ||
            dashboardReducer.giftItems?.length > 0) && (
            <TouchableOpacity
              onPress={() => createCheckout()}
              style={{
                ...styles.checkoutBtn,
                backgroundColor: colors.secondary,
              }}>
              {loader ? (
                <ActivityIndicator size={'large'} />
              ) : (
                <TextRegular style={{fontSize: 5, color: 'white'}}>
                  Check Out
                </TextRegular>
              )}
            </TouchableOpacity>
          )}
        </View>
        <Modal
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onBackdropPress={() => setUnregisterUserModal(false)}
          isVisible={unregisterUserModal}
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          animationInTiming={500}
          animationOutTiming={500}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              width: wp(85),
              height: wp(60),
              alignItems: 'center',
            }}>
            <AntDesign
              name="exclamationcircle"
              size={25}
              color={'orange'}
              style={{marginTop: 10}}
            />
            <TextBold
              style={{
                color: 'black',
                paddingHorizontal: 5,
                marginTop: 10,
              }}>
              Would you like to register as customer or checkout as guest.
            </TextBold>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                onPress={() => finalCheckout()}
                style={[
                  styles.modalBtn,
                  {backgroundColor: Colors.primary, marginVertical: wp(4)},
                ]}>
                <TextBold>Guest</TextBold>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setUnregisterUserModal(false);
                  props.navigation.navigate('AuthStack', {
                    screen: 'SigninScreen',
                    params: {path: 'Cart'},
                  });
                }}
                style={styles.modalBtn}>
                <TextBold>Sign In</TextBold>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <AuthModal
          modalVisible={props.route?.params?.cartm!}
          text={'Hurray! You are ready to checkout now.'}
          imgtype={'green-tick'}
          buttonTitle="Checkout Now"
          onClose={() => onCloseModal()}
        />
      </>
    </Container>
  );
};

export default Cart;

const styles = StyleSheet.create({
  cartListContainer: {
    // alignItems: 'center',
    paddingBottom: wp(75),
  },
  cartView: {
    flexDirection: 'row',
    paddingHorizontal: wp(3),
    // alignItems: 'center',
    marginTop: 1,
    backgroundColor: '#fff',
    // borderWidth: 1,
  },
  img: {
    width: wp(25),
    height: wp(25),
  },
  textContainer: {
    width: wp(60),
    paddingHorizontal: wp(3),
    paddingVertical: wp(4),
  },
  text: {
    fontSize: 4,
    color: '#34283E',
    // borderWidth: 1,
  },
  priceStyle: {
    fontSize: wp(1.3),
    color: '#34283E',
    marginVertical: wp(2),
  },
  btnContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  qtyText: {
    color: 'black',
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    height: 'auto',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    zIndex: 1,
    width: '100%',
    paddingHorizontal: wp(3),
    paddingTop: wp(3),
    paddingBottom: wp(deviceInfoModule.hasNotch() ? 7 : 3),
  },
  priceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    color: 'black',
    fontSize: 5,
  },
  checkoutBtn: {
    width: '100%',
    height: wp(13),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  progress: {
    flexGrow: 1,
    alignItems: 'center',
    marginBottom: wp(5),
    marginTop: wp(2),
  },
  textInputStyle: {
    width: '90%',
    // minHeight: wp(10),
    // maxHeight: 'auto',
    paddingHorizontal: wp(1),
    borderColor: 'grey',
    borderBottomWidth: 1,
    marginBottom: wp(4),
    borderRadius: 5,
    paddingVertical: 3,
    color: '#000',
  },
  noteContainer: {
    position: 'absolute',
    bottom: wp(43),
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
  },
  modal: {
    width: wp(80),
    height: wp(50),
  },
  modalBtn: {
    width: wp(50),
    height: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gradient1,
    borderRadius: 10,
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 'auto',
  },
});
