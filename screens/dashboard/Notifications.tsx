import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../components/common/Container';
import {useAppSelector} from '../../hooks';
import supaAuthApiService from '../../services/SupaAuthApiService';
import {notif} from '../../constant/Images';
import {hp, wp} from '../../components/common/Responsive';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import TextRegular from '../../components/ui/TextRegular';
import {ColorsI} from '../../models';
import TextBold from '../../components/ui/TextBold';
import {size} from 'lodash';
const {Notification} = supaAuthApiService;
interface notifi {
  collection_id: string | null;
  id: number;
  message: string;
  product_id: string | null;
}
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const Notifications = (props: Props) => {
  const [notification, setnotification] = useState<notifi[]>([]);
  const [loader, setloader] = useState<boolean>(false);
  const [loader1, setloader1] = useState<boolean>(false);

  const authReducer = useAppSelector(State => State.authReducer);
  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const [offset, setOffset] = useState<number>(0);

  const {colors} = dashboardReducer;
  const styles = useStyles(colors);
  const {token} = authReducer;

  useEffect(() => {
    if (props.navigation.isFocused()) {
      getNotification();
    }
  }, [props.navigation.isFocused()]);
  const getNotification = async () => {
    setloader(true);
    var a = new Array<any>();

    a = notification!;

    const res = await Notification(token ?? '');
    console.log('notidication', res);

    if (res?.status == 200) {
      var response = res?.data.data.slice(offset * 7, (offset + 1) * 7 - 1);
      a = [...notification, ...response];
      setOffset(offset + 1);
      setnotification(a);
      setloader(false);
    } else {
      setloader(false);
      console.error('error');
    }
  };
  const LoadMoreNotification = async () => {
    setloader1(true);
    var a = new Array<any>();

    a = notification!;

    const res = await Notification(token);

    if (res?.status == 200) {
      console.log('kkk', res.data);

      var response = res?.data.data.slice(offset * 7, (offset + 1) * 7 - 1);
      a = [...notification, ...response];
      setOffset(offset + 1);
      setnotification(a);
      setloader(false);
    } else {
      setloader1(false);
      console.error('error');
    }
  };
  const renderNotifi = (item: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.item?.collection_id) {
            props.navigation.navigate('Catalogue', {
              screen: 'CatalogueItemScreen',
              params: {
                catId: item?.item?.collection_id,
                title: item?.item?.c_name,
                path: 'Notifications',
              },
            });
          } else {
            props.navigation.navigate('Catalogue', {
              screen: 'SelectedProduct',
              params: {pId: item?.item?.product_id},
              path: 'Notifications',
            });
          }
        }}
        style={styles.nlist}>
        <View
          style={{
            width: wp(88),
            alignSelf: 'center',
            marginTop: 8,
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: wp(50),
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: 18,
                height: 18,
              }}
              source={notif}
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: wp(4.5),
                fontWeight: '800',
                width: wp(43),
                color: '#000',
              }}>
              {item?.item.title}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            style={{
              fontSize: wp(4),
              fontWeight: '500',
              left: wp(7.2),
              marginTop: 8,
              marginBottom: 8,
              width: wp(83),
              color: '#000',
            }}>
            {item.item.message}
          </Text>
          <TextRegular
            style={{
              textAlign: 'right',
              marginBottom: 8,
              color: colors.secondary,
              fontSize: wp(1),
            }}>
            View Now {'>>'}
          </TextRegular>
        </View>
      </TouchableOpacity>
    );
  };
  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => LoadMoreNotification()}
          //On Click of button calling getData function to load more data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load More</Text>
          {loader1 ? (
            <ActivityIndicator color="white" style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Container arrow headerTitle="Notifications">
      <View
        style={{
          flex: 1,
        }}>
        {loader ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size={'large'} color={'#000'} />
          </View>
        ) : notification.length == 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <TextBold
              style={{
                textAlign: 'center',
                color: 'grey',
                fontSize: wp(2),
              }}>
              Notification!
            </TextBold>
          </View>
        ) : (
          <FlatList
            data={notification}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            renderItem={renderNotifi}
            ListFooterComponent={notification.length > 0 ? renderFooter : null}
          />
        )}
      </View>
    </Container>
  );
};

export default Notifications;

const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    nlist: {
      height: 'auto',
      width: wp(95),
      elevation: 1,
      alignSelf: 'center',
      backgroundColor: '#fff',
      borderRadius: 10,
      marginVertical: hp(1),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    footer: {
      paddingTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    loadMoreBtn: {
      padding: 10,
      backgroundColor: colors.primary,
      borderRadius: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnText: {
      color: 'white',
      fontSize: 15,
      textAlign: 'center',
    },
  });
