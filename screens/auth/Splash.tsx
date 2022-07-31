import React, {useState} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';
import {CommonActions} from '@react-navigation/native';

import {Colors} from '../../constant/Colors';
import {RouteI} from '../../models';
import SplashSvg from '../../assets/allicons/splash_img.svg';
import SupaSvg from '../../assets/allicons/Supa-Pk.svg';
import supaAuthApiService from '../../services/SupaAuthApiService';
import {useAppSelector} from '../../hooks';
import {splashimg, getStarted} from '../../constant/Images';
import {color} from 'react-native-reanimated';
import {closeLoader} from '../../redux/reducer/authSlice';
const {getColors, getCollectionId1, getbanner1} = supaAuthApiService;

interface SplashI {
  navigation: any;
  route: RouteI;
}
export default function SplashScreen(props: SplashI) {
  const authReducer = useAppSelector(state => state.authReducer);
  const {} = authReducer;
  const dispatch = useDispatch();
  const [loader, setloader] = useState<boolean>(false);
  React.useEffect(() => {
    //! Rare case id loader is still true and user closed app
    if (authReducer.signInLoader) {
      dispatch(closeLoader());
    }
    supaAuthApiService.setNavigation(props.navigation);
    getAllColors();
    getCollectId();
    getBanner();
  }, []);
  const getAllColors = async () => {
    setloader(true);
    const res: any = await dispatch(getColors());
    // return true;
    if (res) {
      setloader(false);
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'HomeTabs'}],
        }),
      );
    }
  };
  const getCollectId = async () => {
    const res = await dispatch(getCollectionId1());
  };
  const getBanner = async () => {
    const res = await dispatch(getbanner1());
  };
  return (
    <ScrollView scrollEnabled contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.Container}>
        <SupaSvg />
        <Text style={styles.text}>Pakistan’s Favourite Online Store</Text>
        <Text style={{color: Colors.gradient1, marginVertical: 8}}>
          306-Y Commercial, Phase 3, DHA, Lahore
        </Text>

        <View
          style={{
            borderWidth: 2,
            borderColor: 'red',
          }}>
          <Image
            style={
              {
                // marginTop: 14,
                // width: wp(100),
                // height: hp(70),
                // resizeMode: 'contain',
              }
            }
            source={getStarted}
          />
        </View>
        {/* {loader ? <ActivityIndicator style={{top: 8}} size={'large'} /> : null} */}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: wp(15),
  },
  text: {
    color: Colors.title,
    marginTop: hp(5),
    fontSize: wp(4.8),
  },
});
