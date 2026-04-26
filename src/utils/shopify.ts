export const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || 'your-store.myshopify.com';
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
export const SHOPIFY_API_VERSION = '2024-01';

/**
 * Standard fetcher for Shopify Storefront API
 */
export async function shopifyFetch({ query, variables = {} }: { query: string; variables?: any }) {
  const endpoint = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    if (errors) {
      console.error('Shopify API Errors:', errors);
      throw new Error('Failed to fetch from Shopify API');
    }

    return data;
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    return null;
  }
}

/**
 * Fetch all products (First 50)
 */
export async function getShopifyProducts() {
  const query = `
    query getProducts {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({ query });
  
  // Format the raw Shopify GraphQL data into a simpler array that matches your current app structure
  if (data?.products?.edges) {
    return data.products.edges.map(({ node }: any) => {
      const price = node.priceRange.minVariantPrice.amount;
      const imageUrl = node.images.edges[0]?.node?.url || '';
      const hoverImageUrl = node.images.edges[1]?.node?.url || imageUrl;

      return {
        id: node.id,
        name: node.title,
        handle: node.handle,
        description: node.description,
        price: parseFloat(price),
        image: imageUrl,
        hoverImage: hoverImageUrl,
        category: 'Apparel', // You could fetch collections here instead
        variants: node.variants.edges.map((v: any) => ({
          id: v.node.id,
          title: v.node.title,
          price: parseFloat(v.node.price.amount),
          available: v.node.availableForSale
        }))
      };
    });
  }

  return [];
}

/**
 * Creates a Shopify Checkout (Cart)
 */
export async function createShopifyCheckout(variantId: string, quantity: number) {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems: [{ variantId, quantity }]
    }
  };

  const data = await shopifyFetch({ query, variables });
  return data?.checkoutCreate?.checkout;
}
