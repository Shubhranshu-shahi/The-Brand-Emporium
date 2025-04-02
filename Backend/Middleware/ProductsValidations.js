const Joi = require("joi");

const productValidation = (req, res, next) => {
  const schema = Joi.object({
    itemName: Joi.string().required(),
    itemHSN: Joi.string(),
    category: Joi.string().required(),
    itemCode: Joi.string().required(),
    mrp: Joi.string().required(),
    discountSale: Joi.string(),
    salePrice: Joi.string().required(),
    taxSale: Joi.string().required(),
    sellingPrice: Joi.string().required(),
    purchasePrice: Joi.string().required(),
    taxPurchase: Joi.string().required(),
    purchasedPrice: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Bad request",
      error,
    });
  }
  next();
};

module.exports = {
  productValidation,
};
