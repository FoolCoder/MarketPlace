import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {Alert} from 'react-native';
import PushNotification, {
  Importance,
  ReceivedNotification,
} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import supaAuthApiService from '../services/SupaAuthApiService';
import {saveFcmToken} from '../redux/reducer/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FirebaseNotificationI {
  data: {
    collapse_key: string;
    collection_id?: string;
    product_id?: string;
    from: string;
    title: string;
  };
  userInteraction: boolean;
  foreground: boolean;

  // !channelId and message are only recieved when notification is recieved in foreground state (when app is in active state).
  message?: string;
  channelId?: string;
}

function Notification(id: number, navigation: NavigationProp<ParamListBase>) {
  PushNotificationIOS.addEventListener('registrationError', console.log);
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: async function (token) {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      console.log('fcmToken', fcmToken);

      // console.log(token, 'tokrr');
      //   if (appNotification)
      // if (!fcmToken) {
      if (token) {
        // dispatch(saveFcmToken(token.token));

        if (token.os == 'ios' && id) {
          var response: any = await supaAuthApiService.handleTokenForIos(
            token.token,
          );
          response = await response.json();
          response = await response;
          console.log('response', response);
          await supaAuthApiService.saveToken(
            id,
            response.results[0].registration_token,
          );
        }
        await supaAuthApiService.saveToken(id, token.token);
        // NotificationListner();
        // await AsyncStorage.setItem('fcmToken', token.token);
        // console.log('firebase token', token);
      }
      // }
    },
    //   else {
    //   }
    // },

    // (required) Called when a remote is recexived or opened, or local notification is opened
    //@ts-ignore
    onNotification: (notification: any) => {
      if (notification?.data?.collection_id || notification?.data?.product_id) {
        handleNavigation(notification, navigation);
      }
      if (!notification.userInteraction) {
        PushNotification.localNotification({
          autoCancel: true, // (optional) default: true
          largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
          smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
          color: 'black', // (optional) default: system default
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          ongoing: false, // (optional) set whether this is an "ongoing" notification
          priority: 'high', // (optional) set notification priority, default: high
          visibility: 'private', // (optional) set notification visibility, default: private
          ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
          onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
          when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
          messageId: 'google:message_id', // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.
          actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
          invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
          /* iOS only properties */
          category: '', // (optional) default: empty string
          // subtitle: 'My Notification Subtitle' as string , // (optional) smaller title below notification title
          /* iOS and Android properties */
          id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
          title: notification.data.title, // (optional)
          message: notification.message,
          channelId: notification.channelId, // (required)
          playSound: true, // (optional) default: true
          // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
        });
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);
      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    // onRegistrationError: function (err) {
    //   console.error(err.message, err);
    // },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true

    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */

    requestPermissions: true,
  });

  PushNotification.createChannel(
    {
      channelId: 'fcm_fallback_notification_channel', // ! Not sure
      channelName: 'supa', // (required)
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      playSound: false, // (optional) default: true
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
}
// function NotificationListner() {
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     console.log(
//       'Notification caused app to open from background state:',
//       remoteMessage.notification,
//     );
//   });

//   // Check whether an initial notification is available
//   messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         console.log(
//           'Notification caused app to open from quit state:',
//           remoteMessage.notification,
//         );
//         console.log('remoteMessage', remoteMessage);

//         // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
//       }
//     });
// }
export default Notification;

function handleNavigation(
  notification: Required<FirebaseNotificationI>,
  navigation: NavigationProp<ParamListBase>,
) {
  const {data} = notification;
  if (data?.collection_id) {
    navigation.navigate('Catalogue', {
      screen: 'CatalogueItemScreen',
      params: {
        catId: data?.collection_id,
        title: data.title,
        path: 'Notifications',
      },
    });
  } else {
    navigation.navigate('Catalogue', {
      screen: 'SelectedProduct',
      params: {pId: data.product_id},
      path: 'Notifications',
    });
  }
}
