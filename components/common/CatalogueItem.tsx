import React from 'react';
import {View, Text, ImageBackground, StyleSheet, Image} from 'react-native';
//@ts-ignore
import StarRating from 'react-native-star-rating';
import {DefaultPic} from '../../constant/Images';
import {useAppSelector} from '../../hooks';
import {ColorsI} from '../../models';
import {hp, wp} from './Responsive';
import _ from 'lodash';

interface data {
  name?: string;
  img?: string;
  text?: string;
  price?: number | undefined;
  priceL?: number | string;
  discount?: number;
  seeMore?: string;
  path?: any;
  navigation?: any;
}

function CatalogueItem(props: data) {
  const {name, img, text, price, priceL, discount, seeMore} = props;
  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const {colors} = dashboardReducer;
  const styles = useStyles(colors);
  function calculateDiscount(
    price: any,
    compare_at_price: any,
  ): React.ReactNode {
    if (!_.isNull(compare_at_price)) {
      var discount_tag = Math.round(
        Number(parseInt(price) / parseInt(compare_at_price)) * 100,
      );
      discount_tag = 100 - discount_tag;

      return discount_tag;
    }
    return '';
  }
  // const jpg = img?.split('.', 4).slice(3).toString();
  return (
    <View style={{left: wp(2), marginEnd: wp(3)}}>
      {img ? (
        <ImageBackground style={styles.flatList1} source={{uri: img}}>
          {Number.isFinite(calculateDiscount(price, priceL)) && (
            <View style={styles.discount}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    styles.price,
                    {marginLeft: 0, fontSize: wp(3), color: '#fff'},
                  ]}>
                  {calculateDiscount(price, priceL)}% off
                </Text>
              </View>
            </View>
          )}
        </ImageBackground>
      ) : (
        <Image style={styles.flatList1} source={DefaultPic} />
      )}

      <View style={{left: 2}}>
        <Text numberOfLines={2} style={styles.text3}>
          {text}
        </Text>
        <View style={styles.priceView}>
          <Text style={styles.price}>Rs {price}</Text>
          {priceL[0] != null && (
            <Text style={styles.priceTxt}>
              {priceL[0] == '0.00' ? null : `Rs ${priceL[0]}`}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    SearchView: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      width: wp(80),
      alignSelf: 'center',
      zIndex: 1,
      top: hp(-3),
      borderRadius: 20,
      height: hp(6),
      justifyContent: 'flex-start',
      elevation: 2,
      shadowColor: 'black',
      shadowOpacity: 0.26,
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 10,
      alignItems: 'center',
    },
    pageView: {
      height: hp(20),
      marginTop: hp(1.5),
    },
    pageimg: {
      height: hp(20),
      width: wp(95),
      alignSelf: 'center',
      borderRadius: 15,
      overflow: 'hidden',
    },
    pagetext: {
      fontSize: wp(2),
      top: 20,
      left: 15,
    },
    seeMore: {
      fontSize: wp(1.1),
      color: 'gold',
      marginTop: wp(8),
      marginLeft: wp(4),
    },
    text1: {
      fontSize: wp(1.3),
      color: '#34283e',
      marginVertical: hp(2),
      left: wp(4),
      marginRight: wp(5),
      // fontFamily: 'Cochin',
    },
    seeAll: {
      color: 'grey',
      fontWeight: 'bold',
      fontSize: wp(3.5),
    },
    flatList: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginHorizontal: 5,
      left: 8,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    priceTxt: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: wp(3),
      marginVertical: wp(1),
      marginLeft: wp(2),
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
    },
    discount: {
      height: hp(3),
      width: wp(15),
      alignSelf: 'flex-start',
      position: 'absolute',
      zIndex: 1,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: colors.title,
      justifyContent: 'center',
      alignItems: 'center',
      top: 4,
    },
    flashsales: {
      flexDirection: 'row',
      // justifyContent: 'center',
      alignItems: 'center',
    },
    watch: {
      backgroundColor: colors.title,
    },
    text2: {
      textAlign: 'center',
    },
    seeAllView: {
      marginLeft: wp(23),
      flexDirection: 'row',
      height: hp(3),
      justifyContent: 'center',
      alignItems: 'center',
    },
    flatList1: {
      width: wp(45),
      height: hp(20),
      borderRadius: 10,
      overflow: 'hidden',
      marginVertical: 8,
      marginHorizontal: 2,
    },
    text3: {
      fontSize: wp(3),
      width: wp(45),
      color: '#000',
    },
    priceView: {
      flexDirection: 'row',
    },
    price: {
      color: colors.title,
      fontSize: wp(4),
      fontWeight: 'bold',
    },
    priceLine: {
      textDecorationLine: 'line-through',
      color: 'grey',
      fontSize: wp(3.5),
      left: wp(2),
      top: 2,
    },
  });
export default CatalogueItem;
