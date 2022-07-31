import React, {useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs/src/types';
import {default as Ionicons} from 'react-native-vector-icons/Ionicons';
import {default as FontAwesome} from 'react-native-vector-icons/FontAwesome';
import {default as MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';
import Cart from '../../assets/allicons/cart.svg';

import {wp} from '../../components/common/Responsive';
import TextRegular from '../../components/ui/TextRegular';
import {useAppSelector} from '../../hooks';
import {color} from 'react-native-reanimated';
// import {gifticon} from '../../constant/Images';
import ProfileImg from '../../assets/allicons/icon3.svg';
import {tokenExist} from '../../utils/tokenValidation';

type IconName = 'home' | 'grid' | 'gift' | 'person' | 'cart-outline';
type Routes = 'Home' | 'Catalogue' | 'Notifications' | 'Profile' | 'Cart';

interface customTabI {
  type: any;
  iconName: IconName;
  router: Routes;
  isShow: boolean;
  name: string;
}
const BottomTab: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
  descriptors,
  ...rest
}) => {
  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const {colors} = dashboardReducer;
  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
  //   return () =>
  //     BackHandler.removeEventListener(
  //       'hardwareBackPress',
  //       handleBackButtonClick,
  //     );
  // }, []);
  const data: customTabI[] = [
    {
      type: Ionicons,
      iconName: 'home',
      router: 'Home',
      name: 'Home',

      isShow: true,
    },
    {
      type: Ionicons,
      iconName: 'grid',
      router: 'Catalogue',
      isShow: true,
      name: 'Categories',
    },
    {
      type: Ionicons,
      iconName: 'gift',
      router: 'Notifications',
      isShow: true,
      name: 'For You',
    },
    {
      type: Ionicons,
      iconName: 'person',
      router: 'Profile',
      isShow: true,
      name: 'Profile',
    },
  ];
  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  const focusedOptions: any =
    descriptors[state.routes[state.index].key].options;
  if (focusedOptions?.tabBarStyle?.display === 'none') {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flexDirection: 'row',
        paddingBottom: wp(1),
        backgroundColor: '#fff',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
      }}>
      {data.map((tab, index) =>
        tab.isShow ? (
          <TouchableOpacity
            key={index}
            style={styles.mainContainer}
            onPress={() => {
              if (tab.router == 'Catalogue') {
                navigation.navigate('Catalogue', {
                  screen: 'CatalogueI',
                });
              } else if (tab.router == 'Profile') {
                tokenExist()
                  ? navigation.navigate('Profile', {
                      screen: 'profile',
                    })
                  : navigation.navigate('AuthStack');
              } else {
                navigation.navigate(tab.router);
              }
            }}>
            {state.index == index ? (
              <tab.type
                name={tab.iconName}
                color={colors.secondary}
                size={24}
              />
            ) : (
              <tab.type name={tab.iconName} color="#9B9B9B" size={24} />
              // <GiftIcon width={15} height={15} style={{borderWidth: 1}} />
              // <ProfileImg width={25} height={15} />
            )}
            <TextRegular
              style={{
                ...styles.labelText,
                color: state.index == index ? '#40304D' : '#9B9B9B',
              }}>
              {tab.name}
            </TextRegular>
          </TouchableOpacity>
        ) : null,
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    paddingTop: wp(3),
    // flex: 1,//? we do not need flex:1 because cart icon will take more space
    paddingBottom: wp(1),
    flex: 1,
  },
  labelText: {
    fontSize: 3,
    marginTop: wp(1),
  },
  cartContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: wp(3),
    flex: 1,
  },
  tabContent: {
    alignItems: 'center',
    width: wp(18),
    margin: 0,
  },
  cartItems: {
    color: '#34283E',
    fontSize: 3,
  },
  cartPrice: {
    color: 'black',
    fontSize: 3,
  },
});
export default BottomTab;
