import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import shopifyApiService from '../../services/ShopifyApiService';
//@ts-ignore
import base64 from 'react-native-base64';

import {headerimage, DefaultPic, CollectionTitle} from '../../constant/Images';
import Container from '../../components/common/Container';
import {hp, wp} from '../../components/common/Responsive';
import SearchBar from '../../components/common/SearchBar';
import {ColorsI, custom_collections, searchProducts} from '../../models';
import {Colors} from '../../constant/Colors';
import {useAppSelector} from '../../hooks';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import CatalogueItem from '../../components/common/CatalogueItem';
import WhatsApp from '../../components/common/whatsappLogo';

import TextBold from '../../components/ui/TextBold';
import {takeRightWhile} from 'lodash';
import {searchProduct} from '../../services/GraphQLApi';
import FastImage from 'react-native-fast-image';
const {getCollection} = shopifyApiService;

interface Props {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<
    {
      params?: {
        pId?: any;
        cId?: any;
        path?: any;
        title: string;
        titleFlag?: boolean;
      };
    },
    'params'
  >;
}
const Catalogue = (props: Props) => {
  const isFocused = useIsFocused();
  const [loader, setLoader] = useState<boolean>(false);
  const [loaderP, setLoaderP] = useState<boolean>(false);
  const [textF, settextF] = useState<boolean>(false);

  const [focus, setFocus] = useState<boolean>(false);

  const [collection, setcollection] = useState<
    Array<custom_collections | undefined>
  >([]);
  const [products, setProducts] = useState<Array<searchProducts | null>>([]);
  const [filter, setfilter] = useState<Array<custom_collections | undefined>>(
    [],
  );
  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const {colors} = dashboardReducer;
  const styles = useStyles(colors);
  type titleHeader = 'Search' | 'Catalogues';

  useEffect(() => {
    if (isFocused) {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

      getCollections();
    } else {
      setProducts([]);
    }
    return () =>
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
  }, [props.navigation.isFocused()]);
  function handleBackButtonClick() {
    if (props.route.params?.path) {
      props.navigation.navigate(props.route.params.path!);

      return true;
    } else if (props.route.params?.path == 'SearchScreen') {
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
  const getCollections = async () => {
    setLoader(true);
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

      setLoader(false);
    } else {
      return [];
    }
  };
  const renderItem = (item: any) => {
    let img = item?.item?.image?.src.split('?', 1).toString();

    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('Catalogue', {
            screen: 'CatalogueItemScreen',
            initial: false,
            params: {item},
            path: 'SearchScreen',
          })
        }
        style={styles.flatList}>
        <Text style={styles.text2}> {item?.item?.title}</Text>
        {img ? (
          <FastImage
            style={styles.img}
            source={{uri: img, priority: FastImage.priority.high}}
          />
        ) : (
          <Image style={[styles.img, {height: hp(12)}]} source={DefaultPic} />
        )}
      </TouchableOpacity>
    );
  };
  const handleSearch = async (str: string) => {
    setLoaderP(true);
    if (str.length > 2) {
      const response = await searchProduct(str);
      if (response?.data?.products?.edges.length > 0) {
        setProducts(response?.data?.products?.edges as any);
        setLoaderP(false);
      } else if (response?.data?.products?.edges.length == 0) {
        settextF(true);
        setLoaderP(false);
      }
    } else {
      setProducts([]);
      settextF(false);
      setLoaderP(false);
    }
  };
  const onFocus = (e: boolean) => {
    setFocus(true);
  };
  const onBlur = (e: boolean) => {
    setFocus(false);
  };
  const renderItem1 = (item: any) => {
    const {id, description, images, options, title, variants, media} =
      item.item.node;
    const {edges} = media;
    const productId = base64.decode(id).split('/', 5).slice(4).toString();
    let img = edges[0]?.node.image.originalSrc.split('?', 1).toString();

    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('SelectedProduct', {
            pId: productId,
            path: 'CatalogueI',
          })
        }>
        <CatalogueItem
          name={title}
          img={img}
          text={title}
          price={variants.edges[0].node.price}
          priceL={''}
          // {item.item.variants.map((e: any) => {
          //   return e.price;
          // })}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Container
      path={props.route.params?.path}
      navigation={props.navigation}
      cart
      arrow
      headerTitle={'Search'}>
      <View style={styles.container}>
        <SearchBar
          focus={focus}
          handleSearch={handleSearch}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        {products?.length > 0 ? (
          <FlatList
            key={'_'}
            style={{flexGrow: 0}}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            data={products}
            renderItem={renderItem1}
          />
        ) : loaderP ? (
          <ActivityIndicator
            style={{justifyContent: 'center', flex: 1}}
            size="large"
            color={colors.secondary}
          />
        ) : focus && products.length == 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TextBold style={{color: 'grey', fontSize: wp(1.5)}}>
              {!textF ? 'Search Products!' : 'Not Found!'}
            </TextBold>
          </View>
        ) : loader ? (
          <ActivityIndicator
            style={{justifyContent: 'center', flex: 1}}
            size="large"
            color={colors.secondary}
          />
        ) : (
          <FlatList
            key={'#'}
            style={{flexGrow: 0}}
            showsHorizontalScrollIndicator={false}
            data={collection}
            extraData={collection}
            renderItem={renderItem}
          />
        )}
        <WhatsApp />
      </View>
    </Container>
  );
};

export default Catalogue;

const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    container: {
      backgroundColor: '#f5f2f2',
      flex: 1,
    },
    text2: {
      alignSelf: 'center',
      width: wp(55),
      // borderWidth: 1,
      color: 'black',
      fontWeight: 'bold',
      fontSize: wp(4),
      marginLeft: wp(2),
    },

    flatList: {
      width: wp(90),
      height: hp(12),
      borderRadius: 15,
      marginHorizontal: 5,
      overflow: 'hidden',
      flexDirection: 'row',
      marginVertical: 5,
      alignSelf: 'center',
      backgroundColor: '#fff',
      // alignItems: 'center',
      justifyContent: 'space-between',
    },
    img: {
      width: wp(30),
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15,
    },
  });
