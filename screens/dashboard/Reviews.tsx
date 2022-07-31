import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  KeyboardAvoidingViewBase,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
//@ts-ignore
import StarRating from 'react-native-star-rating';
import deviceInfoModule from 'react-native-device-info';
import Container from '../../components/common/Container';
import {hp, wp} from '../../components/common/Responsive';
import LogoWhite from '../../assets/allicons/logo-white.svg';
//@ts-ignore
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {ColorsI} from '../../models';
import {useAppSelector} from '../../hooks';
import TextBold from '../../components/ui/TextBold';
import {extraitem, giftimg} from '../../constant/Images';
import Fonts from '../../constant/Fonts';
import TextRegular from '../../components/ui/TextRegular';
import moment from 'moment';
import shopifyApiService from '../../services/ShopifyApiService';
import AuthModal from '../../components/common/AuthModal';
import Loader from '../../components/ui/Loader';
import {addrev} from '../../constant/Images';
import FastImage from 'react-native-fast-image';
const {postReviews} = shopifyApiService;

interface giftItem {
  image: string;
  text: string;
  price: number;
}
interface Props {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<
    {
      params: {
        productData: any;
        review: any;
        cid?: any;
      };
    },
    'params'
  >;
}

export default function Reviews(props: Props) {
  const [message, setmessage] = useState<string>('');
  const [text, settext] = useState<string>('');
  const [loader, setloader] = useState<boolean>(false);
  const [modalVisible1, setmodalVisible1] = useState<boolean>();
  const [star, setstar] = useState<number>(0);
  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const {colors} = dashboardReducer;

  const authReducer = useAppSelector(State => State.authReducer);

  const {user} = authReducer;
  const styles = useStyles(colors);

  const {title, id} = props.route.params.productData;
  const {src, product_id} = props.route.params.productData.images[0];

  const onCloseModal = () => {
    setmodalVisible1(!modalVisible1);
    // props.onClose(!props.modalVisible);
  };
  const renderReview = (item: any) => {
    return (
      <>
        <View
          key={item.index}
          style={{
            // flexDirection: 'row',
            height: 'auto',
            backgroundColor: '#fff',
            alignSelf: 'center',
            width: wp(95),
            borderRadius: 10,
            marginVertical: 4,
            overflow: 'hidden',
            elevation: 1,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            marginTop: Platform.OS == 'ios' ? 8 : 0,
          }}>
          {/* <Image style={{height: 80, width: 100}} source={item.item.image} /> */}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              marginLeft: wp(3),
              flexDirection: 'row',
            }}>
            <Text style={styles.textF}>{item.item.reviewer.name}</Text>
            <Text style={{color: colors.resend, fontSize: wp(3.5), right: 8}}>
              {moment(item.item.created_at).format('LL')}
            </Text>
          </View>

          <StarRating
            containerStyle={{width: wp(25), left: wp(3)}}
            disabled={false}
            emptyStar={'star-border'}
            fullStar={'star'}
            halfStar={'star-half'}
            iconSet={'MaterialIcons'}
            maxStars={5}
            rating={item.item.rating}
            starSize={18}
            fullStarColor="gold"
            //   selectedStar={rating => this.onStarRatingPress(rating)}
          />
          <TextRegular
            style={{
              color: 'grey',
              marginBottom: 8,
              marginTop: 6,
              marginLeft: wp(3),
            }}>
            {item.item.body}
          </TextRegular>
          {item.item.pictures.length > 0 ? (
            <FlatList
              data={item.item.pictures}
              renderItem={renderPic}
              horizontal
            />
          ) : // <Image source={{uri: item?.item?.pictures[0]?.urls?.original}} />
          null}
        </View>
      </>
    );
  };
  const renderPic = (item: any) => {
    return (
      <FastImage
        style={{
          height: 50,
          width: 50,
          borderRadius: 10,
          marginHorizontal: 5,
          marginVertical: 8,
        }}
        source={{
          uri: item.item.urls.original,
          priority: FastImage.priority.high,
        }}
      />
    );
  };
  const PostReview = async () => {
    if (message == '' || star == null) {
      return null;
    }

    setloader(true);
    const formData = new FormData();
    formData.append('email', user!.email);
    formData.append('body', message);
    formData.append('rating', star);
    formData.append('id', id);
    formData.append('platform', 'shopify');
    console.log(formData);

    const res = await postReviews(formData);
    console.log('rebiwehrehrk', res);

    if (res?.status == 201) {
      setloader(false);
      settext(res.data!.message!);
      setmodalVisible1(true);
    } else {
      setloader(false);
    }
  };
  const onStarRatingPress = (rating: any) => {
    setstar(rating);
  };
  return (
    <Container headerTitle="Reviews" arrow>
      <>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: hp(1),
              alignItems: 'center',
            }}>
            <FastImage
              style={{
                width: 60,
                height: 60,
                borderColor: '#000',
                borderRadius: 8,
              }}
              source={{uri: src, priority: FastImage.priority.high}}
            />

            <Text
              style={{
                color: '#000',
                fontSize: wp(4),
                width: wp(80),
                fontWeight: '600',
                left: 5,
              }}>
              {title}
            </Text>
          </View>
          <FlatList
            style={{}}
            showsVerticalScrollIndicator={false}
            data={props.route.params.review}
            renderItem={renderReview}
            ListFooterComponent={() => <View style={{height: 8}} />}
          />
          <View style={styles.noteContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                alignItems: 'center',
                // width: wp(32),
              }}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  left: wp(4),
                }}
                source={addrev}
              />
              <TextRegular
                style={{
                  alignSelf: 'flex-start',
                  paddingHorizontal: wp(5),
                  marginTop: wp(1),
                  color: colors.primary,
                  fontSize: 4.5,
                }}>
                Add Review
              </TextRegular>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: wp(90),
              }}>
              <TextRegular
                style={{
                  alignSelf: 'flex-start',
                  paddingHorizontal: wp(5),
                  marginTop: wp(1.5),
                  color: '#34283E',
                  fontSize: 4.5,
                  left: -15,
                }}>
                Overall Rating
              </TextRegular>
              <StarRating
                containerStyle={{width: wp(25), left: 5}}
                disabled={false}
                emptyStar={'star-border'}
                fullStar={'star'}
                halfStar={'star-half'}
                iconSet={'MaterialIcons'}
                maxStars={5}
                rating={star}
                starSize={18}
                fullStarColor="gold"
                selectedStar={(rating: any) => onStarRatingPress(rating)}
              />
            </View>
            <TextInput
              onChangeText={text => setmessage(text)}
              style={styles.textInputStyle}
              // placeholder="Note"
              multiline
              placeholder="Write a Comment"
            />
            <TouchableOpacity
              onPress={() => PostReview()}
              style={{
                ...styles.checkoutBtn,
                backgroundColor: colors.secondary,
              }}>
              <TextRegular style={{fontSize: 5, color: 'white'}}>
                Add Review
              </TextRegular>
            </TouchableOpacity>
          </View>
          <Loader visible={loader} />
          <AuthModal
            modalVisible={modalVisible1!}
            text={text}
            imgtype={'green-tick'}
            navgation={props.navigation}
            nav={true}
            // buttonStyle={{backgroundColor: colors.secondary}}
            onClose={() => onCloseModal()}
          />
        </View>
      </>
    </Container>
  );
}
const useStyles = (colors: ColorsI) =>
  StyleSheet.create({
    container: {
      // width: wp(100),
      alignSelf: 'center',
      flex: 1,
    },
    btn: {
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      width: wp(35),
      ...Platform.select({
        android: {
          height: 45,
        },
        ios: {
          height: 45,
        },
      }),
      marginTop: wp(3),

      alignSelf: 'center',
      borderRadius: 10,
    },
    textF: {
      fontFamily: Fonts.SourceSansRegular,
      fontSize: wp(4.5),
      color: '#000',
      fontWeight: '700',
    },
    noteContainer: {
      // position: 'absolute',
      bottom: wp(2),
      backgroundColor: 'white',
      width: wp(95),
      alignItems: 'center',
      borderRadius: 12,
    },
    textInputStyle: {
      width: '90%',
      // minHeight: wp(10),
      // maxHeight: 'auto',
      paddingHorizontal: wp(1),
      borderColor: 'grey',
      borderBottomWidth: 1,
      marginVertical: wp(4),
      borderRadius: 5,
      paddingVertical: 3,
      color: '#000',
    },
    checkoutBtn: {
      width: '90%',
      height: wp(13),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    },
  });
