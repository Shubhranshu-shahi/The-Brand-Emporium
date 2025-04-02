const ensureAuth = require("../Middleware/Auth");
const {
  getAllProduct,
  productByID,
  productInsert,
  productUpdate,
  productDelete,
} = require("../Controllers/ProductController");
// const { productValidation } = require("../Middleware/ProductsValidations");

const router = require("express").Router();

router.get("/", getAllProduct);
router.get("/:id", productByID);
router.post("/", productInsert);
router.put("/:id", productUpdate);
router.delete("/:id", productDelete);

module.exports = router;
