import {RouteProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import {AnySchema} from 'yup';
import Product from '../../components/common/Product';
import WhatsApp from '../../components/common/whatsappLogo';
import {headerimage, authHeader, category} from '../../constant/Images';
import {useAppSelector} from '../../hooks';
import {AllProduct} from '../../models';
import shopifyApiService from '../../services/ShopifyApiService';
const {getCollectionPID, ProductById} = shopifyApiService;

// title, body_html, variants, images, options

export interface Variants {
  admin_graphql_api_id: string;
  barcode: null;
  compare_at_price: null;
  created_at: string;
  fulfillment_service: string;
  grams: number;
  id: number;
  image_id: null;
  inventory_item_id: number;
  inventory_management: string;
  inventory_policy: string;
  inventory_quantity: number;
  old_inventory_quantity: number;
  option1: string;
  option2: null;
  option3: null;
  position: number;
  price: string;
  product_id: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  updated_at: string;
  weight: number;
  weight_unit: string;
}
export interface ProductDataI {
  title: string;
  body_html: string;
  variants?: Variants[];
  images: {
    src: string;
  }[];
  options: {
    id: number;
    name: string;
    position: number;
    // product_id: number;
    values: string[];
  }[];
  review: number;
  id: number;
  productDetail: string;
  color?: string[];
  pId: number | undefined;
}
interface route {
  navigation: any;
  route: RouteProp<
    {
      path: any;

      params: {
        pId?: any;
        cId?: any;
        path?: any;
        title: string;
        catId: any;
      };
    },
    'params'
  >;
}
const SelectedProduct: React.FC<route> = ({navigation, route}) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [loaderP, setLoaderP] = useState<boolean>(false);
  const [cId, setcId] = useState<number | undefined>(undefined);
  const [products, setproducts] = useState<ProductDataI | undefined>();

  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const {colors} = dashboardReducer;
  const path = route.path == undefined ? route.params.path : route.path;
  const title1 = route.params.title;
  console.log('wefbwehjfvwe', route.path, route.params.path);

  useEffect(() => {
    getCollectionByProduct();
    getProductById();
  }, [route.params.pId]);

  const getCollectionByProduct = async () => {
    setLoader(true);

    const res = await getCollectionPID(route.params?.pId);

    if (res?.status == 200) {
      const ind =
        res.data.smart_collections[
          Math.floor(Math.random() * res.data.smart_collections.length)
        ];
      setcId(ind?.id ?? undefined);
      setLoader(false);
    } else {
    }
  };

  const getProductById = async () => {
    const res = await ProductById(route.params.pId);

    if (res?.status == 200) {
      let p = res.data.products![0];
      const productData: ProductDataI = {
        title: p.title,
        body_html: p.body_html,
        variants: p.variants,
        images: p.images,
        options: p.options,
        review: 7,
        id: p.id,
        productDetail: '',
        pId: route.params.pId,
      };
      setproducts(productData);
    }
  };

  return (
    <View style={{flex: 1}}>
      {loader ? (
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : products ? (
        <Product
          navigation={navigation}
          productData={products}
          cId={cId}
          path={path}
          title={title1!}
          catId={route.params.catId}
        />
      ) : (
        <ActivityIndicator style={{flex: 1}} size={'large'} />
      )}
      <WhatsApp productName={products?.title} />
    </View>
  );
};
export default SelectedProduct;
