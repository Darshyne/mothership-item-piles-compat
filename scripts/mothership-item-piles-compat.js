const MODULE_ID = "mothership-item-piles-compat";
const INTEGRATION_VERSION = "1.0.7";
const CREDIT_PATH = "system.credits.value";

function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function buildItemData(item) {
  const data = item?.toObject ? item.toObject() : foundry.utils.deepClone(item);
  data.system ??= {};

  if (["weapon", "armor"].includes(data.type) && data.system.quantity === undefined) {
    data.system.quantity = 1;
  }

  if (data.system.cost !== undefined) {
    data.system.cost = toNumber(data.system.cost);
  }

  return data;
}

function getItemCost(item) {
  const cost = foundry.utils.getProperty(item, "system.cost");
  return toNumber(cost);
}

function registerItemPilesIntegration() {
  if (!game.modules.get("item-piles")?.active || !game.itempiles?.API) {
    console.warn(`${MODULE_ID} | Item Piles API not available.`);
    return;
  }

  game.itempiles.API.addSystemIntegration({
    VERSION: INTEGRATION_VERSION,
    ACTOR_CLASS_TYPE: "character",
    ITEM_PRICE_ATTRIBUTE: "system.cost",
    ITEM_QUANTITY_ATTRIBUTE: "system.quantity",
    QUANTITY_FOR_PRICE_ATTRIBUTE: "flags.item-piles.system.quantityForPrice",
    ITEM_FILTERS: [
      {
        path: "type",
        filters: "skill,class,ability,condition"
      }
    ],
    ITEM_SIMILARITIES: [
      "name",
      "type",
      "system.description",
      "system.cost"
    ],
    UNSTACKABLE_ITEM_TYPES: ["weapon", "armor"],
    PILE_DEFAULTS: {},
    TOKEN_FLAG_DEFAULTS: {},
    ITEM_TRANSFORMER: buildItemData,
    ITEM_COST_TRANSFORMER: getItemCost,
    ITEM_PREVIEW_PERMISSION_LEVEL: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
    CURRENCIES: [
      {
        primary: true,
        type: "attribute",
        name: "Crédits",
        abbreviation: "{#} cr",
        img: "icons/commodities/currency/coins-plain-stack-gold.webp",
        data: {
          path: CREDIT_PATH
        },
        exchangeRate: 1
      }
    ],
    SECONDARY_CURRENCIES: [],
    CURRENCY_DECIMAL_DIGITS: 0
  }, "0.6.0");

  console.log(`${MODULE_ID} | Item Piles integration ${INTEGRATION_VERSION} loaded.`);
}

Hooks.once("item-piles-ready", registerItemPilesIntegration);
