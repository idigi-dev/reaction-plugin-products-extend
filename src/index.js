/* eslint camelcase: 0 */
import pkg from "../package.json";
import schemas from "./schemas/index.js";
import queries from "./queries/index.js";
import resolvers from "./resolvers/index.js";
import preStartup from "./preStartup.js";
import startup from "./startup.js";
import publishProductToCatalog from "./publishProductToCatalog.js";
import { registerPluginHandlerForExtendProduct } from "./registration.js";
import getDataForOrderEmail from "./utils/getDataForOrderEmail.js";
import mutateNewOrderItemBeforeCreate from "./utils/mutateNewOrderItemBeforeCreate.js";
/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionAPI} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  await app.registerPlugin({
    label: "extend products",
    name: "extend-plugin-products",
    version: pkg.version,
    graphQL: {
      schemas,
      resolvers
    },
    functionsByType: {
      mutateNewOrderItemBeforeCreate: [mutateNewOrderItemBeforeCreate],
      getDataForOrderEmail: [getDataForOrderEmail],
      registerPluginHandler: [registerPluginHandlerForExtendProduct],
      preStartup: [preStartup],
      startup: [startup],
      publishProductToCatalog: [publishProductToCatalog]
    },
    queries
  });
}
