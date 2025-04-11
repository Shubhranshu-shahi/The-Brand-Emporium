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
    console.log(req.params);
    // const product = await ProductModal.findById(req.params.id);
    // const product = await ProductModal.findOne({ _id: id });
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
  // console.log(req.body);
  // res.send("check");
  try {
    const product = req.body;
    console.log(req.body);
    let itemCode = product.itemCode;
    // const { itemCode } = req.body;
    //   const product = await ProductModal.find();
    const checkproduct = await ProductModal.findOne({ itemCode: itemCode });
    const errMessage = "Product already exites";
    if (checkproduct) {
      console.log("JIIIIIIIIIIIIIII");
      return res.status(403).json({
        message: errMessage,
        success: false,
      });
    }
    const products = new ProductModal(product);
    await products.save();
    res
      .status(201)
      .json({ message: "Product Inserted", success: true, data: product });
  } catch (err) {
    console.log(err);
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
    console.log(prod, "--------productUpdate");
    console.log(id, "--------id");
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
