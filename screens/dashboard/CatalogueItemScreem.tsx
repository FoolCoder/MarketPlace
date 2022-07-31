import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Pressable,
  Alert,
  BackHandler,
} from 'react-native';
//@ts-ignore
import StarRating from 'react-native-star-rating';
//@ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//@ts-ignore
import ModalDropdown from 'react-native-modal-dropdown';
import shopifyApiService from '../../services/ShopifyApiService';
import {useRoute, RouteProp, NavigationProp} from '@react-navigation/native';
import CatalogueItem from '../../components/common/CatalogueItem';
import Container from '../../components/common/Container';
import {hp, wp} from '../../components/common/Responsive';
import TextBold from '../../components/ui/TextBold';
import {DefaultPic, headerimage} from '../../constant/Images';
import {useAppSelector} from '../../hooks';
import {AllProduct, ColorsI, imageCollection} from '../../models';
import WhatsApp from '../../components/common/whatsappLogo';
import _ from 'lodash';
const {getProductbyCollection, getProductbyCollectionEnd, getProductcount} =
  shopifyApiService;
interface Props {
  navigation: any;
  route: RouteProp<
    {
      path: any;
      params: {
        item: any;
        title: string;
        catId: any;
        path: any;
      };
    },
    'params'
  >;
}
export default function CatalogueItemScreen(props: Props) {
  const [productsCollection, setproductsCollection] = useState<
    Array<AllProduct | undefined>
  >([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [loaderE, setLoaderE] = useState<boolean>(false);
  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const {colors} = dashboardReducer;
  const styles = useStyles(colors);
  const title = props.route.params?.item?.item?.title
    ? props.route.params?.item?.item?.title
    : props.route.params?.title;
  const Id = props.route.params?.item?.item?.id
    ? props.route.params?.item?.item?.id
    : props.route.params?.catId;
  const path =
    props.route.path == undefined ? props.route.params.path : props.route.path;
  console.log('props.route.params.path', path);

  useEffect(() => {
    getSaleProducts();
    if (props.navigation.isFocused()) {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    }
  }, [props.route.params]);

  function handleBackButtonClick() {
    if (path) {
      props.navigation.navigate(path!);

      return true;
    } else if (path == 'SearchScreen') {
      {
        props.navigation.navigate('Catalogue', {
          screen: 'SearchScreen',
        });
        return true;
      }
    } else {
      props.navigation.goBack();

      return true;
    }
  }
  const getSaleProducts = async () => {
    setLoader(true);
    const res = await getProductbyCollection(Id, 250);
    if (res?.status == 200) {
      var temp: any[] = [];

      res.data.products.map((e: any) => {
        if (e.status == 'active') {
          for (const i of e.variants) {
            if (i.inventory_quantity > 0) {
              // const found = res.data.products.some(el => el!.id === e.id);
              // if (!found) temp.push(e);
              if (temp.includes(e)) {
                break;
              } else {
                temp.push(e);
              }
            }
          }
          // console.log(temp);
        }
      });

      setproductsCollection(temp as any);
      setLoader(false);
    }
    setLoader(false);
  };
  const getSaleProductEnd = async () => {
    setLoaderE(true);
    const res = await getProductbyCollectionEnd(
      Id,
      productsCollection!.slice(-1).pop()?.id ?? '',
    );

    // return;

    if (res?.status == 200) {
      var temp1: any[] = [];

      res.data.products.map((e: any) => {
        if (e.status == 'active') {
          for (const i of e.variants) {
            if (i.inventory_quantity > 0) {
              const found = productsCollection.some(el => el!.id === e.id);

              if (!found) {
                if (temp1.includes(e)) {
                  break;
                } else {
                  temp1.push(e);
                }
              }
            }
          }
        }
      });

      setproductsCollection([...productsCollection, ...temp1]);

      setLoaderE(false);
    }
  };
  const renderItem1 = (item: any) => {
    let img = item?.item?.image?.src.split('?', 1).toString(); //add

    return (
      <>
        <TouchableOpacity
          // style={{width: wp(30), borderWidth: 1}}
          onPress={() =>
            props.navigation.navigate('SelectedProduct', {
              pId: item.item.id,
              // cId: props.route.params.item.item.id,
              title: title,
              catId: Id,
              path: 'CatalogueItemScreen',
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
  const onEnd = () => {
    getSaleProductEnd();
  };
  const renderFooter = () => {
    return loaderE && <ActivityIndicator size={'large'} />;
  };

  return (
    <Container
      path={path}
      navigation={props.navigation}
      cart
      arrow //fix Qazafi
      headerTitle={title}>
      <>
        {/* <SearchBar {...props} /> */}
        <Pressable
          onPress={() =>
            props.navigation.navigate('Catalogue', {
              screen: 'SearchScreen',
              // path: 'CatalogueItemScreen',
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
        <View style={styles.sortView}>
          <Text style={styles.len}>{productsCollection.length} Items</Text>
        </View>
        {loader ? (
          <ActivityIndicator
            style={{justifyContent: 'center', flex: 1}}
            size="large"
            color={colors.secondary}
          />
        ) : productsCollection.length > 0 ? (
          <FlatList
            style={{flexGrow: 0}}
            numColumns={2}
            // columnWrapperStyle={styles.row}
            showsHorizontalScrollIndicator={false}
            data={productsCollection}
            renderItem={renderItem1}
            onEndReached={onEnd}
            ListFooterComponent={renderFooter}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextBold
              style={{
                color: 'grey',
                textAlign: 'center',
                fontSize: wp(2.5),
              }}>
              No Product Avaiable!
            </TextBold>
          </View>
        )}
        <WhatsApp />
      </>
    </Container>
  );
}
const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    row: {
      flex: 0.5,
      justifyContent: 'space-around',
    },
    SearchView: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      width: wp(85),
      alignSelf: 'center',
      zIndex: 1,
      top: hp(-2.5),
      borderRadius: 25,
      height: wp(10),
      justifyContent: 'flex-start',
      elevation: 10,
      shadowColor: 'black',
      shadowOpacity: 0.26,
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 10,
      alignItems: 'center',
    },
    len: {
      fontWeight: 'bold',
      fontSize: wp(5),
      marginLeft: 8,
      color: 'grey',
    },
    sortView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    sortby: {
      flexDirection: 'row',
      marginRight: wp(5),
      width: wp(36),
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dropDownStyle: {
      height: hp(10),
      width: wp(29),
      borderWidth: 2,
      right: 5,
    },
    textView: {
      width: wp(22),
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    selectedText: {
      color: '#000',
      fontSize: wp(3.5),
      fontWeight: 'bold',
    },

    pageView: {
      height: hp(20),
      marginTop: hp(1.5),
    },
    pageimg: {
      height: hp(20),
      width: wp(95),
      alignSelf: 'center',
      borderRadius: 15,
      overflow: 'hidden',
    },
    pagetext: {
      fontSize: wp(2),
      top: 20,
      left: 15,
    },
    seeMore: {
      fontSize: wp(1.1),
      color: 'gold',
      marginTop: wp(8),
      marginLeft: wp(4),
    },
    text1: {
      fontSize: wp(1.3),
      color: '#34283e',
      marginVertical: hp(2),
      left: wp(4),
      marginRight: wp(5),
      // fontFamily: 'Cochin',
    },
    seeAll: {
      color: 'grey',
      fontWeight: 'bold',
      fontSize: wp(3.5),
    },
    flatList: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginHorizontal: 5,
      left: 8,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
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
    flashsales: {
      flexDirection: 'row',
      // justifyContent: 'center',
      alignItems: 'center',
    },
    watch: {
      backgroundColor: colors.title,
    },
    text2: {
      textAlign: 'center',
    },
    seeAllView: {
      marginLeft: wp(23),
      flexDirection: 'row',
      height: hp(3),
      justifyContent: 'center',
      alignItems: 'center',
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
    price: {
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
  });
