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
import React from 'react';
import {WebView} from 'react-native-webview';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

import Container from '../../components/common/Container';
import {emptyCart} from '../../redux/reducer/dashboardSlice';
import {wp} from '../../components/common/Responsive';
import store from '../../redux/store';
import TextBold from '../../components/ui/TextBold';
import {useAppSelector} from '../../hooks';
import {ColorsI} from '../../models';
import {Thanku} from '../../constant/Images';
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
const Privacy = (props: Props) => {
  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const [modal, setModal] = React.useState<boolean>(false);
  const disptach = useDispatch();
  const styles = useStyles(dashboardReducer.colors);
  return (
    <Container arrow headerTitle="Privacy Policy">
      <>
        <WebView
          startInLoadingState
          source={{
            // headers: {
            //   'Content-Type': 'application/json',
            //   'X-Shopify-Storefront-Access-Token':
            //     'd8a7f7a33c552827bfb0259e628e763a',
            //   'X-Shopify-Customer-Access-Token':
            //     store.getState().authReducer.shopifyToken,
            // },
            uri:
              'https://supa.pk/pages/privacy-policy' ??
              'https://reactnative.dev/',
          }}
          //   onNavigationStateChange={item => {
          //     if (item.url.includes('thank_you')) {
          //       disptach(emptyCart());
          //       setModal(true);
          //     }
          //   }}
        />
      </>
    </Container>
  );
};

export default Privacy;

const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    lottie: {
      width: wp(80),
      height: wp(80),
    },
    thankuModal: {
      width: wp(80),
      height: wp(80),
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: 'white',
      justifyContent: 'center',
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
