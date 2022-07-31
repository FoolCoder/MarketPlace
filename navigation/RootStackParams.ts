export type AuthStackI = {
  SignupScreen: undefined;
  SigninScreen: undefined;
  VerifyOtp: undefined;
  ForgotPassword: undefined;
  Recover: undefined;
  SocialLoginVerification: undefined;
};

export type MainStack = {
  SplashScreen: undefined;
  HomeTabs: undefined;
  AuthStack: AuthStackI;
};
export type CatalogueStack = {
  CatalogueI: undefined;
  CatalogueItemScreen: {item: any};
  SelectedProduct: {id: any};
  Reviews: undefined;
  Cart: undefined;
  SearchScreen: undefined;
};
export type ProfileI = {
  profile: undefined;
  ShippingAddress: undefined;
  AddAddress: undefined;
  EditProfile: undefined;
  MyOrder: undefined;
};
export type More = {
  ReturnExchange: undefined;
  ShippingPolicy: undefined;
  ProductWarrenty: undefined;
  FAQ: undefined;
  Privacy: undefined;
  TermCondition: undefined;
  Supa360: undefined;
};
export type DashBoardI = {
  Home: undefined;
  HomeDrawer: undefined;
  Profile: undefined;
  Catalogue: undefined;
  Favorite: undefined;
  SearchView: undefined;
  Contactus: undefined;
  About: undefined;
  Handbags: undefined;
  Acessories: undefined;
  MyOrder: undefined;
  Review: undefined;
  // CatalogueItemScreen: undefined;
  Notifications: undefined;
  SelectedProduct: {id: any};
  CompleteCheckout: undefined;
  More: undefined;
  ReturnExchange: undefined;
  ShippingPolicy: undefined;
  ProductWarrenty: undefined;
  FAQ: undefined;
  Privacy: undefined;
  TermCondition: undefined;
  Supa360: undefined;
};
