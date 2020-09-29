/**
 * @summary Extend schemas from other plugins
 * @param {Object} schemas Schema map from context
 * @return {undefined}
 */
export function extendProductsSchemas(schemas) {
  schemas.Product.extend({
    specification: {
      type: String,
      optional: true
    }
  });
  schemas.CatalogProduct.extend({
    specification: {
      type: String,
      optional: true
    }
  });
  schemas.OrderItem.extend({
    imageURLs: {
      type: Object,
      blackbox: true,
      optional: true
    }
  });
  schemas.CartItem.extend({
    imageURLs: {
      type: Object,
      blackbox: true,
      optional: true
    }
  });
}
