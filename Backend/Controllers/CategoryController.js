const CategoryModal = require("../Modals/Category");

const getAllCategory = async (req, res) => {
  const categories = await CategoryModal.find({});
  res
    .status(200)
    .json({ message: "All categories", success: true, data: categories });
};

const categoryByID = async (req, res) => {
  try {
    const { id } = req.params;
    let category;

    category = await CategoryModal.findOne({ _id: id });

    if (!category) {
      return res.status(404).send("Category not found");
    }

    res
      .status(201)
      .json({ message: "Category found", success: true, data: category });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const categoryInsert = async (req, res) => {
  try {
    const category = req.body;

    const cateG = new CategoryModal(category);
    await cateG.save();
    res
      .status(201)
      .json({ message: "category Inserted", success: true, data: cateG });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
const categoryDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModal.findByIdAndDelete({ _id: id });

    if (!category) {
      return res.status(404).send("category not found");
    }
    res
      .status(200)
      .json({ message: "category delete Successfully", success: false });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
const categoryUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;
    let updatedcategory = {
      categoryName,

      updatedAt: new Date(),
    };
    const category = await CategoryModal.findByIdAndUpdate(
      id,
      updatedcategory,
      {
        new: true,
      }
    );
    // const product = await ProductModal.findOne({ itemCode });
    if (!category) {
      return res.status(404).send("category not found");
    }
    res
      .status(200)
      .json({ message: "category updated", success: true, data: category });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
module.exports = {
  getAllCategory,
  categoryByID,
  categoryInsert,
  categoryUpdate,
  categoryDelete,
};
