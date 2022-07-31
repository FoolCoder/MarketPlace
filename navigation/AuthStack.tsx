import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackI} from './RootStackParams';
import SignUpScreen from '../screens/auth/Signup';
import SigninScreen from '../screens/auth/Signin';
import SplashScreen from '../screens/auth/Splash';
import VerifyOtp from '../screens/auth/VerifyOtp';
import ForgetPassword from '../screens/auth/ForgetPassword';
import Recover from '../screens/auth/Recover';

const {Navigator, Screen} = createNativeStackNavigator<AuthStackI>();

const AuthStack = () => {
  return (
    <Navigator
      initialRouteName="SigninScreen"
      screenOptions={{headerShown: false}}>
      <Screen name={'ForgotPassword'} component={ForgetPassword} />
      <Screen name={'VerifyOtp'} component={VerifyOtp} />
      <Screen name={'Recover'} component={Recover} />
      <Screen name={'SigninScreen'} component={SigninScreen} />
      <Screen name={'SignupScreen'} component={SignUpScreen} />
    </Navigator>
  );
};
export default AuthStack;
