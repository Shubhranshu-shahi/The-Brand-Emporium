const ProductModal = require("../Modals/Products");

const getAllProduct = async (req, res) => {
  const product = await ProductModal.find({});
  res
    .status(200)
    .json({ message: "All Product", success: true, data: product });
};

const productByID = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModal.findOne({ itemCode: id });
    if (!product) {
      return res.status(404).send("Product not found");
    }

    res
      .status(201)
      .json({ message: "Product found", success: true, data: product });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const productInsert = async (req, res) => {
  try {
    let products = req.body;

    if (!Array.isArray(products)) {
      products = [products];
    }

    if (products.length === 0) {
      return res.status(400).json({
        message: "No products provided",
        success: false,
      });
    }
    const itemCodes = products.map((product) => product.itemCode);
    const existingProducts = await ProductModal.find({
      itemCode: { $in: itemCodes },
    });
    const newProducts = products.filter(
      (product) =>
        !existingProducts.some((p) => p.itemCode === product.itemCode)
    );
    if (newProducts.length === 0) {
      return res.status(400).json({
        message: "All products already exist",
        success: false,
      });
    }

    const createdProducts = await ProductModal.insertMany(newProducts);
    res.status(201).json({
      message: "Products inserted successfully",
      success: true,
      data: createdProducts,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
const productDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModal.findByIdAndDelete({ _id: id });
    // const product = await ProductModal.findOne({ itemCode });
    if (!product) {
      return res.status(404).send("Product not found");
    }
    return res
      .status(200)
      .json({ message: "Product delete Successfully", success: false });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
const productUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const prod = req.body;

    let updatedProduct = {
      ...prod,
      updatedAt: new Date(),
    };
    const product = await ProductModal.findByIdAndUpdate(id, updatedProduct, {
      new: true,
    });
    // const product = await ProductModal.findOne({ itemCode });
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res
      .status(200)
      .json({ message: "Product updated", success: true, data: product });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
module.exports = {
  getAllProduct,
  productInsert,
  productByID,
  productDelete,
  productUpdate,
};
