import { productsxSchemas } from "./simpleSchemas.js";

/**
 * @summary Called before startup
 * @param {Object} context Startup context
 * @param {Object} context.simpleSchemas Map of SimpleSchemas
 * @returns {undefined}
 */
export default function productsxPreStartup(context) {
  productsxSchemas(context.simpleSchemas);
}
