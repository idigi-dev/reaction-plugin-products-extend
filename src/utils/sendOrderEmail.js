import Logger from "@reactioncommerce/logger";

/**
 * @summary Sends an email about an order.
 * @param {Object} context App context
 * @param {Object} order - The order document
 * @param {String} [action] - The action triggering the email
 * @returns {Boolean} True if sent; else false
 */
export default async function sendOrderEmail(context, order, createdBy, action) {
  const {
    collections: { Groups, Accounts, Shops }
  } = context;
  const groups = await Groups.find(
    { permissions: { $in: ["reaction:legacy:orders/read"] } },
    { projection: { _id: 1 } }
  ).toArray();
  if (!groups || !groups.length) {
    Logger.info("No group can read order found. No email sent.");
    return false;
  }
  const fromShop = await Shops.findOne({ _id: order.shopId });
  if (!fromShop || !fromShop._id) {
    Logger.info("No fromShop can read order found. No email sent.");
    return false;
  }
  const admins = await Accounts.find(
    { groups: { $in: groups.map(({ _id }) => _id) } },
    { projection: { emails: 1, name: 1, "profile.language": 1 } }
  ).toArray();
  if (!admins || !admins.length) {
    Logger.info("No admin can read order found. No email sent.");
    return false;
  }

  const dataForEmail = {};
  const getDataForOrderEmailFns = context.getFunctionsOfType("getDataForOrderEmail");
  for (const getDataForOrderEmailFn of getDataForOrderEmailFns) {
    const someData = await getDataForOrderEmailFn(context, { order }); // eslint-disable-line no-await-in-loop
    Object.assign(dataForEmail, someData);
  }

  for (const admin of admins) {
    const language = (admin.profile || {}).language || order.ordererPreferredLanguage;
    for (const email of admin.emails) {
      await context.mutations.sendEmail(context, {
        data: dataForEmail,
        fromShop,
        templateName: "orders/newAdmin",
        language,
        to: email.address
      });
    }
  }

  return true;
}
