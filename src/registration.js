export const customPublishedProductFields = [];
export const customPublishedProductVariantFields = [];

/**
 * @summary Will be called for every plugin
 * @param {Object} options The options object that the plugin passed to registerPackage
 * @returns {undefined}
 */
export function registerPluginHandlerForExtendProduct({ catalog }) {
  if (catalog) (catalog.publishedProductFields || []).push(...["specification", "langs"]);
}
