/**
 * @summary Publishes our plugin-specific product fields to the catalog
 * @param {Object} catalogProduct The catalog product that is being built. Should mutate this.
 * @param {Object} input Input data
 * @returns {undefined}
 */
export default async function publishProductToCatalog(
  catalogProduct,
  { context, product, variants }
) {
  catalogProduct.specification = product.specification || "...";
  catalogProduct.langs = product.langs || [];
  catalogProduct.variants = catalogProduct.variants.map((v) => {
    v.langs = [];
    const variant = variants.find((f) => f._id);
    if (variant) {
      v.langs = variant.langs || [];
      if (v.options) {
        v.options = v.options.map((o) => {
          o.langs = [];
          const option = (variant.options || []).find((f) => f._id);
          if (option) {
            o.langs = option.langs || [];
          }
          return o;
        });
      }
    }
    return v;
  });
}
