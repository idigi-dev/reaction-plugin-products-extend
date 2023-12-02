import Query from "./Query/index.js";

/**
 * Account-related GraphQL resolvers
 * @namespace OAuthAccount/GraphQL
 */

export default {
  Query,
  CatalogProduct: { pId: (n) => n.productId },
  CatalogProductVariant: { vId: (n) => n.variantId },
  ProductPricingInfo: {
    ...["maxPrice", "minPrice", "price"].reduce(
      (p, k) => ({
        ...p,
        [k]: (n) => {
          if (typeof n[k] === "number") {
            return n[k];
          }
          console.info(
            `\n»» ${k}`,
            n[k],
            `\n••••••| ${new Date().toLocaleString()} |••••••\n`
          );
          return 0.0;
        },
      }),
      {}
    ),
  },
};
