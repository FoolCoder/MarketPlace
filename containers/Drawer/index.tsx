import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {CommonActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import TextBold from '../../components/ui/TextBold';
import {hp, wp} from '../../components/common/Responsive';
import {headerimage, profileimg} from '../../constant/Images';
import TextRegular from '../../components/ui/TextRegular';
//@ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ColorsI} from '../../models';
import {removeToken, authSuccess} from '../../redux/reducer/authSlice';
import {useAppSelector} from '../../hooks';
import {checkFakeNumber} from '../../utils';
//@ts-ignore
import StarRating from 'react-native-star-rating';
import FastImage from 'react-native-fast-image';
import {tokenExist} from '../../utils/tokenValidation';

type Routes =
  | 'Home'
  | 'MyOrder'
  | 'Profile'
  | 'Catalogue'
  | 'Handbags'
  | 'Acessories'
  | 'About'
  | 'Contactus'
  | 'AuthStack'
  | 'ReturnExchange'
  | 'ShippingPolicy'
  | 'ProductWarrenty'
  | 'FAQ'
  | 'Privacy'
  | 'TermCondition'
  | 'Supa360'
  | 'Review'
  | undefined;

interface Props {
  drawerProps: DrawerContentComponentProps;
  colors: ColorsI;
}

interface drawerData {
  id: string;
  name: string;
  router?: Routes;
  star?: boolean;
  isVisible?: boolean;
  signin?: string;
  More?: {
    id: string;
    name: string;
    router?: Routes;
  }[];
}
const Drawer: React.FC<Props> = props => {
  const [isVisible, setisVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  const {drawerProps, colors} = props;
  const {navigation} = drawerProps;
  const authReducer = useAppSelector(State => State.authReducer);
  const {user, token} = authReducer;

  const drawerD: drawerData[] = [
    // {
    //   id: '1',
    //   name: 'Home',
    //   router: 'Home',
    // },
    {
      id: '2',
      name: 'My Order',
      router: 'MyOrder',
    },
    {
      id: '3',
      name: 'My Profile',
      router: 'Profile',
    },
    {
      id: '4',
      name: 'Categories',
      router: 'Catalogue',
    },
    {
      id: '12',
      name: 'Reviews',
      router: 'Review',
      star: true,
    },

    {
      id: '5',
      name: 'About Supa',
      router: 'About',
    },
    {
      id: '6',
      name: 'Contact us',
      router: 'Contactus',
    },
    {
      id: '8',
      name: 'More',
      isVisible: isVisible,
      router: undefined,
      More: [
        {
          id: '9',
          name: 'Return & Exchange Policy ',
          router: 'ReturnExchange',
        },
        {
          id: '10',
          name: 'Shipping Policy',
          router: 'ShippingPolicy',
        },
        {
          id: '11',
          name: 'Product Warrenty',
          router: 'ProductWarrenty',
        },
        {
          id: '12',
          name: 'FAQs',
          router: 'FAQ',
        },
        {
          id: '6',
          name: 'Supa Store 360 view',
          router: 'Supa360',
        },
        {
          id: '13',
          name: 'Privacy & Policy',
          router: 'Privacy',
        },
        {
          id: '14',
          name: 'Term & Condition',
          router: 'TermCondition',
        },
      ],
    },
    {
      id: '7',
      name: 'Logout',
      signin: 'SignIn',
      router: 'AuthStack',
    },
  ];

  return (
    <ScrollView contentContainerStyle={{paddingBottom: wp(2)}}>
      <View style={{...styles.head, backgroundColor: colors.primary}}>
        <TouchableOpacity
          onPress={() => {
            tokenExist()
              ? navigation.navigate('Profile', {
                  screen: 'profile',
                })
              : navigation.navigate('AuthStack');
          }}
          style={{flexDirection: 'row'}}>
          {user?.avatar ? (
            <FastImage
              style={styles.img}
              source={{uri: user?.avatar, priority: FastImage.priority.high}}
            />
          ) : (
            <Image style={styles.img} source={profileimg} />
          )}
          <View style={styles.nn}>
            <Text numberOfLines={2} style={[styles.text, {fontWeight: 'bold'}]}>
              {user?.name}
            </Text>
            <TextRegular style={styles.textnum}>
              {user?.phone!.slice(4, 9) == checkFakeNumber ||
              user?.phone!.slice(6, 11) == checkFakeNumber
                ? ''
                : user?.phone ?? ''}
            </TextRegular>
          </View>
        </TouchableOpacity>
      </View>

      {drawerD.map(item => {
        return (
          <TouchableOpacity
            style={styles.drawerItem}
            key={item.id}
            onPress={() => {
              if (item.name == 'Logout') {
                if (tokenExist()) {
                  dispatch(removeToken());
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [{name: 'AuthStack'}],
                    }),
                  );
                } else {
                  navigation.navigate('AuthStack');
                }
              } else if (item.router == 'Catalogue') {
                navigation.navigate('Catalogue', {
                  screen: 'CatalogueI',
                  params: {
                    titleFlag: false,
                  },
                });
                navigation.closeDrawer();
              } else if (item.router == 'Profile') {
                tokenExist()
                  ? navigation.navigate('Profile', {
                      screen: 'profile',
                      params: {
                        titleFlag: false,
                      },
                    })
                  : navigation.navigate('AuthStack');
                navigation.closeDrawer();
              } else if (item.name == 'More') {
                setisVisible(!isVisible);
              } else {
                navigation.navigate(item.router!);
                navigation.closeDrawer();
              }
            }}>
            <View
              style={{
                flexDirection: 'row',
                // justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: '#000'}}>
                {item.name == 'Logout' ? '' : item.name}
              </Text>
              {item?.name == 'Logout' && tokenExist() ? (
                <Text style={{color: '#000'}}>{item.name}</Text>
              ) : (
                <Text style={{color: '#000'}}>{item.signin}</Text>
              )}
              {item.star ? (
                <StarRating
                  containerStyle={{width: wp(15), left: 5}}
                  disabled={false}
                  // emptyStar={'star-border'}
                  fullStar={'star'}
                  // halfStar={'star-half'}
                  iconSet={'MaterialIcons'}
                  maxStars={3}
                  rating={3}
                  starSize={18}
                  fullStarColor="gold"
                  // selectedStar={(rating: any) => onStarRatingPress(rating)}
                />
              ) : null}
              {item.name == 'More' ? (
                <MaterialIcons
                  name={
                    isVisible ? 'keyboard-arrow-down' : 'keyboard-arrow-right'
                  }
                  size={22}
                  color={'#000'}
                />
              ) : null}
            </View>
            {item.isVisible ? (
              <View
                key={item.id}
                style={{
                  width: wp(35),
                  marginLeft: wp(4),
                  marginTop: wp(2),
                }}>
                {item.More?.map(e => {
                  return (
                    <TouchableOpacity
                      key={e.id}
                      onPress={() =>
                        // navigation.navigate('More', {
                        //   screen: e.router!,
                        //   path: 'Home',
                        // })
                        navigation.navigate(e.router!)
                      }
                      style={{
                        marginVertical: 5,
                      }}>
                      <Text style={{color: '#000'}}>{e.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
export default Drawer;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#fff',
    marginLeft: wp(4),
  },
  head: {
    width: wp(70),
    height: hp(20),
    alignItems: 'center',
    flexDirection: 'row',
  },
  nn: {
    marginLeft: wp(3),
    width: wp(35),
  },
  text: {
    fontSize: wp(4),
    color: '#fff',
  },
  textnum: {
    fontSize: wp(1),
    top: 5,
  },
  drawerItem: {
    marginTop: hp(3),
    marginVertical: hp(2),
    marginLeft: wp(5),
  },
});
