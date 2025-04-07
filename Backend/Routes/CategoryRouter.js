const {
  getAllCategory,
  categoryByID,
  categoryDelete,
  categoryInsert,
  categoryUpdate,
} = require("../Controllers/CategoryController");

const router = require("express").Router();

router.get("/", getAllCategory);
router.get("/:id", categoryByID);

router.post("/", categoryInsert);
router.put("/:id", categoryUpdate);
router.delete("/:id", categoryDelete);

module.exports = router;
