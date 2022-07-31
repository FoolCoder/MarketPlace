import {
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
//@ts-ignore
import base64 from 'react-native-base64';

import {useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import shopifyApiService from '../../services/ShopifyApiService';
const {getOrder} = shopifyApiService;

import Container from '../../components/common/Container';
import {emptyCart} from '../../redux/reducer/dashboardSlice';
import {hp, wp} from '../../components/common/Responsive';
import store from '../../redux/store';
import TextBold from '../../components/ui/TextBold';
import {useAppSelector} from '../../hooks';
import {ColorsI} from '../../models';
import {Thanku} from '../../constant/Images';
import EventEmitter from '../../events/eventemittter';
import {Events} from '../../models/events';
import _ from 'lodash';
interface Props {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<
    {
      params: {
        url: string;
      };
    },
    'params'
  >;
}
const CompleteCheckout = (props: Props) => {
  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const [modal, setModal] = React.useState<boolean>(false);
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [loader, setloader] = useState(false);
  const disptach = useDispatch();
  const styles = useStyles(dashboardReducer.colors);
  const authReducer = useAppSelector(state => state.authReducer);
  const {colors} = dashboardReducer;
  useEffect(() => {
    OderId();
  }, [modal]);
  const OderId = async () => {
    setloader(true);
    const res = await getOrder(dashboardReducer?.shopifyCustomerId!);
    if (res.status == 200 && _.size(res.data?.data?.orders) > 0) {
      // const id = res.data.orders.pop();
      // console.log(res, res.data.orders[0].order_number);
      Alert.alert(res.data.orders[0].order_number);
      // setOrderId(res.data.orders[0].order_number ?? '');
      setloader(false);
    } else {
      setloader(false);
    }
  };
  return (
    <Container arrow headerTitle="Complete Checkout">
      <>
        <Modal isVisible={modal} style={{alignSelf: 'center'}}>
          <View style={styles.thankuModal}>
            <Image style={styles.thankuImg} source={Thanku} />
            <TextBold style={{color: 'black', fontSize: 4.5, marginTop: wp(5)}}>
              Thank You For Your Order
            </TextBold>
            <Text
              style={{
                color: colors.secondary,
                fontSize: wp(4),
                fontWeight: '600',
              }}>
              {!orderId ? '' : `Order No: ${orderId}`}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModal(false);
                props.navigation.goBack();
                setTimeout(() => {
                  //?here refreshing home data by emitting event
                  EventEmitter.emit(Events.RefreshHomeData, 'Refresh data');
                }, 200);
              }}
              style={styles.thankuBtn}>
              <TextBold>Back to Home</TextBold>
            </TouchableOpacity>
          </View>
        </Modal>
        <WebView
          startInLoadingState
          source={{
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token':
                'd8a7f7a33c552827bfb0259e628e763a',
              'X-Shopify-Customer-Access-Token':
                store.getState()?.authReducer?.shopifyToken,
            },
            uri: props.route?.params?.url ?? 'https://reactnative.dev/',
          }}
          onNavigationStateChange={item => {
            if (item.url.includes('thank_you')) {
              disptach(emptyCart());
              setModal(true);
            }
          }}
        />
      </>
    </Container>
  );
};

export default CompleteCheckout;

const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    lottie: {
      width: wp(80),
      height: wp(80),
    },
    thankuModal: {
      width: wp(70),
      height: wp(70),
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: 'white',
      justifyContent: 'center',
      marginTop: hp(28),
    },
    thankuImg: {
      flex: 0.7,
      resizeMode: 'contain',
    },
    thankuBtn: {
      backgroundColor: colors.primary,
      height: wp(11),
      width: wp(40),
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: wp(7),
    },
  });
