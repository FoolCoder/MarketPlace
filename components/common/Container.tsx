import React, {Fragment, useState} from 'react';
import {
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar,
  View,
  StyleSheet,
  StyleProp,
  ImageProps,
  StatusBarStyle,
  ViewStyle,
  ColorValue,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../constant/Colors';
import {hp, wp} from './Responsive';
import {supa} from '../../constant/Images';
import {useAppSelector} from '../../hooks';
import TextRegular from '../ui/TextRegular';
import TextBold from '../ui/TextBold';
import deviceInfoModule from 'react-native-device-info';
import CartModal from './CartModal';

//! TODO FIX PROPS

interface ContainerI {
  style?: ViewStyle;
  translucent?: boolean | undefined;
  hidden?: boolean | undefined;
  overlay?: JSX.Element;
  children?: JSX.Element;
  backgroundImage?: ImageSourcePropType;
  barStyle?: null | StatusBarStyle | undefined;
  backgroundImageStyle?: StyleProp<ImageProps>;
  statusBarColor?: ColorValue | undefined;
  headerTitle?: string | undefined;
  arrow?: boolean;
  logo?: JSX.Element;
  drawer?: JSX.Element;
  cart?: boolean;
  navigation?: NavigationProp<ParamListBase>;
  path?: any;
  arrowp?: boolean;
}

function Container(props: ContainerI) {
  const navigation = useNavigation();
  const [loader, setLoader] = useState<boolean>(false);
  const [modalVisible, setmodalVisible] = useState<boolean>(false);

  const {statusBarColor, backgroundImageStyle} = props;
  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const {colors, cartItems} = dashboardReducer;
  let barStyle = props.barStyle ? props.barStyle : 'dark-content';

  return (
    <View style={[styles.container, props.style]}>
      <LinearGradient
        style={styles.gradientContainer}
        start={{x: 0.0, y: 0.5}}
        end={{x: 1.2, y: 0.5}}
        colors={[colors.primary, colors.primary, colors.primary]}>
        <SafeAreaView
          style={{
            ...styles.safeAreaView,
            justifyContent:
              DeviceInfo.hasNotch() && !props.logo ? 'flex-start' : 'center',
          }}>
          {props.drawer}
          {props.logo}

          {props?.headerTitle ? (
            <View style={styles.headerView}>
              <View style={styles.arrowContainer}>
                {props?.arrow ? (
                  <TouchableOpacity
                    onPress={() =>
                      props.path
                        ? navigation.navigate(props?.path)
                        : navigation.goBack()
                    }>
                    <MaterialIcons
                      name="keyboard-backspace"
                      size={30}
                      color={'#fff'}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              <View style={styles.headerContainer}>
                <Text numberOfLines={1} style={styles.headerTitle}>
                  {props.headerTitle}
                </Text>
              </View>
            </View>
          ) : null}
          {props?.arrowp ? (
            <View style={{position: 'absolute', left: 10}}>
              <TouchableOpacity
                onPress={() =>
                  props.path
                    ? navigation.navigate(props?.path)
                    : navigation.goBack()
                }>
                <MaterialIcons
                  name="keyboard-backspace"
                  size={30}
                  color={'#fff'}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          {props.cart ? (
            <TouchableOpacity
              onPress={() => {
                setmodalVisible(true);
                setLoader(true);
              }}
              style={[
                styles.cartm,
                {
                  backgroundColor: modalVisible ? '#fff' : undefined,
                },
              ]}>
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
                color={!loader ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          ) : null}
        </SafeAreaView>
      </LinearGradient>

      <StatusBar
        backgroundColor={colors.primary}
        barStyle={'light-content'}
        translucent={props.translucent}
        hidden={props.hidden}
      />
      {props.backgroundImage && (
        <Image
          source={props.backgroundImage}
          style={[styles.backgroundImage, backgroundImageStyle]}
        />
      )}
      {props.overlay && <View style={styles.overlayStyle} />}
      {React.isValidElement(props.children) && props.children}
      <CartModal
        modalVisible={modalVisible}
        navigation={props.navigation}
        onClose={() => {
          setmodalVisible(false);
          setLoader(false);
        }}
        loader={loader}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  safeAreaView: {
    alignItems: 'center',
    flex: 1,
  },
  cartm: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    right: 8,
    top: deviceInfoModule.hasNotch() ? hp(5) : hp(3.2),
    marginTop: Platform.OS == 'ios' ? hp(2.2) : 0,
    height: 45,
    borderRadius: 40,

    // backgroundColor: loader ? '#fff' : null,
  },
  gradientContainer: {
    height: wp(DeviceInfo.hasNotch() ? 28 : Platform.OS == 'ios' ? 26 : 22),
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContainer: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: 8,
  },
  arrowContainer: {
    // flex: 0.55,
    alignItems: 'flex-start',
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(90),
    marginBottom: wp(3),
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: wp(4.5),
    color: '#fff',
    width: wp(70),
    textAlign: 'center',

    // alignItems: 'flex-start',
    // width: wp(50),
    // borderWidth: 1,
  },
  overlayStyle: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
});
export default Container;
