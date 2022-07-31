import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useIsFocused,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import Container from '../../components/common/Container';
import {hp, wp} from '../../components/common/Responsive';
import LogoWhite from '../../assets/allicons/logo-white.svg';
import {useAppSelector} from '../../hooks';
import {Address, ColorsI} from '../../models';
import {loc} from '../../constant/Images';
import TextBold from '../../components/ui/TextBold';
import Octicons from 'react-native-vector-icons/Octicons';
import shopifyApiService from '../../services/ShopifyApiService';
import {cond} from 'lodash';

interface Props {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<
    {
      Params: {};
    },
    'Params'
  >;
}
// interface Address {
//   address1: string | null;
//   address2: string | null;
//   city: string | null;
//   company: string | null;
//   country: string | null;
//   country_code: string | null;
//   country_name: string | null;
//   customer_id: number | null;
//   default: boolean;
//   first_name: string | null;
//   id: number | null;
//   last_name: string | null;
//   name: string | null;
//   phone: null;
//   province: null;
//   province_code: null;
//   zip: string | null;
// }
interface Data {
  id: number;
  text: string;
}
const ShippingAddress = (props: Props) => {
  const isFocused = useIsFocused();
  const [addressList, setAddressList] = useState<Address[]>([]);

  const [loader, setLoader] = useState<boolean>(false);

  const dashboardReducer = useAppSelector(State => State.dashboardReducer);

  const {colors} = dashboardReducer;
  const styles = useStyles(colors);

  useEffect(() => {
    if (isFocused) {
      getAddressList();
    }
  }, [props.navigation.isFocused()]);

  async function getAddressList() {
    setLoader(true);
    const res = await shopifyApiService.getAddressList(
      dashboardReducer.shopifyCustomerId!,
    );

    if (res.status == 200) {
      setAddressList(res.data.addresses as any);
      setLoader(false);
    }
  }
  const removeAddress = async (aid: number) => {
    const res = await shopifyApiService.removeAddress(
      dashboardReducer.shopifyCustomerId!,
      aid,
    );
    if (res.status == 200) {
      getAddressList();

      // setAddressList(newaddress as any);
    }
  };

  const renderItem = (item: any) => {
    if (item.item.address1 || item.item.address2 || item.item.city) {
      return (
        <View
          style={[
            styles.box,
            {backgroundColor: item?.item?.default ? '#FFEFEA' : '#fff'},
          ]}>
          <View style={styles.innerbox}>
            <View
              style={{
                flexDirection: 'row',
                width: wp(90),
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row'}}>
                <Octicons name="location" size={22} color={colors.primary} />
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: wp(4),
                    left: 5,
                    fontWeight: '600',
                  }}>
                  Address {item.index + 1}
                </Text>
              </View>
              {item.item?.default ? null : (
                <TouchableOpacity
                  style={{alignSelf: 'flex-end'}}
                  onPress={() => {
                    removeAddress(item?.item?.id);
                  }}>
                  <Text
                    style={{
                      color: colors.secondary,
                      fontSize: wp(3.5),
                      fontWeight: '500',
                    }}>
                    Delete Address
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                height: 'auto',
                alignSelf: 'center',
                width: wp(90),
                top: hp(0),
                marginBottom: 8,
              }}>
              <Text numberOfLines={1} style={[styles.addtext, {left: wp(5.9)}]}>
                {item?.item?.first_name} {item?.item?.last_name}
              </Text>
              {item?.item?.address1 ? (
                <Text numberOfLines={2} style={styles.addtext}>
                  {item.item.address1}
                </Text>
              ) : null}
              {item?.item?.address2! ? (
                <Text numberOfLines={2} style={[styles.addtext]}>
                  {item?.item?.address2}
                </Text>
              ) : null}
              {item?.item?.city ? (
                <Text style={styles.addtext}>{item?.item?.city}</Text>
              ) : null}
              {item?.item?.country_name ? (
                <Text style={styles.addtext}>{item?.item?.country_name}</Text>
              ) : null}
              {item?.item?.zip ? (
                <Text
                  style={[
                    styles.addtext,
                    {marginBottom: item?.item?.default ? 0 : 5},
                  ]}>
                  P.O Box : {item?.item?.zip}
                </Text>
              ) : null}
              {item?.item?.default ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: hp(5),
                    marginBottom: 2,
                  }}>
                  <Octicons
                    name="check"
                    size={22}
                    color={colors.primary}
                    style={{right: 5}}
                  />

                  <Text
                    style={{
                      textAlign: 'right',
                      fontSize: wp(4),
                      fontWeight: '500',
                      color: colors.primary,
                    }}>
                    Default
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <Container arrow headerTitle="Shipping Address">
      <View style={styles.Container}>
        {loader ? (
          <ActivityIndicator
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            size={'large'}
          />
        ) : (
          <>
            {addressList == undefined ? null : (
              <FlatList
                style={{flexGrow: 0}}
                showsVerticalScrollIndicator={false}
                data={addressList}
                extraData={addressList}
                renderItem={renderItem}
              />
            )}

            <TouchableOpacity
              onPress={() => props.navigation.navigate('AddAddress')}
              style={styles.btn}>
              <TextBold style={styles.btntext}>Add Address</TextBold>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Container>
  );
};
const useStyles = (color: ColorsI) =>
  StyleSheet.create({
    Container: {
      flex: 1,
      height: 'auto',
    },
    box: {
      marginTop: hp(1),
      width: wp(95),
      alignSelf: 'center',
      borderRadius: 10,
      minheight: hp(20),
      // Platform.OS == 'ios' ? hp(20) : hp(28),
      elevation: 1,
      shadowColor: 'grey',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.8,
      shadowRadius: 1,
      maxHeight: Platform.OS == 'ios' ? hp(40) : hp(40),
      // borderWidth: 1,
    },
    innerbox: {
      width: wp(90),
      alignSelf: 'center',
      height: 'auto',
      // flexDirection: 'row',
      justifyContent: 'space-between',
      top: Platform.OS == 'android' ? 8 : hp(1),
      marginBottom: Platform.OS == 'android' ? 4 : hp(1),
    },
    btn: {
      alignItems: 'center',
      justifyContent: 'center',
      width: wp(92),
      height: hp(6),
      borderRadius: 10,
      backgroundColor: color.secondary,
      alignSelf: 'center',
      marginVertical: 10,
      marginTop: hp(3),
    },
    btntext: {
      color: '#fff',
      fontSize: Platform.OS == 'ios' ? wp(1.3) : wp(1.1),
    },
    addtext: {
      color: color.resend,
      fontSize: wp(4),
      left: wp(6.2),
      fontWeight: '600',
    },
  });
export default ShippingAddress;
