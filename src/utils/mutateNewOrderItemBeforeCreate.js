/**
 * @summary Optionally mutates a new OrderItem before it is added to an order
 * @param {Object} context App context
 * @param {Object} chosenProduct The product being ordered
 * @param {Object} chosenVariant The product variant being ordered
 * @param {Object} item The OrderItem so far. Potentially mutates this to add additional properties.
 * @returns {undefined}
 */
export default function mutateNewOrderItemBeforeCreateForVariantName(
  context,
  { chosenProduct, chosenVariant, item }
) {
  item.variantTitle =
    chosenVariant.title ||
    chosenVariant.optionTitle ||
    chosenVariant.attributeLabel;
  if (
    (chosenVariant.primaryImage && chosenVariant.primaryImage.URLs) ||
    (chosenProduct.primaryImage && chosenProduct.primaryImage.URLs)
  )
    item.imageURLs =
      chosenVariant.primaryImage && chosenVariant.primaryImage.URLs
        ? chosenVariant.primaryImage.URLs
        : (chosenProduct.primaryImage || {}).URLs || {};
}
