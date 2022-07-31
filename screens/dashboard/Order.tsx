import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import shopifyApiService from '../../services/ShopifyApiService';
import {useAppSelector} from '../../hooks';
import Container from '../../components/common/Container';
import {hp, wp} from '../../components/common/Responsive';
import {ColorsI} from '../../models';
import moment from 'moment';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {order, DefaultPic} from '../../constant/Images';
import TextBold from '../../components/ui/TextBold';
import {shopifyAccessToken} from '../../redux/reducer/authSlice';
import Fonts from '../../constant/Fonts';
import {number} from 'yup';
import {sortedIndex} from 'lodash';
import {useIsFocused} from '@react-navigation/native';
import {getAllOrdersofCustomer} from '../../services/GraphQLApi';
import FastImage from 'react-native-fast-image';
export default function MyOrder() {
  const [orderList, setOrderList] = useState<any[]>([]);
  const [loader, setloader] = useState<boolean>(false);
  const [selectData, setselectData] = useState<any>();
  const [Index, setIndex] = useState<any>();
  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const authReducer = useAppSelector(state => state.authReducer);

  const {colors} = dashboardReducer;
  const isFocused = useIsFocused();
  const styles = useStyles(colors);

  useEffect(() => {
    if (isFocused) {
      getOrderList();
    }
  }, [isFocused]);
  const getOrderList = async () => {
    setloader(true);

    // getOrder();
    // return false;

    const res = await getAllOrdersofCustomer(authReducer?.shopifyToken!);

    // return true;
    // dashboardReducer.shopifyCustomerId!,authReducer.shopifyToken
    // return true;
    if (res?.data?.customer?.orders.edges.length > 0) {
      var temp: any[] = [];
      res?.data?.customer?.orders.edges.map((e: any, i: any) => {
        e.isSelected = false;
        temp.push(e);
      });

      setOrderList(temp as any);
      setloader(false);
    } else {
      setloader(false);

      // console.error(res.data);
    }
  };

  const selectOrder = (data: any, index: any) => {
    // return;

    let tArray: any[] = [];
    let temArray = orderList.slice(0);

    temArray.map((e, i) => {
      // return;

      if (i == index) {
        if (e.isSelected) {
          e.isSelected = false;
          setIndex(null);
        } else {
          e.isSelected = true;
          setIndex(i);
        }

        // e.isSelected = true;
        tArray.push(e);
      } else if (i == index && e.isSelected == true) {
        e.isSelected = false;
        tArray.push(e);
      } else {
        e.isSelected = false;
        tArray.push(e);
      }
    });

    setOrderList(tArray as any);

    // if (Index == index) {
    //   setIndex(null);
    // } else {
    //   setIndex(index);
    //   setselectData(data);
    // }
  };

  return (
    <Container arrow headerTitle="Orders">
      <View style={{flex: 1}}>
        <ScrollView>
          {loader ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                height: hp(80),
              }}>
              <ActivityIndicator size={'large'} color={'#000'} />
            </View>
          ) : orderList.length == 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: hp(80),
              }}>
              <TextBold style={{color: 'grey', fontSize: wp(2)}}>
                No Order Yet!
              </TextBold>
            </View>
          ) : (
            orderList.map((e, i) => {
              // return true;

              return (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      selectOrder(e, i);
                    }}
                    style={[styles.orderNo]}
                    key={e.id}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: wp(4),
                        marginTop: hp(1),
                      }}>
                      <Image source={order} />
                      <Text style={styles.orderText}>
                        Order No. {e.node.orderNumber}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: wp(14),
                        top: 2,
                        alignItems: 'center',
                      }}>
                      <Text style={{fontSize: wp(3.3), color: 'grey'}}>
                        {moment(e.created_at).format('Do MMM YY')}
                      </Text>
                      <Text
                        style={[
                          styles.orderText,
                          {
                            color: e.node.cancelReason
                              ? colors.primary
                              : colors.secondary,
                          },
                        ]}>
                        {e.node.cancelReason
                          ? 'CANCELLED'
                          : e.node.fulfillmentStatus == 'UNFULFILLED'
                          ? 'PENDING'
                          : 'COMPLETED'}
                        {/* {e.fulfillment_status == 'fulfilled'
                          ? 'Complete'
                          : 'Pending'} */}
                      </Text>
                    </View>
                    {e.node.cancelReason && (
                      <Text
                        style={{
                          color: colors.primary,
                          fontWeight: '600',
                          fontSize: wp(3),
                          left: wp(14),
                        }}>
                        {`Cancel Reason: ${e.node.cancelReason}`}
                      </Text>
                    )}
                    <View
                      style={{
                        left: Platform.OS == 'ios' ? wp(90) : wp(85),
                        top: hp(-5),
                      }}>
                      <SimpleLineIcons
                        name={i == Index ? 'arrow-down' : 'arrow-right'}
                        size={20}
                        color={'grey'}
                      />
                    </View>
                  </TouchableOpacity>
                  {orderList[i].isSelected &&
                    orderList[i].node.lineItems.edges.map((e: any, i: any) => {
                      let img = e.node.variant.image.originalSrc
                        .split('?', 1)
                        .toString();

                      const total: number = 0;
                      return (
                        <View
                          key={i}
                          style={{
                            flex: 1,
                            height: 'auto',
                            marginTop: 4,
                            alignSelf: 'center',
                          }}>
                          <View
                            key={e.id}
                            style={{
                              top: 2,
                              height: Platform.OS == 'ios' ? hp(12) : 'auto',
                              backgroundColor: '#fff',
                              justifyContent: 'center',
                              borderRadius: 8,
                              overflow: 'hidden',
                              width: wp(95),
                            }}>
                            <View
                              style={{
                                justifyContent: 'space-between',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <FastImage
                                  style={{
                                    marginLeft: 5,
                                    height: 70,
                                    width: 80,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    marginVertical: 5,
                                  }}
                                  source={{
                                    uri: img,
                                    priority: FastImage.priority.high,
                                  }}
                                />
                                <View style={{marginLeft: 5}}>
                                  <View style={{flexDirection: 'row'}}>
                                    <Text
                                      numberOfLines={2}
                                      style={{
                                        width: wp(65),
                                        color: '#000',
                                        fontWeight: '400',
                                        // fontFamily: Fonts.SourceSansRegular,
                                      }}>
                                      {e.node.title}
                                    </Text>
                                    <Text
                                      style={{
                                        width: wp(8),
                                        color: '#000',
                                        fontWeight: '400',

                                        // fontFamily: Fonts.SourceSansRegular,
                                      }}>
                                      {e.node.quantity}
                                    </Text>
                                  </View>
                                  <Text
                                    style={{
                                      top: 8,
                                      fontSize: wp(4),
                                      fontWeight: '600',
                                      color: '#000',
                                    }}>
                                    Rs. {e.node.variant.price}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                          <View
                            style={{
                              top: 8,
                              width: wp(95),
                              height: hp(10),
                              backgroundColor: '#fff',
                              borderRadius: 8,
                              justifyContent: 'space-between',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <TextBold
                              style={{
                                color: '#000',
                                fontSize: wp(1.1),
                                left: 8,
                              }}>
                              Total Price
                            </TextBold>
                            <Text
                              style={{
                                color: '#000',
                                fontSize: wp(4.5),
                                fontWeight: 'bold',
                                right: 8,
                              }}>
                              Rs. {total + Number(e.node.variant.price)}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </Container>
  );
}
const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    flatList: {
      backgroundColor: '#fff',
      height: hp(20),
      marginVertical: 8,
      width: wp(100),
    },
    orderNo: {
      backgroundColor: '#fff',
      height: Platform.OS == 'ios' ? hp(9) : hp(12),
      marginTop: Platform.OS == 'ios' ? hp(2) : hp(1),
      borderRadius: Platform.OS == 'ios' ? 15 : 8,
      justifyContent: 'center',
      elevation: 1,
      width: wp(95),
      alignSelf: 'center',
    },
    orderText: {
      fontSize: wp(4),
      color: colors.resend,
      // marginVertical: hp(0.5),
      marginBottom: 3,
      left: wp(4),
      fontWeight: '600',
    },
  });
