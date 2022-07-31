import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {CatalogueStack, DashBoardI, More, ProfileI} from './RootStackParams';
import Tabbar from '../containers/Tabbar';
import HomeDrawer from './HomeDrawer';
import Catalogue from '../screens/dashboard/Catalogue';
import Profile from '../screens/dashboard/Profile';
import CatalogueItemScreen from '../screens/dashboard/CatalogueItemScreem';
import SelectedProduct from '../screens/dashboard/SelectedProduct';
import Notifications from '../screens/dashboard/Notifications';
import Cart from '../screens/dashboard/Cart';
import Reviews from '../screens/dashboard/Reviews';
import ShippingAddress from '../screens/dashboard/ShippingAddress';
import AddAddress from '../screens/dashboard/AddAdress';
import EditProfile from '../screens/dashboard/EditProfile';
import MyOrder from '../screens/dashboard/Order';
import SearchScreen from '../screens/Search/Search';
import ReturnExchange from '../screens/dashboard/ReturnExchange';
import ShippingPolicy from '../screens/dashboard/ShippingPolicy';
import ProductWarrenty from '../screens/dashboard/ProductWarrenty';
import FAQ from '../screens/dashboard/FAQ';
import Privacy from '../screens/dashboard/Privacy';
import TermCondition from '../screens/dashboard/TermCondition';
import Supa360 from '../screens/dashboard/supa360View';

const {Navigator, Screen} = createBottomTabNavigator<DashBoardI>();

const CatalogueComponent = ({client}: any) => {
  const {Navigator, Screen} = createNativeStackNavigator<CatalogueStack>();
  return (
    <Navigator
      initialRouteName="CatalogueI"
      screenOptions={{headerShown: false}}>
      <Screen name="CatalogueI" component={Catalogue} />
      <Screen name="CatalogueItemScreen" component={CatalogueItemScreen} />
      <Screen name="SearchScreen" component={SearchScreen} />
      <Screen name="SelectedProduct" component={SelectedProduct} />

      <Screen name="Reviews" component={Reviews} />
      <Screen name="Cart" component={Cart} />
    </Navigator>
  );
};
const ProfileComponent = () => {
  const {Navigator, Screen} = createNativeStackNavigator<ProfileI>();
  return (
    <Navigator initialRouteName="profile" screenOptions={{headerShown: false}}>
      <Screen name="profile" component={Profile} />
      <Screen name="ShippingAddress" component={ShippingAddress} />
      <Screen name="AddAddress" component={AddAddress} />
      <Screen name="EditProfile" component={EditProfile} />
      <Screen name="MyOrder" component={MyOrder} />
    </Navigator>
  );
};

const HomeTabs = () => {
  return (
    <Navigator
      tabBar={props => <Tabbar {...props} />}
      initialRouteName="HomeDrawer"
      screenOptions={{headerShown: false}}>
      <Screen name="HomeDrawer" component={HomeDrawer} />
      <Screen name="Catalogue" component={CatalogueComponent} />
      <Screen name="Notifications" component={Notifications} />
      <Screen name="Profile" component={ProfileComponent} />
      {/* <Screen name="More" component={MoreComponent} /> */}

      {/* <Screen name="SelectedProduct" component={SelectedProduct} /> */}
    </Navigator>
  );
};
export default HomeTabs;
