import {
  Image,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {hp, wp} from '../../components/common/Responsive';
import deviceInfoModule from 'react-native-device-info';
import {CommonActions, RouteProp} from '@react-navigation/native';
import InAppReview from 'react-native-in-app-review';

import {useAppSelector} from '../../hooks';
import {
  headerimage,
  editimg,
  loc,
  logout,
  truck,
  clip,
  profileimg,
} from '../../constant/Images';
import {ColorsI} from '../../models';
import {removeToken} from '../../redux/reducer/authSlice';
import {useDispatch} from 'react-redux';
import {checkFakeNumber} from '../../utils';
import Sociallink from '../../components/common/Sociallink';
import TextBold from '../../components/ui/TextBold';
import FastImage from 'react-native-fast-image';
interface Data {
  id: number;
  image: string;
  text: string;
  name?: string;
  route: string;
}
interface Props {
  navigation: any;
  route: RouteProp<{
    Params: {};
  }>;
}
const Profile = (props: Props) => {
  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const authReducer = useAppSelector(State => State.authReducer);
  const {user} = authReducer;
  const dispatch = useDispatch();
  const {colors} = dashboardReducer;
  const styles = useStyles(colors);

  const data: Data[] = [
    {
      id: 1,
      image: loc,
      text: 'Shipping Address',
      route: 'ShippingAddress',
    },
    {
      id: 2,

      image: clip,
      text: 'My Orders',
      route: 'MyOrder',
    },
    // {
    //   id: 3,

    //   image: truck,
    //   text: 'Track Shipment',
    //   route: 'ShippingAddress',
    // },
    {
      id: 3,
      name: 'Logout',
      image: logout,
      text: 'Log Out',
      route: 'LogOut',
    },
  ];
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          // console.log(result.activityType);
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
  const appReview = () => {
    InAppReview.isAvailable();

    // trigger UI InAppreview
    InAppReview.RequestInAppReview()
      .then(hasFlowFinishedSuccessfully => {
        // when return true in android it means user finished or close review flow
        console.log('InAppReview in android', hasFlowFinishedSuccessfully);

        // when return true in ios it means review flow lanuched to user.
        console.log(
          'InAppReview in ios has launched successfully',
          hasFlowFinishedSuccessfully,
        );

        if (hasFlowFinishedSuccessfully) {
          // do something for ios
          // do something for android
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          height: deviceInfoModule.hasNotch() ? wp(35) : wp(25),
          backgroundColor: colors.primary,
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: deviceInfoModule.hasNotch() ? wp(35) : wp(25),
            marginTop: deviceInfoModule.hasNotch() ? hp(2) : 0,
          }}>
          <View style={styles.innerView}>
            {user?.avatar ? (
              <FastImage
                style={styles.img}
                source={{uri: user?.avatar, priority: FastImage.priority.high}}
              />
            ) : user?.photo ? (
              <FastImage
                style={styles.img}
                source={{uri: user.photo, priority: FastImage.priority.high}}
              />
            ) : (
              <Image style={styles.img} source={profileimg} />
            )}
            <View style={styles.nn}>
              <Text numberOfLines={1} style={styles.text}>
                {user?.name}
              </Text>
              <Text style={styles.textnum}>
                {user?.phone!.slice(4, 9) == checkFakeNumber ||
                user?.phone!.slice(6, 11) == checkFakeNumber
                  ? ''
                  : user?.phone ?? ''}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('EditProfile')}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={editimg} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{height: hp(3)}} />
      {data.map((e: any) => {
        return (
          <TouchableOpacity
            onPress={() => {
              if (e.name == 'Logout') {
                dispatch(removeToken());
                props.navigation.dispatch(
                  CommonActions.reset({
                    index: 1,
                    routes: [{name: 'AuthStack'}],
                  }),
                );
              } else {
                props.navigation.navigate(e.route);
              }
            }}
            style={styles.container}
            key={e.id}>
            <Image style={{marginLeft: wp(4)}} source={e.image} />
            <Text style={{marginLeft: wp(4), color: '#000', fontSize: wp(4)}}>
              {e.text}
            </Text>
          </TouchableOpacity>
        );
      })}
      <View style={styles.shareView}>
        <TouchableOpacity onPress={() => onShare()}>
          <Text style={styles.share}>Share App with Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => appReview()}>
          <Text style={styles.share}>Rate Supa App on</Text>
        </TouchableOpacity>
      </View>
      <Sociallink />
      <TextBold
        style={{
          color: colors.primary,
          fontSize: wp(1),
          textAlign: 'center',
          top: Platform.OS == 'android' ? wp(38) : wp(32),
        }}>
        v 1.9.3
      </TextBold>
    </View>
  );
};

export default Profile;

const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    innerView: {
      flexDirection: 'row',
      height: deviceInfoModule.hasNotch() ? wp(35) : wp(25),
      alignItems: 'center',
      width: wp(75),
    },
    img: {
      height: 60,
      width: 60,
      borderRadius: 30,
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
      fontSize: wp(5),
      color: '#fff',
      fontWeight: 'bold',
      width: wp(52),
    },
    textnum: {
      fontSize: wp(4),
      color: '#fff',
      width: wp(52),
      top: 5,
    },
    container: {
      flexDirection: 'row',
      width: wp(95),
      alignSelf: 'center',
      height: hp(8),
      backgroundColor: '#fff',
      alignItems: 'center',
      borderRadius: 10,
      marginTop: hp(1.5),
    },
    shareView: {
      flexDirection: 'row',
      width: wp(80),
      alignSelf: 'center',
      justifyContent: 'space-between',
    },
    share: {
      color: colors.primary,
      fontSize: wp(3.5),
      borderColor: colors.primary,
      marginTop: hp(4),
    },
  });
