const {
  getAllCustomer,
  customerByID,
  customerInsert,
  customerUpdate,
  customerDelete,
} = require("../Controllers/CustomerController");
// const { productValidation } = require("../Middleware/ProductsValidations");

const router = require("express").Router();

router.get("/", getAllCustomer);
router.get("/:id", customerByID);

router.post("/", customerInsert);
router.put("/:id", customerUpdate);
router.delete("/:id", customerDelete);

module.exports = router;
