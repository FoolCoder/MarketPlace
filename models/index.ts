import {SetStateAction} from 'react';
import {exp} from 'react-native-reanimated';

export interface RegisterShopifyI {
  customer: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    verified_email?: boolean;
    addresses?: AddressI[];
    password?: string;
    password_confirmation?: string;
  };
}
interface AddressI {
  address1?: string;
  city?: string;
  province?: string;
  country: string;
  zip?: string;
  phone?: string;
}
export type StatusCode = 200 | 401 | 201;
export interface AuthResponseModel<T> {
  statusCode: StatusCode;
  message: string;
  data: T;
  error?: any;
  token?: string;
}

export interface BannerListI {
  id: number;
  key: string;
  value: string;
  by_default: string;
  customize: number;
  status: string;
  created_at: string;
  updated_at: string;
}
export interface BannerI {
  statusCode: StatusCode | number | null;
  message: string;
  data: BannerListI[];
}

export interface RouteI {
  key: string;
  name: string;
  params?: any;
}
export interface ColorsI {
  primary: string;
  secondary: string;
  gradient1: string;
  title: string;
  resend: string;
}
export interface ColorsResponseI {
  created_at: string;
  id: number;
  key: string;
  status: string;
  updated_at: string;
  value: string;
}
export interface Collection_IdResponse {
  created_at: string;
  id: number;
  key: string;
  status: string;
  updated_at: string;
  values: string;
}
export interface SignupResponse {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  phone: string;
  city: string;
  state: string;
  gender: string;
  type: string;
}

export interface Recover extends SignupResponse {
  email_verified_at?: string | null;
  status: number;
  device_token?: string | null;
}
export interface OtpResponse {
  token?: string;
  statusCode: number;
  message: string;
  error?: string;
  data: SignupResponse;
}

export interface custom_collections {
  statusCode: StatusCode;
  message: string;
  smart_collections: [
    {
      id: number;
      title: string;
      updated_at: string;
      body_html: string;
      sort_order: string;
      image: imageC[];
    },
  ];
}
export interface imageCollection {
  key: string;
  value: {
    id: number;
    title: string;
    updated_at: string;
    body_html: string;
    sort_order: string;
    image: imageC[];
  };
}
export interface imageC {
  alt: string | null;
  width: number;
  height: number;
  src: string;
}

export interface RelatedProducts {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  status: string;
  variants: varient[];
  images: image[];
  image: image;
  options: option[];
}
export interface AllProduct {
  id: any;
  products: RelatedProducts[];
}
export interface varient {
  admin_graphql_api_id: string;
  barcode: null;
  compare_at_price: null;
  created_at: string;
  fulfillment_service: string;
  grams: number;
  id: number;
  image_id: null;
  inventory_item_id: number;
  inventory_management: string;
  inventory_policy: string;
  inventory_quantity: number;
  old_inventory_quantity: number;
  option1: string;
  option2: null;
  option3: null;
  position: number;
  price: string;
  product_id: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  updated_at: string;
  weight: number;
  weight_unit: string;
}
export interface option {
  id: number;
  name: string;
  position: number;
  values: string[];
}
export interface image {
  id: number;
  src: string;
  product_id: number;
}

// ? TODO

// type ImageSourcePropType =
//   | ImageURISource
//   | ImageURISource[]
//   | ImageRequireSource;
export interface searchProducts {
  status: StatusCode;
  data: {
    products: {
      edge: {
        node: d[];
      };
    };
  };
}
export interface d {
  id: string;
  title: string;
  description: string;
}
export interface Address {
  addresses: {
    address1: string | null;
    address2: string | null;
    city: string | null;
    company: string | null;
    country: string | null;
    country_code: string | null;
    country_name: string | null;
    customer_id: number | null;
    default: boolean;
    first_name: string | null;
    id: number | null;
    last_name: string | null;
    name: string | null;
    phone: null;
    province: null;
    province_code: null;
    zip: string | null;
  };
}
export interface Reviews {
  [x: string]: any;
  current_page: number;
  per_page: number;
  status: number;
  reviews: reviews[];
}
export interface reviews {
  body: string;
  created_at: string;
  curated: string;
  featured: boolean;
  hidden: boolean;
  id: number;
  ip_address: string;
  pictures: pic[];
  product_external_id: number;
  product_handle: string;
  product_title: string;
  rating: number;
  reviewer: {
    accepts_marketing: boolean;
    email: string;
    external_id: number;
    id: string;
    phone: string;
    tags: string | null;
    unsubscribed_at: string | null;
    name: string;
  };
  source: string;
  title: string;
  updated_at: string;
  verified: string;
}
export interface pic {
  hidden: boolean;
  urls: {
    compact: string;
    huge: string;
    original: string;
    small: string;
  };
}
