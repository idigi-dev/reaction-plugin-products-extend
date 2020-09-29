/**
 * @summary Publishes our plugin-specific product fields to the catalog
 * @param {Object} catalogProduct The catalog product that is being built. Should mutate this.
 * @param {Object} input Input data
 * @returns {undefined}
 */
export default async function publishProductToCatalog(catalogProduct, { context, product }) {
  catalogProduct.specification = product.specification || "...";
}
