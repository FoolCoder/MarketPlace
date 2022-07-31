import {NavigationContainerRef} from '@react-navigation/native';
import * as React from 'react';

export const navigationRef =
  React.createRef<NavigationContainerRef<ReactNavigation.RootParamList>>();

export function navigate(name: never, params: never) {
  navigationRef.current?.navigate(name, params);
}

// add other navigation functions that you need and export them

export function setParams(params: never) {
  navigationRef.current?.setParams(params);
}

export function setTopLevelNavigator(navigatorRef: any) {}

export default {
  navigate,
  setTopLevelNavigator,
  setParams,
};
