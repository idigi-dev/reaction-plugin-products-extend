import Logger from "@reactioncommerce/logger";

/**
 * @summary Sends an email about an order.
 * @param {Object} context App context
 * @param {Object} order - The order document
 * @param {String} [action] - The action triggering the email
 * @returns {Boolean} True if sent; else false
 */
export default async function fixItemsCart(context, cart) {
  const {
    collections: { Cart, Catalog }
  } = context;
  if (cart.items && cart.items.length) {
    let productIdsAndVariantIds = [];
    cart.items.forEach(({ _id, productId, variantId, imageURLs }, itemIndex) => {
      if (!imageURLs) productIdsAndVariantIds.push({ productId, variantId, itemIndex });
    });
    if (productIdsAndVariantIds.length) {
      const catalogs = await Catalog.find(
        {
          "product.productId": { $in: productIdsAndVariantIds.map(({ productId }) => productId) }
        },
        {
          projection: {
            "product.productId": 1,
            "product.primaryImage": 1,
            "product.variants.variantId": 1,
            "product.variants.title": 1,
            "product.variants.optionTitle": 1,
            "product.variants.attributeLabel": 1,
            "product.variants.primaryImage": 1
          }
        }
      ).toArray();
      if (catalogs && catalogs.length) {
        const update = {};
        for (const item of productIdsAndVariantIds) {
          const catalog = catalogs.find((_catalog) => _catalog.product.productId === item.productId);
          if (catalog) {
            const product = catalog.product;
            const variant = product.variants.find((_variant) => _variant.variantId === item.variantId);
            update[`items.${item.itemIndex}.variantTitle`] =
              variant.title || variant.optionTitle || variant.attributeLabel;
            update[`items.${item.itemIndex}.imageURLs`] =
              variant.primaryImage && variant.primaryImage.URLs
                ? variant.primaryImage.URLs
                : product.primaryImage && product.primaryImage.URLs
                ? product.primaryImage.URLs
                : {};
          }
        }
        if (Object.keys(update).length) {
          await Cart.updateOne({ _id: cart._id }, { $set: update });
        }
      }
    }
  }
}
