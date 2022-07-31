import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  ActivityIndicator,
  Pressable,
  BackHandler,
} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import Swiper from 'react-native-swiper';
import {
  DrawerActions,
  NavigationProp,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';
//@ts-ignore
import CountDown from 'react-native-countdown-component';
//@ts-ignore
import StarRating from 'react-native-star-rating';
//@ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';

import Container from '../../components/common/Container';
import {hp, wp} from '../../components/common/Responsive';
import TextBold from '../../components/ui/TextBold';
import {
  headerimage,
  DefaultPic,
  supalogo,
  CollectionTitle,
} from '../../constant/Images';
import {
  ColorsI,
  BannerListI,
  AllProduct,
  imageCollection,
  Collection_IdResponse,
} from '../../models';

import {useAppSelector} from '../../hooks';
import supaAuthApiService from '../../services/SupaAuthApiService';
import shopifyApiService from '../../services/ShopifyApiService';
import DrawerImage from '../../assets/allicons/drawer.svg';
import DeviceInfo from 'react-native-device-info';
import WhatsApp from '../../components/common/whatsappLogo';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import FirebaseInitialization from '../../utils/firebase';
import VirtualizedView from '../../components/common/VirtualizedView';
import _ from 'lodash';
import {checkFakeNumber} from '../../utils';
import AuthModal from '../../components/common/AuthModal';
import PhonePopup from '../../components/common/PhonePopup';
import {SaleId} from '../../redux/reducer/dashboardSlice';
import {ItemType} from 'react-native-dropdown-picker';
import CatalogueItem from '../../components/common/CatalogueItem';
import EventEmitter from '../../events/eventemittter';
import {Events} from '../../models/events';

const {getCollection, getProduct, getProductbyCollection, getProductEnd} =
  shopifyApiService;
interface props {
  navigation: NavigationProp<ParamListBase>;
  uri?: string | undefined;
}
interface collection {
  id: number;
  key: string;
  status: string;
  value: string;
}
interface ListRenderItemInfo<ItemT> {
  item: ItemT;

  index: number;

  separators: {
    highlight: () => void;
    unhighlight: () => void;
    updateProps: (select: 'leading' | 'trailing', newProps: any) => void;
  };
}

export default function Home(props: props) {
  const [banner, setbanner] = useState<Array<BannerListI | undefined>>([]);
  const [collection, setcollection] = useState<Array<any | undefined>>([]);
  const [products, setproducts] = useState<Array<AllProduct[] | undefined>>([]);
  const [productsCollection, setproductsCollection] = useState<
    Array<AllProduct>
  >([]);

  const [loaderP, setLoaderP] = useState<boolean>(false);
  const [loaderC, setLoaderC] = useState<boolean>(false);
  const [loaderSP, setLoaderSP] = useState<boolean>(false);
  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const authReducer = useAppSelector(state => state.authReducer);
  const {colors, Sale_Id, Banner} = dashboardReducer;
  const [modalVisible, setmodalVisible] = useState<boolean>(false);
  const {user} = authReducer;
  const styles = useStyles(colors);
  let timer: number = 86400;

  useEffect(() => {
    // ?Refresh data after user purchase some items

    EventEmitter.on(Events.RefreshHomeData, () => {
      setLoaderSP(true);
      var allCollections: AllProduct[] = [];
      saleCollection(0, Sale_Id!, allCollections);
    });
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      EventEmitter.off(Events.RefreshHomeData, () => {});
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  useEffect(() => {
    const phoneNumber = authReducer?.user
      ?.phone!.replace('+92', '')
      .replace('92', '');
    if (phoneNumber?.slice(1, 6) == checkFakeNumber) {
      setmodalVisible(true);
    }
    setbanner(Banner);

    getCollections();
    getProducts();
    supaAuthApiService.setAuth(authReducer.token!);
    FirebaseInitialization(authReducer.user?.id!, props.navigation);
    supaAuthApiService.setNavigation(props.navigation);
  }, []);
  useEffect(() => {
    setLoaderSP(true);
    var allCollections: AllProduct[] = [];
    saleCollection(0, Sale_Id!, allCollections);
  }, []);
  function handleBackButtonClick() {
    BackHandler.exitApp();
    return true;
  }
  const onClose = () => {
    setmodalVisible(false);
  };
  function calculateDiscount(
    price: string,
    compare_at_price: null,
  ): React.ReactNode {
    if (!_.isNull(compare_at_price)) {
      var discount_tag = Math.round(
        Number(parseInt(price) / parseInt(compare_at_price)) * 100,
      );
      discount_tag = 100 - discount_tag;
      return String(discount_tag);
    }
    return '';
  }
  //@ts-ignore
  async function saleCollection(
    index: number,
    collections: SaleId,
    allCollections: AllProduct[],
  ) {
    if (index > collections.collection_detail.length - 1) {
      setLoaderSP(false);
      return;
    } else {
      const res = await getFlashSaleProducts(
        collections.collection_detail[index].c_id ?? '',
      );
      allCollections.push(res as AllProduct);

      setproductsCollection(allCollections);

      index = index + 1;

      return saleCollection(index, collections, allCollections);
    }
  }
  const getCollections = async () => {
    setLoaderC(true);
    let temp: any = [];
    const res = await getCollection();

    if (res?.status == 200) {
      res.data.smart_collections.map(e => {
        CollectionTitle.map((a, i) => {
          if (a.key == e.title) {
            CollectionTitle[i].value = e;
          }
        });
      });

      CollectionTitle.map(e => {
        temp.push(e.value);
      });
      setcollection(temp!);

      setLoaderC(false);
    } else {
      return [];
    }
  };
  const getProducts = async () => {
    var temp: any[] = [];

    setLoaderP(true);
    var a = new Array<any>();
    a = products!;
    const res = await getProduct();

    // return;
    if (res?.status == 200) {
      res.data.products.map((e: any) => {
        if (e.status == 'active') {
          for (const i of e.variants) {
            if (i.inventory_quantity > 0) {
              const found = productsCollection.some(el => el!.id === e.id);
              if (!found) {
                temp.push(e);
              }
            }
          }
        }
      });

      // var response = temp.slice(offset * 7, (offset + 1) * 7 - 1);
      // a = [...products, ...response];
      // setOffset(offset + 1);

      // a = res?.data.products;

      setproducts(temp);

      setLoaderP(false);
    } else {
      setLoaderP(false);
    }
  };

  // const getProductend = async () => {
  //   setLoaderP(true);
  //   const res = await getProductEnd(products!.slice(-1).pop()?.id ?? '');

  //   if (res?.status == 200) {
  //     var temp: any[] = [];

  //     res.data.products.map((e: any) => {
  //       if (e.status == 'active') {
  //         for (const i of e.variants) {
  //           if (i.inventory_quantity > 0) {
  //             const found = productsCollection.some(el => el!.id === e.id);
  //             if (!found) {
  //               temp.push(e);
  //             }
  //           }
  //         }
  //       }
  //     });

  //     // [...products, ...(temp as any)];
  //     setproducts([...products, ...(temp as any)]);

  //     setLoaderP(false);
  //   }
  // };

  const getFlashSaleProducts = async (id: any) => {
    const res = await getProductbyCollection(id, 10);

    if (res?.status == 200) {
      return res.data;
    }
    return [];
  };
  const renderCollection = (item: any) => {
    item;
    console.log();

    let img = item?.item?.image?.src.split('?', 1).toString();

    return (
      <TouchableOpacity
        key={item.index}
        onPress={() =>
          props.navigation.navigate('Catalogue', {
            screen: 'CatalogueItemScreen',
            initial: false,
            params: {item, title: item.item.title, catId: item.item.id},
            path: 'Home',
          })
        }
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          height: 'auto',
          marginTop: 5,
        }}>
        {img ? (
          <FastImage
            style={[
              styles.flatList,
              {width: 80, height: 80, marginRight: wp(4)},
            ]}
            source={{uri: img, priority: FastImage.priority.high}}
          />
        ) : (
          <Image
            style={[
              styles.flatList,
              {width: 80, height: 80, marginRight: wp(5)},
            ]}
            source={DefaultPic}
          />
        )}

        <Text numberOfLines={2} style={[styles.text2, {height: 'auto'}]}>
          {item?.item?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAllProducts = (item: any) => {
    let img = item?.item?.image?.src.split('?', 1).toString();

    return (
      <>
        <TouchableOpacity
          // style={{width: wp(30), borderWidth: 1}}
          onPress={() =>
            props.navigation.navigate('Catalogue', {
              screen: 'SelectedProduct',
              initial: false,

              params: {pId: item.item.id},
              path: 'Home',
            })
          }>
          <CatalogueItem
            name={item.item.title}
            img={img}
            text={item.item.title}
            price={item.item.variants[0].price}
            // {item.item.variants.map((e: any) => {
            //   return e.price;
            // })}
            priceL={item.item.variants.map((e: any) => {
              return e.compare_at_price;
            })}
            discount={item.item.discount}
            seeMore={item.item.seeMore}
            // path={[path]}
          />
        </TouchableOpacity>
      </>
    );
  };
  //rendering sale product
  const renderCollectionProducts = (item: any) => {
    // return;
    let img = item?.item?.image?.src.split('?', 1).toString();
    // *show only those items which have quantity >0
    var showProduct: boolean = item.item.variants.some(
      (item: {inventory_quantity: number}) => item.inventory_quantity > 0,
    );

    if (item.item.status == 'active') {
      if (showProduct) {
        return (
          <TouchableOpacity
            key={item.index}
            onPress={() =>
              props.navigation.navigate('Catalogue', {
                screen: 'SelectedProduct',
                initial: false,

                params: {pId: item.item.id},
                path: 'Home',
              })
            }
            style={{
              left: wp(2),
              marginEnd: wp(1),
              right: wp(2),
            }}>
            {!_.isUndefined(img) ? (
              <ImageBackground style={[styles.flatList1]} source={{uri: img}}>
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
                        }}>
                        {/* <DiscountIcon
                    width={20}
                    height={20}
                    style={{marginLeft: wp(5), marginBottom: -wp(1)}}
                  /> */}

                        <Text
                          style={[
                            styles.price,
                            {marginLeft: 2, fontSize: wp(3.5), color: '#fff'},
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
            ) : (
              <View />
            )}

            <View style={{left: 2}}>
              <Text numberOfLines={2} style={styles.text3}>
                {item?.item?.title}
              </Text>
              <View style={styles.priceView}>
                <Text style={styles.price}>
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
                    }}>
                    {item.item.variants![0]?.compare_at_price == '0.00'
                      ? null
                      : `Rs ${item.item.variants![0]?.compare_at_price}`}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    }
    return null;
  };

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            props.navigation.navigate('Catalogue', {
              screen: 'CatalogueItemScreen',
              initial: false,
              params: {title: 'All Products', catId: 391950369027},
              path: 'Home',
            })
          }
          //On Click of button calling getData function to load more data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load More</Text>
          {/* {loaderP ? (
            <ActivityIndicator color="white" style={{marginLeft: 8}} />
          ) : null} */}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Container
      navigation={props.navigation}
      cart
      drawer={
        <TouchableOpacity
          style={{
            left: wp(4),
            position: 'absolute',
            top: deviceInfoModule.hasNotch() ? hp(6.4) : hp(4.5),
            marginTop: Platform.OS == 'ios' ? hp(2.2) : 0,
          }}
          onPress={() => props.navigation.dispatch(DrawerActions.openDrawer())}>
          <DrawerImage width={21} height={21} />
        </TouchableOpacity>
      }
      logo={
        <Image
          style={{
            height: Platform.OS == 'ios' ? hp(7) : hp(5.5),
            width: wp(42),
            top: DeviceInfo.hasNotch() ? -wp(4) : -4,
          }}
          source={supalogo}
        />
      }>
      <>
        <Pressable
          onPress={() =>
            props.navigation.navigate('Catalogue', {
              screen: 'SearchScreen',
              params: {path: 'Home'},
            })
          }
          style={styles.SearchView}>
          <>
            <MaterialIcons
              name="search"
              size={25}
              color={'grey'}
              style={{marginLeft: 10}}
            />
            <Text style={{color: '#9B9B9B', marginLeft: 5}}>
              What are you looking for?
            </Text>
          </>
        </Pressable>
        {/* <TouchableWithoutFeedback
          onPress={() =>
            props.navigation.navigate('Catalogue', {
              screen: 'SearchScreen',
              path: 'Home',
            })
          }
          style={styles.SearchView}>
          <>
            <MaterialIcons
              name="search"
              size={25}
              color={'grey'}
              style={{marginLeft: 10}}
            />
            <Text style={{color: '#9B9B9B', marginLeft: 5}}>
              What are you looking for?
            </Text>
          </>
        </TouchableWithoutFeedback> */}
        <VirtualizedView>
          <View style={styles.pageView}>
            <Swiper
              key={banner?.length ?? 0}
              autoplay
              loop
              autoplayDirection
              activeDotColor="#000"
              dotStyle={{
                width: 40,
                top: Platform.OS == 'ios' ? hp(3) : hp(3),
                height: 4,
              }}
              activeDotStyle={{
                width: 40,
                top: Platform.OS == 'ios' ? hp(3) : hp(3),
                height: 4,
              }}>
              {banner?.map(e => {
                return (
                  <Image
                    key={e?.id}
                    style={styles.pageimg}
                    source={{uri: e?.value ? e.value : DefaultPic}}
                  />
                );
              })}
            </Swiper>
          </View>
          <View style={{marginTop: -8, height: 'auto'}}>
            {loaderC ? (
              <ActivityIndicator
                style={{justifyContent: 'center', flex: 1}}
                size="large"
                color={colors.secondary}
              />
            ) : (
              <>
                <TextBold style={styles.text1}>Categories</TextBold>
                <FlatList
                  style={{flexGrow: 0}}
                  showsHorizontalScrollIndicator={false}
                  data={collection}
                  horizontal
                  renderItem={renderCollection}
                />
              </>
            )}
          </View>
          <View>
            {Sale_Id!?.collection_detail?.map((e, i) => {
              if (productsCollection[i] != undefined) {
                return (
                  <>
                    <View
                      style={[
                        styles.flashsales,
                        {
                          height: hp(6),
                          marginTop: 5,
                          justifyContent: 'space-between',
                        },
                      ]}>
                      <TextBold style={styles.textF1}>{e.c_name}</TextBold>
                      {i == 0 && (
                        <CountDown
                          until={timer}
                          digitStyle={styles.watch}
                          digitTxtStyle={{color: '#fff'}}
                          // onFinish={() => Alert.alert('finished')}
                          // onPress={() => Alert.alert('hello')}
                          timeToShow={['H', 'M', 'S']}
                          timeLabels={{m: '', s: ''}}
                          size={12}
                        />
                      )}
                      <TouchableOpacity
                        onPress={() =>
                          props.navigation.navigate('Catalogue', {
                            screen: 'CatalogueItemScreen',
                            initial: false,
                            params: {
                              title: e.c_name,
                              catId: e.c_id,
                            },
                            path: 'Home',
                          })
                        }
                        style={[
                          styles.seeAllView,
                          // {left: i != 0 ? wp(25) : wp(-2)},
                        ]}>
                        <Text style={[styles.seeAll]}>See All</Text>
                        <MaterialIcons
                          name="keyboard-arrow-right"
                          color="grey"
                          size={26}
                          style={{marginTop: hp(-0.2)}}
                        />
                      </TouchableOpacity>
                    </View>
                    {loaderSP ? (
                      <ActivityIndicator
                        style={{justifyContent: 'center', flex: 1}}
                        size="large"
                        color={colors.secondary}
                      />
                    ) : !_.isUndefined(productsCollection[i]) ? (
                      <FlatList
                        style={{flexGrow: 0}}
                        horizontal
                        // numColumns={2}
                        showsHorizontalScrollIndicator={false}
                        data={productsCollection[i].products}
                        ListFooterComponent={() => (
                          <View style={{width: wp(2.5)}} />
                        )}
                        renderItem={renderCollectionProducts}
                      />
                    ) : (
                      <View />
                    )}
                  </>
                );
              } else {
                return null;
              }
            })}
          </View>
          <>
            <TextBold style={styles.textP}>All Products</TextBold>

            <FlatList
              scrollEnabled={false}
              disableScrollViewPanResponder
              numColumns={2}
              showsVerticalScrollIndicator={false}
              initialNumToRender={20}
              removeClippedSubviews={true}
              maxToRenderPerBatch={20}
              updateCellsBatchingPeriod={500}
              data={products!}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderAllProducts}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
            />
          </>
        </VirtualizedView>
        <WhatsApp />
        <PhonePopup
          modalVisible={modalVisible}
          imgtype="red-tick"
          text="Please Enter Your Phone Number"
          onClose={onClose}
          social={user?.is_social}
          navgation={props.navigation}
        />
      </>
    </Container>
  );
}
const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    SearchView: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      width: wp(85),
      alignSelf: 'center',
      zIndex: 1,

      marginTop: hp(-2.5),
      borderRadius: 25,
      height: wp(10),
      justifyContent: 'flex-start',
      elevation: 10,
      shadowColor: 'black',
      shadowOpacity: 0.26,
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 10,
      alignItems: 'center',
      // position: 'absolute',
    },
    pageView: {
      height: Platform.OS == 'ios' ? hp(18) : hp(20),
      width: '95%',
      overflow: 'hidden',
      alignSelf: 'center',
      top: Platform.OS == 'ios' ? hp(-0) : wp(-3),
    },
    pageimg: {
      height: Platform.OS == 'ios' ? hp(15) : hp(20),
      width: 'auto',
      resizeMode: 'contain',
      borderRadius: 15,
      overflow: 'hidden',
      marginTop: Platform.OS == 'ios' ? 5 : 0,
    },
    pagetext: {
      fontSize: wp(2),
      top: 20,
      left: 15,
    },
    seeMore: {
      fontSize: wp(4),
      color: 'gold',
      marginLeft: wp(4),
      fontWeight: 'bold',
    },
    text1: {
      marginTop: Platform.OS == 'ios' ? hp(1) : 0,
      fontSize: wp(1.3),
      color: '#34283e',
      // marginVertical: hp(2),
      left: wp(4),
      marginRight: wp(5),
      // fontFamily: 'Cochin',
      // top: -12,
    },
    textP: {
      fontSize: wp(1.3),
      color: '#34283e',
      // marginVertical: hp(2),
      left: wp(4),
      marginRight: wp(5),
      height: hp(3),
      marginTop: 8,
      // borderWidth: 1,
    },
    textN: {
      fontSize: wp(1.3),
      color: '#34283e',
      // marginVertical: hp(2),
      left: wp(4),
      marginRight: wp(5),
      // fontFamily: 'Cochin',
      // top: -12,
    },
    textH: {
      fontSize: wp(1.3),
      color: '#34283e',
      // marginVertical: hp(2),
      left: wp(4),
      marginRight: wp(5),
      // fontFamily: 'Cochin',
      // top: -12,
    },
    textF: {
      fontSize: wp(1.3),
      color: '#34283e',
      marginVertical: hp(2),
      left: wp(4),
      marginRight: wp(5),
      height: hp(3.5),
    },
    textF1: {
      fontSize: wp(1.3),
      color: '#34283e',
      marginVertical: hp(2),
      left: wp(4),
      marginRight: wp(5),
      height: hp(3.5),
    },
    seeAll: {
      color: 'grey',
      fontWeight: 'bold',
      fontSize: wp(3.5),
    },
    flatList: {
      borderRadius: 10,
      // marginHorizontal: 5,
      left: 8,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: hp(1),
    },
    discount: {
      height: hp(3),
      width: wp(16),
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
    flashsales: {
      flexDirection: 'row',
      // justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(-1),
    },
    watch: {
      backgroundColor: colors.title,
    },
    text2: {
      textAlign: 'center',
      color: '#000',
      width: 80,
      fontWeight: 'bold',
      left: 1,
    },
    seeAllView: {
      marginLeft: wp(23),
      flexDirection: 'row',
      // height: hp(3),
      justifyContent: 'center',
      alignItems: 'center',
    },
    flatList1: {
      width: wp(38),
      height: hp(20),
      borderRadius: 10,
      overflow: 'hidden',
      marginVertical: 8,
      marginHorizontal: 2,
    },
    flatList2: {
      width: wp(45),
      height: hp(20),
      borderRadius: 10,
      overflow: 'hidden',
      marginVertical: 8,
      marginHorizontal: 2,
    },
    text4: {
      fontSize: wp(3),
      width: wp(45),
      color: '#000',
    },
    text3: {
      fontSize: wp(3),
      width: wp(35),
      color: '#000',
    },
    priceView: {
      flexDirection: 'row',
    },
    price: {
      color: colors.title,
      fontSize: wp(3.5),
      fontWeight: 'bold',
    },
    priceLine: {
      textDecorationLine: 'line-through',
      color: 'grey',
      fontSize: wp(3.5),
      left: wp(2),
      top: 2,
    },
    footer: {
      paddingTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    loadMoreBtn: {
      padding: 10,
      backgroundColor: colors.primary,
      borderRadius: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnText: {
      color: 'white',
      fontSize: 15,
      textAlign: 'center',
    },
  });
