import ReactionError from "@reactioncommerce/reaction-error";
/**
 * @name catalogProducts
 * @method
 * @memberof Catalog/NoMeteorQueries
 * @summary query the Catalog by shop ID and/or tag ID
 * @param {Object} context - an object containing the per-request state
 * @param {Object} params - request parameters
 * @param {String[]} [params.shopIds] - Shop IDs to include (OR)
 * @param {String[]} [params.tags] - Tag IDs to include (OR)
 * @returns {Promise<MongoCursor>} - A MongoDB cursor for the proper query
 */
export default async function catalogProducts(context, input = {}) {
  const { collections } = context;
  const { Catalog, Tags } = collections;
  const {
    shopIds,
    tagIds = [],
    langs,
    langsMatchs = false,
    catalogBooleanFilters,
    tagSlugs = [],
    excludeProductIds = [],
    tagMatchs = false,
  } = input;
  ///  -- INIT  -- \\\
  if ((!shopIds || shopIds.length === 0) && (!tagIds || tagIds.length === 0)) {
    throw new ReactionError(
      "invalid-param",
      "You must provide tagIds or shopIds or both"
    );
  }
  // tags
  if (tagSlugs.length || tagIds.length) {
    ///  -- VARIABLES -- \\\
    const queries = [];
    if (tagSlugs.length) queries.push({ slug: { $in: tagSlugs } });
    if (tagIds.length) queries.push({ _id: { $in: tagIds } });
    ///  -- QUERY -- \\\
    const tags = await Tags.find(
      queries.length == 1 ? queries[0] : { $or: queries },
      {
        projection: { _id: 1 },
      }
    ).toArray();
    // tagIds
    tagIds = tags.map(({ _id }) => _id);
  }
  // query
  const query = {
    "product.isDeleted": { $ne: true },
    ...catalogBooleanFilters,
    "product.isVisible": true,
  };

  if (shopIds) query.shopId = { $in: shopIds };
  if (excludeProductIds && excludeProductIds.length)
    query["product.productId"] = { $nin: excludeProductIds };
  if (tagIds) {
    if (tagMatchs) {
      query["product.tagIds"] = { $all: tagIds };
    } else {
      query["product.tagIds"] = { $in: tagIds };
    }
  }
  if (langs) {
    if (langsMatchs) {
      query["product.langs"] = { $all: langs };
    } else {
      query["product.langs"] = { $in: langs };
    }
  }
  //
  return Catalog.find(query);
}
