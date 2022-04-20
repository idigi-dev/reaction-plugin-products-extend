/**
 * @summary Extend schemas from other plugins
 * @param {Object} schemas Schema map from context
 * @return {undefined}
 */
export function productsxSchemas(schemas) {
  const productVariant = {
    specification: { type: String, optional: true },
    langs: { type: Array, optional: true },
    "langs.$": String,
  };
  schemas.Product.extend(productVariant);
  schemas.ProductVariant.extend(productVariant);
  schemas.CatalogProduct.extend(productVariant);
  schemas.CatalogProductVariant.extend(productVariant);
  
  schemas.OrderItem.extend({
    imageURLs: {
      type: Object,
      blackbox: true,
      optional: true,
    },
  });
  schemas.CartItem.extend({
    imageURLs: {
      type: Object,
      blackbox: true,
      optional: true,
    },
  });
}
