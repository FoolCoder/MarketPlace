import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ActivityIndicator,
  Alert,
  Share,
  Animated,
  SafeAreaView,
  Modal,
  useWindowDimensions,
  BackHandler,
} from 'react-native';
import {useDispatch} from 'react-redux';
import _, {values} from 'lodash';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageViewer from 'react-native-image-zoom-viewer';
//@ts-ignore
import StarRating from 'react-native-star-rating';
//@ts-ignore
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
//@ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//@ts-ignore
import Entypo from 'react-native-vector-icons//Entypo';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
//@ts-ignore
import {
  NavigationProp,
  ParamListBase,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import Swiper from 'react-native-swiper';

import Fonts from '../../constant/Fonts';
import {DefaultPic, headerimage} from '../../constant/Images';

import {useAppSelector} from '../../hooks';
import {ColorsI, option, RelatedProducts, Reviews} from '../../models';
import TextBold from '../ui/TextBold';
import CheckoutModal from './CheckoutModal';
import {hp, wp} from './Responsive';
import {addCartItems} from '../../redux/reducer/dashboardSlice';
import shopifyApiService from '../../services/ShopifyApiService';
import {ProductDataI, Variants} from '../../screens/dashboard/SelectedProduct';
import {buynow} from '../../constant/Images';
import supaAuthApiService from '../../services/SupaAuthApiService';
import AddToCartModal from './AddToCartModal';
import VirtualizedView from './VirtualizedView';
import CartModal from './CartModal';
import deviceInfoModule from 'react-native-device-info';
import TextRegular from '../ui/TextRegular';
import DiscountIcon from '../../assets/allicons/discount.svg';
//@ts-ignore
import RenderHtml from 'react-native-render-html';
import FastImage from 'react-native-fast-image';
import {forSlideLeft} from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/HeaderStyleInterpolators';
import {tokenExist} from '../../utils/tokenValidation';
const {getProductbyCollection, getReviews} = shopifyApiService;

interface PropsI {
  productData: ProductDataI;
  navigation: NavigationProp<ParamListBase>;
  cId: number | undefined;
  path?: string;
  title?: string;
  catId?: any;
}
interface collection {
  id: number;
  key: string;
  status: string;
  value: string;
}
type CounterType = 'plus' | 'minus';
const HEADER_HEIGHT = 375;
export default function Product(props: PropsI) {
  const [selectedProductVariant, setSeletedProductVariant] = useState<
    {size: string | undefined; color: string | undefined} | undefined
  >(undefined);
  const {width} = useWindowDimensions();
  const offset = useRef(new Animated.Value(0)).current;
  var imagesList = props?.productData?.images?.map((e: any) => {
    return {url: e.src};
  });
  // const navigation = useNavigation();

  const dispatch = useDispatch();

  const [counter, setcounter] = useState<number>(1);

  const [productsCollection, setproductsCollection] = useState<
    Array<RelatedProducts | undefined>
  >([]);
  const [review, setreview] = useState<Reviews[]>([]);

  const [loader, setLoader] = useState<boolean>(false);
  const [modalVisible, setmodalVisible] = useState<boolean>(false);
  const [cartModal, setCartModal] = useState<boolean>(false);
  const [modalVisible1, setmodalVisible1] = useState<boolean>(false);
  const [zoomImageModal, setZoomImageModal] = useState<boolean>(false);
  const [reviewL, setreviewL] = useState<boolean>(false);
  const [loader1, setLoader1] = useState<boolean>(false);

  const dashboardReducer = useAppSelector(State => State.dashboardReducer);

  const {colors, collection_Id} = dashboardReducer;

  const styles = useStyles(colors);
  const isFocused = useIsFocused();
  const source = {
    html: props.productData.body_html,
  };
  const tagsStyles = {
    // body: {
    //   whiteSpace: 'normal',
    //   color: 'gray',
    // },
    a: {
      // color: 'green',
      textDecorationLine: 'none',
    },
  };
  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
    },
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    if (
      props.productData.variants?.length! > 1 &&
      !_.isUndefined(props.productData?.options[0]) &&
      !_.isUndefined(props.productData?.options[1])
    ) {
      var newArray = [];
      //size
      newArray = props.productData?.options[0].values.map(size => {
        //color
        return props.productData?.options[1].values.map(color => {
          return props.productData.variants?.find(
            item =>
              item.title == `${size} / ${color}` && item.inventory_quantity > 0,
          );
        });
      });

      for (let i = 0; i < newArray.length; i++) {
        if (!_.isUndefined(newArray[i][0])) {
          setSeletedProductVariant({
            size: newArray[i][0]?.option1,
            color: newArray[i][0]?.option2!,
          });
          return;
        }
      }
    }
    return () =>
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
  }, [props.productData]);

  useEffect(() => {
    // getCollection_Id();
    getProductByCollection();
    getProductReviews();
  }, [props.cId, props.navigation.isFocused]);

  function handleBackButtonClick() {
    if (props.path) {
      props.navigation.navigate(props.path!, {
        title: props.title,
      });

      return true;
    } else {
      props.navigation.goBack();

      return true;
    }
  }
  const getProductByCollection = async () => {
    setLoader(true);

    const res = await getProductbyCollection(props.cId!, 100);

    if (res?.status == 200) {
      setproductsCollection(res.data?.products);
      setLoader(false);
    } else {
      setLoader(false);
    }
  };
  const getProductReviews = async () => {
    setreviewL(true);

    const res = await getReviews(props.productData.id);

    if (res?.status == 200) {
      var temp: any[] = [];

      res.data?.reviews.map((e: any) => {
        if (e.product_external_id == props.productData.id) {
          temp.push(e);
        }
      });

      setreview(temp);
      setreviewL(false);
    } else {
      setreviewL(false);
    }
  };
  const Counter = (type: CounterType) => {
    let count: number = counter;
    if (type == 'plus') {
      if (selectedProductVariant?.color && selectedProductVariant?.color) {
        const variant = `${selectedProductVariant!?.size} / ${
          selectedProductVariant?.color
        }`;
        const item = props.productData.variants?.find(
          item => item.title == variant,
        );

        if (item?.inventory_quantity! < counter + 1) {
          Alert.alert(`You cannot select quantity more than  ${counter}.`);
        } else {
          setcounter(counter + 1);
        }
      } else if (
        props.productData.variants?.length == 1 &&
        props.productData.variants[0].inventory_quantity < counter + 1
      ) {
        Alert.alert(`You cannot select quantity more than  ${counter}.`);
      } else {
        setcounter(counter + 1);
      }
    } else {
      if (counter > 1) {
        setcounter(counter - 1);
      }
    }
  };
  function findItem(v: string) {
    let str = v.replace(/\s/g, '');
    const [size, color] = str.split('/');
    if (size != 'undefined' && color != 'undefined') {
      return props.productData.variants?.some(
        item => item.title == v && item.inventory_quantity > 0,
      );
    }
    return true;
  }

  const AnimatedHeader = ({animatedValue}: any) => {
    const insets = useSafeAreaInsets();

    const headerHeight = animatedValue.interpolate({
      inputRange: [0, HEADER_HEIGHT + insets.top],
      outputRange: [HEADER_HEIGHT + insets.top, insets.top + 44],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          height: headerHeight,
          // backgroundColor: 'lightblue',
        }}>
        <Swiper
          // key={props.img.length}
          automaticallyAdjustContentInsets
          scrollEnabled
          autoplay
          loop
          autoplayDirection
          activeDotColor="#fff">
          {props?.productData?.images ? (
            imagesList.map((e: any, index: number) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setZoomImageModal(true)}>
                  <FastImage
                    style={styles.pageImage}
                    source={{uri: e.url, priority: FastImage.priority.high}}
                  />
                </TouchableOpacity>
              );
            })
          ) : (
            <Image source={DefaultPic} />
          )}
        </Swiper>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (props.path) {
              props.navigation.navigate(props.path!, {
                title: props.title,
                catId: props.catId,
              });
            } else {
              props.navigation.goBack();
            }
          }}>
          <MaterialIcons name="keyboard-backspace" size={32} color={'#fff'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setmodalVisible1(true);
            setLoader1(true);
          }}
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
            right: 8,
            top: deviceInfoModule.hasNotch() ? hp(5) : hp(5.5),
            height: 45,
            borderRadius: 40,
            backgroundColor: loader1 ? '#fff' : undefined,

            // backgroundColor: loader ? '#fff' : null,
          }}>
          {(dashboardReducer.cartItems?.length > 0 ||
            dashboardReducer.giftItems?.length > 0) && (
            <View style={styles.badgeView}>
              <TextBold style={{color: 'white', fontSize: 3.5}}>
                {String(
                  Number(dashboardReducer.cartItems?.length ?? 0) +
                    Number(dashboardReducer.giftItems?.length ?? 0),
                )}
              </TextBold>
            </View>
          )}
          <MaterialCommunityIcons
            name="cart-outline"
            size={30}
            color={colors.primary}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  //! important here our color is behaving like our variantid//
  //* it is important to remember while fetching api
  const renderColor = (item: any, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        disabled={
          findItem(`${selectedProductVariant!?.size} / ${item}`) ? false : true
        }
        style={[
          styles.sizeList,
          {
            width: item?.length > 6 ? 80 : 50,
            borderColor:
              selectedProductVariant?.color == item ? 'orange' : 'grey',
            borderWidth: 2,
            backgroundColor:
              selectedProductVariant?.size || selectedProductVariant?.color
                ? findItem(`${selectedProductVariant!?.size} / ${item}`)
                  ? '#fff'
                  : '#aeaeae'
                : '#fff',
            // borderColor: imageIndex == item.index ? '#000' : 'grey',
          },
        ]}
        onPress={() => {
          setcounter(1);
          setSeletedProductVariant((prevInfo: any) => ({
            ...prevInfo,
            color: item == prevInfo?.color ? undefined : item,
          }));
        }}>
        <Text
          style={{
            color: '#000',
          }}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderSize = (item: any, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        disabled={
          findItem(`${item} / ${selectedProductVariant?.color}`) ? false : true
        }
        onPress={() => {
          setcounter(1);
          setSeletedProductVariant((prevInfo: any) => ({
            ...prevInfo,
            size: item == prevInfo?.size ? undefined : item,
          }));
        }}
        style={[
          styles.sizeList,
          {
            borderColor:
              selectedProductVariant?.size == item ? 'orange' : 'grey',
            borderWidth: 2,
            backgroundColor:
              selectedProductVariant?.size || selectedProductVariant?.color
                ? findItem(`${item} / ${selectedProductVariant?.color}`)
                  ? '#fff'
                  : '#aeaeae'
                : '#fff',
          },
        ]}>
        <Text
          style={{
            color: '#000',
          }}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderProduct = (item: any) => {
    let img = item?.item?.image?.src.split('?', 1).toString();
    var showProduct: boolean = item.item.variants.some(
      (item: {inventory_quantity: number}) => item.inventory_quantity > 0,
    );
    if (showProduct) {
      return (
        <View key={item.index} style={{left: wp(2), marginEnd: wp(3)}}>
          {item?.item?.id == props.productData.pId ? null : (
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('SelectedProduct', {
                  pId: item.item.id,
                  cId: props.cId,
                  catId: props.catId,
                  path: 'CatalogueItemScreen',
                  title: props.title,
                });
              }}>
              <ImageBackground style={styles.flatList1} source={{uri: img}}>
                {!_.isNull(item.item?.variants![0]?.compare_at_price) &&
                  Number(item.item?.variants![0]?.compare_at_price) > 0 &&
                  String(
                    Number.isInteger(
                      calculateDiscount(
                        item.item?.variants![0]?.price,
                        item.item?.variants![0]?.compare_at_price,
                      ),
                    ),
                  ) && (
                    <View style={styles.discount}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {/* <DiscountIcon
                    width={20}
                    height={20}
                    style={{marginLeft: wp(5), marginBottom: -wp(1)}}
                  /> */}

                        <Text
                          style={[
                            styles.price,
                            {
                              marginLeft: 2,
                              fontSize: wp(3.5),
                              color: '#fff',
                              top: -5,
                            },
                          ]}>
                          {String(
                            calculateDiscount(
                              item.item?.variants![0]?.price,
                              item.item?.variants![0]?.compare_at_price,
                            ),
                          )}
                          % off
                        </Text>
                      </View>
                    </View>
                  )}
              </ImageBackground>
              <View style={{left: 2}}>
                <Text numberOfLines={2} style={[styles.text3, {height: hp(4)}]}>
                  {item?.item?.title}
                </Text>
                <View style={[styles.priceView]}>
                  <Text style={[styles.price, {fontSize: wp(4), top: -8}]}>
                    Rs {item.item.variants[0].price}
                  </Text>
                  {item.item.variants![0]?.compare_at_price && (
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: wp(3),
                        marginVertical: wp(1),
                        marginLeft: wp(2),
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                        top: wp(1),
                      }}>
                      {item.item.variants![0]?.compare_at_price == '0.00'
                        ? null
                        : `Rs ${item.item.variants![0]?.compare_at_price}`}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return null;
  };
  const onCloseModal = () => {
    setmodalVisible(false);
    setLoader1(!loader1);
  };
  const closeCartModal = () => {
    setCartModal(false);
  };
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: props.productData.title,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error('somthing went wrong with sharing!', error);
    }
  };

  function findStock(): boolean {
    //* when we have multiple products and finding variant quantity
    if (
      props.productData?.variants?.length == 1 &&
      props.productData?.variants[0]?.inventory_quantity < 1
    ) {
      return false;
    } else if (
      props.productData?.variants?.length! == 1 &&
      props.productData?.variants![0]?.inventory_quantity > 0
    ) {
      return true;
    } else if (
      (props.productData?.variants?.length! > 1 &&
        !selectedProductVariant?.color) ||
      !selectedProductVariant?.size
    ) {
      // console.log('else if');

      return false;
    } else if (selectedProductVariant?.color && selectedProductVariant?.size) {
      return findItem(
        `${selectedProductVariant!?.size} / ${selectedProductVariant.color}`,
      )
        ? true
        : false;
    }

    //* when we have single product and single variant

    return false;
  }
  const addToCart = (show: boolean) => {
    if (
      props.productData?.variants?.length! > 1 &&
      selectedProductVariant?.color &&
      selectedProductVariant.size
    ) {
      const selectedProduct = props.productData.variants?.find(
        item =>
          item.title ==
          `${selectedProductVariant!?.size} / ${selectedProductVariant?.color}`,
      );

      dispatch(
        addCartItems({
          productId: selectedProduct?.product_id!,
          variantId: selectedProduct!.id,
          title: props.productData?.title,
          price: selectedProduct!?.price,
          image: props.productData?.images[0]?.src!,
          qty: counter > 0 ? counter : 1,
          inventory_quantity: selectedProduct?.inventory_quantity!,
          sku: selectedProduct?.sku!,
        }),
      );
    } else if (props.productData?.variants?.length! == 1) {
      dispatch(
        addCartItems({
          productId: props.productData?.variants![0]?.product_id,
          variantId: props.productData?.variants![0]?.id,
          title: props.productData.title,
          price: props.productData?.variants![0]?.price,
          image: props.productData?.images[0]?.src!,
          qty: counter > 0 ? counter : 1,
          inventory_quantity:
            props.productData?.variants![0].inventory_quantity!,
          sku: props.productData?.variants![0]?.sku,
        }),
      );
    }
    // TODO FIX
    show && setCartModal(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <AnimatedHeader animatedValue={offset} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: offset}}}],
            {useNativeDriver: false},
          )}>
          <View style={styles.Container1}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: wp(100),
                alignSelf: 'center',
              }}>
              <View style={styles.rating}>
                {review.length > 0 ? (
                  <Text style={styles.review}>
                    {/* {props.productData?.review} */}
                    {review.length} Review
                  </Text>
                ) : null}
              </View>

              <Text
                style={[
                  styles.inStock,
                  {
                    marginRight: wp(4),
                    top: wp(4),
                    marginBottom: 6,
                    color: findStock() ? colors.primary : 'grey',
                  },
                ]}>
                {findStock() ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
            <Text numberOfLines={2} style={styles.title}>
              {props.productData?.title}
            </Text>
            <TextRegular
              style={{
                color: 'grey',
                fontSize: 4,
                marginTop: wp(1),
                marginLeft: wp(3),
              }}>
              SKU: {props?.productData?.variants![0].sku}
              {/* {props?.productData?.variants!.map((e: any) => {
                return e.sku;
              })} */}
            </TextRegular>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={styles.price}>
                Rs {props?.productData?.variants![0]?.price}
              </Text>
              {!_.isNull(props?.productData?.variants![0]?.compare_at_price) &&
                Number(props?.productData?.variants![0]?.compare_at_price) >
                  0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <DiscountIcon
                      width={20}
                      height={20}
                      style={{marginLeft: wp(5), marginBottom: -wp(1)}}
                    />

                    <Text
                      style={[
                        styles.price,
                        {marginLeft: 2, fontSize: wp(4.5)},
                      ]}>
                      {calculateDiscount(
                        props?.productData?.variants![0]?.price,
                        props?.productData?.variants![0]?.compare_at_price,
                      )}
                      x % Discount
                    </Text>
                  </View>
                )}
            </View>
            {props?.productData?.variants![0]?.compare_at_price && (
              <Text style={styles.discount_price}>
                {props.productData.variants![0]?.compare_at_price == '0.00'
                  ? null
                  : `Rs ${props.productData.variants![0]?.compare_at_price}`}
              </Text>
            )}
            <Text style={styles.note}>
              Free Shipping For Order Above Rs. 2000
            </Text>
            {props?.productData?.variants!.length > 0 ? (
              <>
                {props?.productData?.options[0]?.values[0] ==
                'Default Title' ? null : (
                  <>
                    <Text style={styles.review}>Colors</Text>
                    <ScrollView
                      bounces={false}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: '100%',
                      }}>
                      {props?.productData?.options[1]?.values!.map(
                        (item, index) => renderColor(item, index),
                      )}
                    </ScrollView>
                    {/* <FlatList
                      numColumns={5}
                      data={props?.productData?.options[1]?.values! ?? []}
                      // horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={renderColor}
                    /> */}
                  </>
                )}
              </>
            ) : null}
            {props?.productData?.options[0]?.values[0] ==
            'Default Title' ? null : (
              <>
                <Text style={styles.review}>Sizes</Text>
                <ScrollView
                  bounces={false}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    width: '100%',
                  }}>
                  {props.productData?.options[0].values.map((item, index) =>
                    renderSize(item, index),
                  )}
                </ScrollView>
                {/* <FlatList
                  numColumns={6}
                  data={props.productData?.options[0].values}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderSize}
                /> */}
              </>
            )}
            <View style={styles.quantity}>
              <Text style={[styles.review, {fontSize: wp(4.5), top: 2}]}>
                Quantity
              </Text>
              <View style={[styles.quantity, {width: wp(25)}]}>
                <TouchableOpacity
                  disabled={findStock() ? false : true}
                  onPress={() => Counter('plus')}>
                  <AntDesign name="pluscircleo" size={22} color={'grey'} />
                </TouchableOpacity>
                <Text
                  style={[styles.review, {fontSize: wp(4.5), marginTop: 0}]}>
                  {counter < 10 ? `0${counter}` : counter}
                </Text>
                <TouchableOpacity
                  disabled={findStock() ? false : true}
                  style={{marginLeft: 8}}
                  onPress={() => {
                    if (counter != 0) {
                      Counter('minus');
                    }
                  }}>
                  <AntDesign name="minuscircleo" size={22} color="grey" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                disabled={findStock() ? false : true}
                onPress={() => addToCart(true)}
                style={[
                  styles.cartBtn,
                  {
                    backgroundColor: findStock() ? colors.primary : 'grey',
                  },
                ]}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#fff',
                    fontSize: wp(4.5),
                  }}>
                  Add to Cart
                </Text>
                <AntDesign name="shoppingcart" color="#fff" size={30} />
              </TouchableOpacity>

              <TouchableOpacity
                disabled={findStock() ? false : true}
                onPress={() => {
                  addToCart(false);
                  setmodalVisible(true);

                  // setTimeout(() => {
                  //   setCartModal(true);
                  // }, 2000);
                }}
                style={[
                  styles.buyBtn,
                  {backgroundColor: findStock() ? colors.secondary : 'grey'},
                ]}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#fff',
                    fontSize: wp(4.5),
                  }}>
                  Buy Now
                </Text>
                <Image style={{left: 8}} source={buynow} />
                {/* <AntDesign name="shoppingcart" color="#fff" size={30} /> */}
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.Container2, {height: 'auto'}]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.productText}>Product Details</Text>
              <TouchableOpacity
                onPress={() => onShare()}
                style={{
                  flexDirection: 'row',
                  marginRight: wp(3),
                  width: wp(18),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: Platform.OS == 'ios' ? hp(2) : hp(2),
                  // borderWidth: 1,
                }}>
                {/* <SharePic width={wp(5)} height={hp(5)} /> */}
                <Entypo name="share" size={20} color="#000" />
                <Text
                  style={{
                    color: 'grey',
                    fontSize: wp(4.5),
                    fontFamily: Fonts.SourceSansBold,
                  }}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 'auto',
                // borderWidth: 1,
                width: wp(95),
                alignSelf: 'center',
              }}>
              <RenderHtml
                contentWidth={width}
                source={source}
                renderersProps={renderersProps}
                baseStyle={styles.baseStyle}
                // tagsStyles={tagsStyles}
              />
            </View>
          </View>
          <View style={styles.Container3}>
            <View style={styles.reviewHeader}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: -8,
                }}>
                <Text style={styles.productText}>Reviews</Text>
                {tokenExist() ? (
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate('Reviews', {
                        productData: props.productData,
                        review,
                      });
                    }}>
                    <Text
                      style={[
                        styles.productText,
                        {fontSize: wp(4), color: colors.primary},
                      ]}>
                      Add Review
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              {tokenExist() ? (
                <TouchableOpacity
                  disabled={review.length > 0 ? false : true}
                  onPress={() => {
                    // if (review.length > 0) {
                    props.navigation.navigate('Reviews', {
                      productData: props.productData,
                      review,
                      cid: props.cId,
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TextBold style={{color: 'grey', fontSize: wp(0.9)}}>
                    See All
                  </TextBold>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    color="grey"
                    size={25}
                    // style={{marginTop: hp(3.5)}}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            {reviewL ? (
              <ActivityIndicator size={'large'} />
            ) : review.length > 0 ? (
              <>
                <Text
                  style={[
                    styles.review,
                    {
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: wp(4.5),
                      marginVertical: hp(0.8),
                    },
                  ]}>
                  {review[0]?.reviewer?.name}
                </Text>
                {/* <View style={styles.dateView}> */}
                <StarRating
                  containerStyle={{width: wp(25), left: 5}}
                  disabled={false}
                  emptyStar={'star-border'}
                  fullStar={'star'}
                  halfStar={'star-half'}
                  iconSet={'MaterialIcons'}
                  maxStars={5}
                  rating={review[0].rating}
                  starSize={18}
                  fullStarColor="gold"
                  //   selectedStar={rating => this.onStarRatingPress(rating)}
                />
                <Text
                  style={[
                    styles.review,
                    {fontFamily: Fonts.SourceSansRegular},
                  ]}>
                  {moment(review[0].created_at).format('LL')}
                </Text>
                {/* </View> */}
                <Text
                  numberOfLines={4}
                  style={{
                    marginLeft: wp(2),
                    color: 'grey',
                    marginBottom: 8,
                    marginTop: hp(1),
                  }}>
                  {review[0].body}
                </Text>
              </>
            ) : (
              <TextBold
                style={{
                  fontSize: wp(2),
                  color: 'grey',
                  marginVertical: 8,
                  textAlign: 'center',
                }}>
                No Reviews Avaible
              </TextBold>
            )}
            {/* <Text
              style={{
                marginVertical: hp(1.5),
                color: 'grey',
                fontFamily: Fonts.SourceSansRegular,
                left: wp(2),
              }}>
              people found this helpfull
            </Text> */}
          </View>

          <View>
            {loader ? (
              <ActivityIndicator
                style={{justifyContent: 'center', flex: 1}}
                size="large"
                color={colors.secondary}
              />
            ) : productsCollection.length <= 1 ? (
              <View
                style={[
                  styles.Container2,
                  {justifyContent: 'center', alignItems: 'center'},
                ]}>
                <TextBold
                  style={{
                    color: 'grey',
                    fontSize: hp(0.8),
                    fontFamily: Fonts.SourceSansBold,
                  }}>
                  No Related Item Avaiable
                </TextBold>
              </View>
            ) : (
              <>
                <TextBold style={styles.text}>You May Also Like</TextBold>
                <FlatList
                  style={{flexGrow: 0}}
                  horizontal
                  // numColumns={2}
                  showsHorizontalScrollIndicator={false}
                  data={productsCollection}
                  renderItem={renderProduct}
                />
              </>
            )}
          </View>
          <CartModal
            modalVisible={modalVisible1}
            navigation={props.navigation}
            onClose={() => {
              setmodalVisible1(!modalVisible1);
              setLoader1(!loader1);
              setCartModal(false);
            }}
            loader={loader1}
          />
          <CheckoutModal
            modalVisible={modalVisible}
            cId={props.cId}
            giftID={collection_Id!?.collection_detail[0]?.c_id ?? ''}
            onClose={() => {
              onCloseModal();
              // createFinalCheckout();
            }}
            navigation={props.navigation}
          />
          <AddToCartModal
            navigation={props.navigation}
            closeCartModal={closeCartModal}
            visible={cartModal}
          />
        </ScrollView>
      </SafeAreaView>
      <Modal visible={zoomImageModal} transparent={true}>
        <ImageViewer
          renderHeader={() => (
            <TouchableOpacity
              onPress={() => {
                setZoomImageModal(false);
              }}
              style={{
                position: 'absolute',
                top: wp(10),
                right: wp(5),
                zIndex: 1,
              }}>
              <TextRegular style={{color: 'white', fontSize: wp(4)}}>
                {'\u00D7'}
              </TextRegular>
            </TouchableOpacity>
          )}
          imageUrls={imagesList}
        />
      </Modal>
    </SafeAreaProvider>
  );
}
function calculateDiscount(
  price: string,
  compare_at_price: null,
): React.ReactNode {
  if (!_.isNull(compare_at_price)) {
    var discount_tag = Math.round(
      Number(parseInt(price) / parseInt(compare_at_price)) * 100,
    );
    discount_tag = 100 - discount_tag;
    return discount_tag;
  }
  return '';
}
const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    Container1: {
      backgroundColor: '#fff',
      borderBottomRightRadius: 15,
      borderBottomLeftRadius: 15,
      marginTop: wp(96),
    },
    pageImage: {
      width: wp(100),
      height: hp(50),
    },
    pageView: {
      height: hp(50),
      // marginTop: hp(1.5),
    },
    backBtn: {
      top: hp(5),
      width: wp(12),
      backgroundColor: colors.primary,
      height: hp(6),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      left: wp(3),
      position: 'absolute',
    },
    rating: {
      flexDirection: 'row',
      width: wp(50),
      top: wp(4),
      marginBottom: 6,
      marginLeft: wp(2),
    },
    review: {
      // marginTop: wp(2),
      color: 'grey',
      marginLeft: wp(2),
    },
    inStock: {
      // marginLeft: wp(38),
      color: colors.primary,
      fontWeight: 'bold',
    },
    title: {
      fontSize: wp(5),
      width: wp(90),
      marginTop: 8,
      marginLeft: wp(2),
      color: 'grey',
    },
    price: {
      color: colors.gradient1,
      fontWeight: 'bold',
      fontSize: wp(5),
      marginTop: 8,
      marginLeft: wp(2),
    },
    discount_price: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: wp(3.8),
      marginVertical: wp(1),
      marginLeft: wp(2),
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
    },
    baseStyle: {
      color: '#000',
    },
    note: {
      color: colors.secondary,
      fontWeight: 'bold',
      marginLeft: wp(2),
    },
    imgList: {
      width: 50,
      height: 50,
      marginHorizontal: wp(3),
      borderRadius: 8,
      marginVertical: hp(2),
      marginLeft: wp(2),
    },
    sizeList: {
      width: 50,
      height: 50,
      marginHorizontal: wp(1.5),
      borderRadius: 8,
      marginVertical: hp(2),
      marginLeft: wp(2),
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'grey',
    },
    quantity: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: wp(50),
      // marginLeft: wp(2),
      alignItems: 'center',
      top: 4,
    },
    btnContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: wp(85),
      alignSelf: 'center',
      marginBottom: hp(1.5),
    },
    cartBtn: {
      width: wp(40),
      height: hp(6),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary,
      flexDirection: 'row',
      borderRadius: 10,
      marginTop: hp(4),
    },
    buyBtn: {
      width: wp(40),
      height: hp(6),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'gold',
      flexDirection: 'row',
      borderRadius: 10,
      marginTop: hp(4),
    },
    Container2: {
      marginTop: hp(1),
      backgroundColor: '#fff',
      borderRadius: 15,
      height: Platform.OS == 'ios' ? hp(18) : hp(20),
    },
    productText: {
      fontWeight: 'bold',
      fontSize: wp(5),
      marginLeft: wp(2),
      marginTop: Platform.OS == 'ios' ? hp(2) : hp(2),
      color: '#000',
    },
    Container3: {
      backgroundColor: '#fff',
      height: Platform.OS == 'ios' ? hp(28) : 'auto',
      borderRadius: 15,
      marginTop: hp(1),
    },
    reviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: wp(98),
      alignSelf: 'center',
    },

    text: {
      fontSize: wp(1.5),
      color: '#000',
      marginVertical: hp(1),
      left: wp(2),
    },
    flatList1: {
      width: wp(45),
      height: hp(20),
      borderRadius: 10,
      overflow: 'hidden',
      marginVertical: 8,
      marginHorizontal: 2,
    },
    text3: {
      fontSize: wp(3),
      width: wp(45),
      color: '#000',
    },
    priceView: {
      flexDirection: 'row',
    },
    price1: {
      color: colors.title,
      fontSize: wp(4),
      fontWeight: 'bold',
    },
    priceLine: {
      textDecorationLine: 'line-through',
      color: 'grey',
      fontSize: wp(3.5),
      left: wp(2),
      top: 2,
    },
    badgeView: {
      width: 20,
      height: 'auto',
      backgroundColor: 'red',
      position: 'absolute',
      zIndex: 1,
      borderRadius: 50,
      alignItems: 'center',
      top: 0,
      right: 5,
      paddingVertical: 1,
    },
    discount: {
      height: hp(3),
      width: wp(15),
      alignSelf: 'flex-start',
      position: 'absolute',
      zIndex: 1,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: colors.title,
      justifyContent: 'center',
      alignItems: 'center',
      top: 4,
    },
    a: {
      fontWeight: '300',
      color: '#FF3366', // make links coloured pink
    },
  });

{
  /* <View style={styles.dateView}>
          <Text style={styles.review}>Comment</Text>
          <TouchableOpacity
            onPress={() => sethelpfull(!helpful)}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.review}>Helpfull</Text>
            <AntDesign
              name={helpful ? 'like1' : 'like2'}
              color={helpful ? colors.title : 'grey'}
              size={20}
              style={{marginLeft: 5}}
            />
          </TouchableOpacity>
        </View> */
}
