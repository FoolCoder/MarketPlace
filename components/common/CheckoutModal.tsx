import React, {useEffect, useState} from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import TextBold from '../ui/TextBold';
import {hp, wp} from './Responsive';
import {useAppSelector} from '../../hooks';
import {ColorsI, RelatedProducts} from '../../models';
import {extraitem, giftimg} from '../../constant/Images';
import Fonts from '../../constant/Fonts';
import shopifyApiService from '../../services/ShopifyApiService';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {addGiftsToCart, CartItems} from '../../redux/reducer/dashboardSlice';
import {useDispatch} from 'react-redux';
import FastImage from 'react-native-fast-image';

const {getProductbyCollection} = shopifyApiService;

interface CheckoutModal {
  // productData: ProductDataI;

  modalVisible: boolean;
  onClose: (e: boolean) => void;
  cId?: number | null;
  navigation: NavigationProp<ParamListBase>;
  giftID?: string;
}
interface a {
  productId: number;
  variantId: number | undefined;
  title: string;
  image: string;
  qty: number;
  price: number | string;
  inventory_quantity?: number;
  sku?: string;
}
[];

const CheckoutModal = (props: CheckoutModal) => {
  const [loader, setloader] = useState<boolean>(false);
  const [selectedId, setselectedId] = useState<number | undefined>(undefined);

  const [selectedItem1, setselectedItem1] = useState<RelatedProducts[]>([]);

  const [productsCollection, setproductsCollection] = useState<
    Array<RelatedProducts | undefined>
  >([]);
  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const {colors, collection_Id, cartItems} = dashboardReducer;
  const styles = useStyles(colors);
  const dispatch = useDispatch();

  useEffect(() => {
    getProductCollection();
  }, [props.navigation.isFocused()]);
  const getProductCollection = async () => {
    setloader(true);

    const res = await getProductbyCollection(props.giftID, 250); //! TODO FIX

    if (res?.status == 200) {
      setproductsCollection(res.data?.products);
      setloader(false);
    }
  };
  const AddCart = () => {
    // return;

    var data = {};
    var giftItemsArray: CartItems[] = [];
    selectedItem1.map(e => {
      (data = {
        productId: e?.image?.product_id!,
        variantId: e.variants[0].id,
        title: e.title,
        price: e.variants[0]!?.price,
        image: e.images[0]?.src!,
        qty: 1,
        inventory_quantity: e.variants[0].inventory_quantity,
      }),
        giftItemsArray.push(data as CartItems);
    });
    dispatch(addGiftsToCart(giftItemsArray));
    setselectedItem1([]);

    return;
  };

  const selectGifts = (data: RelatedProducts) => {
    if (selectedItem1.includes(data)) {
      const newList = selectedItem1.filter(item => item.id != data.id);
      setselectedItem1(newList);
    } else {
      setselectedItem1([...selectedItem1, data]);
    }
  };

  const renderGift = (item: any) => {
    let img = item?.item?.image?.src.split('?', 1).toString();
    var showProduct: boolean = item.item.variants.some(
      (item: {inventory_quantity: number}) => item.inventory_quantity > 0,
    );

    if (
      showProduct == true &&
      item.item.status == 'active'
      // item.item.variants.length == 1 &&
      // item.item.variants[0].inventory_quantity
    ) {
      return (
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            selectGifts(item.item);
          }}
          style={{
            flexDirection: 'row',
            marginVertical: 5,
            backgroundColor: '#fff',
            // borderRadius: selectedItem1.includes(item.item) ? 8 : undefined,
          }}>
          <FastImage
            style={{height: 70, width: 80, borderRadius: 8}}
            source={{uri: img, priority: FastImage.priority.high}}
          />
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              marginLeft: wp(0.8),
              width: wp(52),
              backgroundColor: selectedItem1.includes(item.item)
                ? '#FFEFEA'
                : undefined,
              borderRadius: selectedItem1.includes(item.item) ? 8 : undefined,
              // borderWidth: 1,
            }}>
            <Text numberOfLines={2} style={styles.textF}>
              {item.item.title}
            </Text>
            <Text
              style={[
                styles.textF,
                {
                  color: colors.primary,
                  alignSelf: 'flex-start',
                  // left: wp(4.6),
                },
              ]}>
              Rs. {item.item.variants[0].price}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else return null;
  };

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
        <View style={styles.modalView}>
          <ImageBackground style={styles.header} source={extraitem}>
            <TextBold style={styles.text}>Extra Item</TextBold>
          </ImageBackground>
          {loader ? (
            <ActivityIndicator
              size={'large'}
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
            />
          ) : (
            <FlatList
              style={{flex: 1, width: wp(75)}}
              showsVerticalScrollIndicator={false}
              data={productsCollection}
              renderItem={renderGift}
              extraData={selectedId}
            />
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: wp(73),
            }}>
            <TouchableOpacity
              disabled={selectedItem1.length > 0 ? false : true}
              style={styles.btn}
              onPress={() => {
                AddCart();
                props.navigation.navigate('Cart');

                props.onClose(!props.modalVisible);

                // props.onClose(!props.modalVisible);
                // props.navigation.navigate('Cart');
              }}>
              <TextBold>Add Items</TextBold>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, {backgroundColor: colors.primary}]}
              onPress={() => {
                props.navigation.navigate('Cart');
                props.onClose(!props.modalVisible);
              }}>
              <TextBold>No Thanks</TextBold>
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
      borderColor: '#000',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    header: {
      height: Platform.OS == 'ios' ? hp(13) : hp(13),
      width: Platform.OS == 'ios' ? wp(75) : wp(68),
      marginTop: Platform.OS == 'ios' ? hp(-4.5) : wp(-9.7),
      justifyContent: 'center',
      alignItems: 'center',
    },
    textF: {
      fontFamily: Fonts.SourceSansRegular,
      fontSize: wp(4),
      color: '#000',
    },
    modalView: {
      //   margin: 20,
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
          height: hp(60),
        },
        android: {
          height: hp(80),
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
      color: '#fff',
      fontSize: wp(1.5),
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
      top: wp(4),

      alignSelf: 'center',
      borderRadius: 10,
    },
  });

export default CheckoutModal;
