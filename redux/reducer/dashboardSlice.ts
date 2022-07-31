import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ImageURISource, ImageRequireSource} from 'react-native';
import {State} from 'react-native-gesture-handler';
import {Colors} from '../../constant/Colors';
import {BannerI, BannerListI, ColorsI, RelatedProducts} from '../../models';
import store from '../store';

type ImageSourcePropType =
  | ImageURISource
  | ImageURISource[]
  | ImageRequireSource;
export interface CartItems {
  productId: number;
  variantId: number | undefined;
  title: string;
  image: string;
  qty: number;
  price: number | string;
  inventory_quantity?: number;
  sku?: string;
}
export interface CartItems1 {
  productId: number[];
  variantId: number[] | undefined;
  title: string[];
  image: string[];
  qty: number;
  price: number[] | string;
  inventory_quantity?: number[];
  sku?: string[];
}
interface CollectionId {
  collection_detail: any;
  id: number;
  key: string;
  status: string;
  value: string[];
}
interface banner {
  by_default: string;
  created_at: string;
  customize: number;
  id: number;
  key: string;
  status: string;
  updated_at: string;
  value: string;
}
export interface SaleId {
  id: number;
  key: string;
  status: string;
  value: string[];
  collection_detail: {
    c_id: string;
    c_name: string;
  }[];
}
interface dashboardState {
  colors: ColorsI;
  cartItems: CartItems[] | [];
  giftItems: CartItems[] | [];

  checkoutId: number | undefined;
  Banner: banner[];
  shopifyCustomerId: number | undefined;
  collection_Id: CollectionId | undefined;
  gifts: RelatedProducts[];
  Sale_Id: SaleId | undefined;
}

// Define the initial state using that type
const initialState: dashboardState = {
  colors: Colors,
  cartItems: [],
  giftItems: [],

  checkoutId: undefined,
  Banner: [],
  shopifyCustomerId: undefined,
  collection_Id: undefined,
  gifts: [],
  Sale_Id: undefined,
};

export const dashboardSlice = createSlice({
  name: 'dashboardSlice',
  initialState,
  reducers: {
    saveColors: (state, action: PayloadAction<ColorsI>) => {
      state.colors = action.payload;
    },
    failColors: state => {
      state.colors = Colors;
    },
    saveCollectioId: (state, action: PayloadAction<CollectionId>) => {
      state.collection_Id = action.payload;
    },
    saveSaleId: (state, action: PayloadAction<SaleId>) => {
      state.Sale_Id = action.payload;
    },
    addCartItems: (state, action: PayloadAction<CartItems>) => {
      const existItem = state?.cartItems?.find(
        x => x.productId == action.payload.productId,
      );
      if (existItem) {
        state.cartItems = state.cartItems.map(x =>
          x.productId === existItem.productId ? action.payload : x,
        );
      } else {
        state.cartItems = [...state.cartItems, action.payload];
      }
    },
    addGiftsToCart: (state, action: PayloadAction<CartItems[]>) => {
      action.payload?.map(item => {
        var existItem = state?.giftItems?.find(
          x => x?.productId == item?.productId,
        );
        if (existItem) {
          state.giftItems = state.giftItems?.map(x =>
            x?.productId == existItem!?.productId
              ? {
                  ...x,
                  qty:
                    item?.inventory_quantity! >= existItem?.qty + 1
                      ? (existItem!.qty = existItem?.qty + 1)
                      : existItem?.qty,
                }
              : x,
          );
        } else {
          state.giftItems = [...state.giftItems, item];
        }
      });
    },
    removeCartItems: (state, action: PayloadAction<CartItems>) => {
      state.cartItems = state.cartItems.filter(
        x => x.productId !== action.payload.productId,
      );
    },
    removeGifts: (state, action: PayloadAction<CartItems[]>) => {
      //@ts-ignore
      state.giftItems = state.giftItems
        .map(item =>
          item.productId == action.payload[0].productId
            ? item.qty > 1
              ? {...item, qty: (item.qty = item.qty - 1)}
              : {}
            : item,
        )
        .filter(item => (Object.keys(item).length > 0 ? true : false));
    },
    createCheckout: (state, action: PayloadAction<number>) => {
      state.checkoutId = action.payload;
    },
    Banner: (state, action: PayloadAction<BannerListI[]>) => {
      state.Banner = action.payload;
    },
    shopifyUserId: (state, action: PayloadAction<number>) => {
      state.shopifyCustomerId = action.payload;
    },
    emptyCart: state => {
      state.cartItems = [];
      state.giftItems = [];
    },
    // selectedGifts: (state, action: PayloadAction<RelatedProducts[]>) => {
    //   state.gifts = action.payload;
    // },
  },
});

export const {
  saveColors,
  failColors,
  removeCartItems,
  addCartItems,
  addGiftsToCart,
  createCheckout,
  shopifyUserId,
  saveCollectioId,
  emptyCart,
  removeGifts,
  saveSaleId,
  Banner,
  // selectedGifts,
} = dashboardSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export default dashboardSlice.reducer;
