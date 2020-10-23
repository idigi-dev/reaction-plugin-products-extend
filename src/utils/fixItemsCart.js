import Logger from "@reactioncommerce/logger";
import lodash from "lodash";

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
    cart.items.forEach(
      ({ _id, productId, variantId, imageURLs }, itemIndex) => {
        if (!imageURLs)
          productIdsAndVariantIds.push({ productId, variantId, itemIndex });
      }
    );
    if (productIdsAndVariantIds.length) {
      const catalogs = await Catalog.find(
        {
          "product.productId": {
            $in: productIdsAndVariantIds.map(({ productId }) => productId)
          }
        },
        {
          projection: {
            "product.productId": 1,
            "product.primaryImage": 1,
            "product.variants.variantId": 1,
            "product.variants.title": 1,
            "product.variants.optionTitle": 1,
            "product.variants.attributeLabel": 1,
            "product.variants.primaryImage": 1,
            "product.variants.options.variantId": 1,
            "product.variants.options.title": 1,
            "product.variants.options.optionTitle": 1,
            "product.variants.options.attributeLabel": 1,
            "product.variants.options.primaryImage": 1
          }
        }
      ).toArray();
      if (catalogs && catalogs.length) {
        const update = {};
        for (const item of productIdsAndVariantIds) {
          const catalog = catalogs.find(
            (_catalog) => _catalog.product.productId === item.productId
          );
          if (catalog) {
            const product = catalog.product;
            for (const _variant of product.variants) {
              if (
                _variant.variantId !== item.variantId ||
                !_variant.options ||
                !_variant.options.length
              )
                continue;
              let option = {};
              if (_variant.options && _variant.options.length)
                for (const _option of _variant.options) {
                  if (_option.variantId !== item.variantId) option = _option;
                }
              if (
                Object.keys(option).length ||
                _variant.variantId === item.variantId
              ) {
                update[`items.${item.itemIndex}.variantTitle`] =
                  option.title ||
                  option.optionTitle ||
                  option.attributeLabel ||
                  _variant.title ||
                  _variant.optionTitle ||
                  _variant.attributeLabel;
                update[`items.${item.itemIndex}.imageURLs`] = lodash.get(
                  option,
                  "primaryImage.URLs",
                  lodash.get(
                    _variant,
                    "primaryImage.URLs",
                    lodash.get(product, "primaryImage.URLs", {})
                  )
                );
              }
            }
          }
        }
        if (Object.keys(update).length) {
          await Cart.updateOne({ _id: cart._id }, { $set: update });
        }
      }
    }
  }
}
