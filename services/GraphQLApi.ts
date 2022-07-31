import axios from 'axios';
import {shopifyAccessToken} from '../redux/reducer/authSlice';
import store from '../redux/store';
import {custom_Shopify_Url, shopify_storefront_token} from '../utils';

const queryheader = {
  method: 'post',
  url: `${custom_Shopify_Url}/graphql.json`,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': shopify_storefront_token,
  },
};
export const ShopifyAcessToken = (email: string, password: string) => {
  var data = JSON.stringify({
    query: `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerUserErrors {
      code
      field
      message
    }
    customerAccessToken {
      accessToken
      expiresAt
    }
  }
}`,
    variables: {
      input: {email: email.toLowerCase().trim(), password: password},
    },
  });

  var config: any = {
    ...queryheader,
    data: data,
  };

  return axios(config)
    .then(function (response) {
      store.dispatch(
        shopifyAccessToken(
          response.data.data.customerAccessTokenCreate.customerAccessToken
            .accessToken,
        ),
      );
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const searchProduct = async (title: string) => {
  var data = JSON.stringify({
    query: `{
  products(query:"title:*${title}*" first:15 ) {
    edges {
      node {
        id
        title
        description
        images(first:15 ) {
            edges {
                node {
                    id
                    src
                }
            }          
        }  
        variants(first:15){
            edges{
                node{
                    title
                    price
                }
            }
        }
        options(first:15){
           
                   id 
                   name
                   values
        }
        media(first: 1) {
            edges {
              node {
                alt
                mediaContentType
                 ...on MediaImage  {
                  id
               
                    image {
                      originalSrc
                    }
                  
                }
              }
            }
          }
      }
    }   
  } 
}`,
    variables: {},
  });

  var config: any = {
    method: 'post',
    url: 'https://supa-pk.myshopify.com/api/2021-04/graphql.json',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': 'ba54a2e50137f9b53ef46424348d9f15',
    },
    data: data,
  };

  return await axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllOrdersofCustomer = async (token: any) => {
  var axios = require('axios');
  var data = JSON.stringify({
    query: `query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      orders(first: 100) {
    
        edges {
          node {
            id

            lineItems(first: 100) {
              edges {
                node {
                  title
                    quantity

                  variant {
                    id
                    title
                    price
                    image {
                      id
                      originalSrc
                      altText
                    }
                  }
               
                }
                
              }
            }
            fulfillmentStatus
        cancelReason
          }
       
        }
        edges{
            node{
                orderNumber
            }
        }

      }

    }
  }`,
    variables: {customerAccessToken: token},
  });

  var config = {
    method: 'post',
    url: 'https://supa-pk.myshopify.com/api/2021-04/graphql.json',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': 'ba54a2e50137f9b53ef46424348d9f15',
    },
    data: data,
  };

  return await axios(config)
    .then(function (response: any) {
      return response.data;
    })
    .catch(function (error: any) {
      console.log(error);
    });
};
