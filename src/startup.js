import sendOrderEmail from "./utils/sendOrderEmail.js";
import fixItemsCart from "./utils/fixItemsCart.js";

/**
 * @summary Called on startup
 * @param {Object} context Startup context
 * @param {Object} context.collections Map of MongoDB collections
 * @returns {undefined}
 */
export default function productsExtendStartup(context) {
  const { appEvents } = context;

  appEvents.on("afterOrderCreate", ({ order, createdBy }) => sendOrderEmail(context, order, createdBy));
  appEvents.on("afterCartCreate", ({ cart }) => fixItemsCart(context, cart));
  appEvents.on("afterCartUpdate", ({ cart }) => fixItemsCart(context, cart));
}
