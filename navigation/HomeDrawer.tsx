import React from 'react';
import {View, Text, Alert} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {DashBoardI, More} from './RootStackParams';
import SideBar from '../containers/Drawer';

import Home from '../screens/Home/Home';
import Contactus from '../screens/dashboard/Contactus';
import About from '../screens/dashboard/About';
import Handbags from '../screens/dashboard/Handbags';
import Acessories from '../screens/dashboard/Acessory';
import MyOrder from '../screens/dashboard/Order';
import {hp, wp} from '../components/common/Responsive';
import {useAppSelector} from '../hooks';
import CompleteCheckout from '../screens/dashboard/CompleteCheckout';
import ReturnExchange from '../screens/dashboard/ReturnExchange';
import ShippingPolicy from '../screens/dashboard/ShippingPolicy';
import ProductWarrenty from '../screens/dashboard/ProductWarrenty';
import FAQ from '../screens/dashboard/FAQ';
import Privacy from '../screens/dashboard/Privacy';
import TermCondition from '../screens/dashboard/TermCondition';
import Supa360 from '../screens/dashboard/supa360View';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Review from '../screens/dashboard/Review';
const {Navigator, Screen} = createDrawerNavigator<DashBoardI>();

const MoreComponent = () => {
  const {Navigator, Screen} = createNativeStackNavigator<More>();
  return (
    <Navigator
      // initialRouteName="ReturnExchange"
      screenOptions={{headerShown: false}}>
      <Screen name="ReturnExchange" component={ReturnExchange} />
      <Screen name="ShippingPolicy" component={ShippingPolicy} />
      <Screen name="ProductWarrenty" component={ProductWarrenty} />
      <Screen name="FAQ" component={FAQ} />
      <Screen name="Privacy" component={Privacy} />
      <Screen name="TermCondition" component={TermCondition} />
      <Screen name="Supa360" component={Supa360} />
    </Navigator>
  );
};
const HomeDrawer: React.FC = () => {
  const dashboardReducer = useAppSelector(State => State.dashboardReducer);
  const {colors} = dashboardReducer;
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: wp(70),
          borderBottomRightRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
        },
      }}
      useLegacyImplementation={true}
      drawerContent={props => <SideBar colors={colors} drawerProps={props} />}>
      <Screen component={Home} name="Home" />
      <Screen component={Contactus} name="Contactus" options={{}} />
      <Screen component={About} name="About" />
      <Screen component={MyOrder} name="MyOrder" />
      <Screen component={Review} name="Review" />

      <Screen name="ReturnExchange" component={ReturnExchange} />
      <Screen name="ShippingPolicy" component={ShippingPolicy} />
      <Screen name="ProductWarrenty" component={ProductWarrenty} />
      <Screen name="FAQ" component={FAQ} />
      <Screen name="Privacy" component={Privacy} />
      <Screen name="TermCondition" component={TermCondition} />
      <Screen name="Supa360" component={Supa360} />

      <Screen component={CompleteCheckout} name="CompleteCheckout" />
    </Navigator>
  );
};
export default HomeDrawer;
