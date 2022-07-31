import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {
  shopify_url,
  custom_Shopify_Url,
  review_URL,
  api_token,
  shop_domain,
  shopify_access_token,
  shopify_storefront_token,
} from '../utils';
import {
  Address,
  AllProduct,
  AuthResponseModel,
  custom_collections,
  RegisterShopifyI,
  Reviews,
} from '../models';

class ShopifyApiService {
  instance: AxiosInstance;
  customInstance: AxiosInstance;
  reviewInstance: AxiosInstance;

  private baseApiUrl: string = shopify_url;
  private customShopifyUrl: string = custom_Shopify_Url;
  private revireURL: string = review_URL;
  constructor() {
    this.instance = axios.create({
      baseURL: this.baseApiUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopify_access_token,
      },
      timeout: 300000,
    } as AxiosRequestConfig);

    this.customInstance = axios.create({
      baseURL: this.customShopifyUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopify_storefront_token,
      },
      timeout: 300000,
    } as AxiosRequestConfig);
    this.reviewInstance = axios.create({
      baseURL: this.revireURL,
      headers: {},

      timeout: 300000,
    } as AxiosRequestConfig);
  }
  getReviews = async (id: any) => {
    console.log(id);

    try {
      return await this.reviewInstance.get<Reviews[]>(
        `reviews?api_token=${api_token}&shop_domain=${shop_domain}&external_id=${id} `,
      );
    } catch (error) {
      console.error(error, 'review');
    }
  };
  postReviews = async (data: any) => {
    // return;

    try {
      return await this.reviewInstance.post<Reviews[]>(
        `reviews?api_token=${api_token}&shop_domain=${shop_domain} `,
        data,
      );
    } catch (error) {
      console.error(error);
    }
  };
  registerUserOnShopify = async (
    registerObj: RegisterShopifyI,
  ): Promise<AxiosResponse<any>> => {
    return await this.instance.post('customers.json', registerObj);
  };
  deleteUser = async (id: any) => {
    return await this.instance.delete(`customers/${id}.json`);
  };
  shopifySignin = async (
    email: string,
  ): Promise<AxiosResponse<{customers: {id: number; email: string}[]}>> => {
    try {
      return await this.instance.get(`customers/search.json?query=${email}`);
    } catch (error) {
      return Promise.reject();
    }
  };
  getCollection = async () => {
    try {
      return await this.instance.get<custom_collections>(
        'smart_collections.json?limit=250',
      );
    } catch (error) {
      console.log(error);
    }
  };
  getCollectionbyId = async (id: any) => {
    try {
      return await this.instance.get<custom_collections>(
        `smart_collections/${id}.json`,
      );
    } catch (error) {
      console.log(error);
    }
  };
  getProduct = async () => {
    try {
      return await this.instance.get<AllProduct>('products.json?limit=100');
    } catch (error) {
      console.log(error);
    }
  };
  getProductEnd = async (id: any) => {
    try {
      return await this.instance.get<AllProduct>(
        `products.json?limit=50&since_id=${id}`,
      );
    } catch (error) {
      console.log(error);
    }
  };
  getProductbyCollection = async (id: any, limit: any) => {
    try {
      return await this.instance.get<AllProduct>(
        `products.json?limit=${limit}&collection_id=${id}`,
      );
    } catch (error) {
      console.log('eeeeff', error);
    }
  };
  getProductcount = async (id: any) => {
    try {
      return await this.instance.get<number>(
        `products/count.json?collection_id=${id}&status=active`,
      );
    } catch (error) {
      console.error(error);
    }
  };
  getProductbyCollectionEnd = async (id: any, lastprodId: any) => {
    try {
      return await this.instance.get<AllProduct>(
        `products.json?limit=250&since_id=${lastprodId}&collection_id=${id}`,
      );
    } catch (error) {
      console.log('eeee', error);
    }
  };
  // getGiftCard = async () => {
  //   try {
  //     const t = await this.instance.get('gift_cards.json');
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  checkoutApi = async (values: any) => {
    try {
      return await this.customInstance.post('checkouts.json', values);
    } catch (error) {
      console.error('something went wrong with checkout!', error);
    }
  };
  /**
   * @param  {number} id
   * @returns Promise
   */
  getOrdersList = async (id: number): Promise<AxiosResponse<number>> => {
    try {
      return await this.instance.get(`customers/${id}/orders.json`);
    } catch (error) {
      return Promise.reject();
    }
  };
  getAddressList = async (id: number): Promise<AxiosResponse<Address>> => {
    try {
      return await this.instance.get(`customers/${id}/addresses.json`);
    } catch (error) {
      return Promise.reject();
    }
  };
  removeAddress = async (
    cid: number,
    aid: number,
  ): Promise<AxiosResponse<number>> => {
    try {
      return await this.instance.delete(
        `customers/${cid}/addresses/${aid}.json`,
      );
    } catch (error) {
      return Promise.reject();
    }
  };
  createAddress = async (
    cid: number,
    data: any,
  ): Promise<AxiosResponse<number>> => {
    try {
      return await this.instance.post(`customers/${cid}/addresses.json`, data);
    } catch (error) {
      console.error(error);
      return Promise.reject();
    }
  };
  getCollectionPID = async (id: any) => {
    try {
      return await this.instance.get<custom_collections>(
        `smart_collections.json?product_id=${id}`,
      );
    } catch (error) {
      console.log(error);
    }
  };
  ProductById = async (id: any) => {
    try {
      return await this.instance.get<AllProduct>(`products.json?ids=${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  getOrder = async (customer_id: number) => {
    return await this.instance.get(`customers/${customer_id}/orders.json`);
  };
}

const shopifyApiService = new ShopifyApiService();

export default shopifyApiService;
