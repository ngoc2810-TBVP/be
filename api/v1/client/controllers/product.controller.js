const Product = require("../../models/product.model");
const ProductCate = require("../../models/product-category.model");

module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const products = await Product.find(find);
  const newProducts = [];

  products.map((item) => {
    if (item.title != null) {
      newProducts.push(item);
    }
  });

  if (products.length > 0) {
    res.json({
      code: 200,
      message: "Lấy toàn bộ sản phẩm thành công!",
      products: newProducts,
    });
  } else {
    res.json({
      code: 400,
      message: "Không tồn tại sản phẩm nào!",
    });
  }
};

module.exports.detail = async (req, res) => {
  const slug = req.params.slug;

  if (!slug) {
    return res.status(400).json({
      code: 400,
      message: "Slug không được bỏ trống!",
    });
  }

  try {
    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });

    if (!product) {
      return res.status(404).json({
        code: 404,
        message: "Sản phẩm không tồn tại!",
      });
    }

    // Fetch the category only if the product exists
    const cate = await ProductCate.findById(product.product_category_id);

    if (cate) {
      product.category = cate.title;
    } else {
      product.category = "Chưa có danh mục";
    }

    res.json({
      code: 200,
      message: "Lấy chi tiết sản phẩm thành công!",
      data: { product, category: product.category },
      pageTitle: product.title,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server khi lấy chi tiết sản phẩm!",
      error: error.message,
    });
  }
};

module.exports.productsFeature = async (req, res) => {
  const productsFeature = await Product.find({
    deleted: false,
    featured: 1,
  });

  if (productsFeature) {
    console.log(
      "productsFeature data: ",
      JSON.stringify(productsFeature, null, 2)
    ); // Log formatted output for better readability
    res.json({
      code: 200,
      message: "Lấy toàn bộ sản phẩm thành công!",
      productsFeature: productsFeature,
    });
  }
};

module.exports.search = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Không có từ khóa tìm kiếm!" });
  }

  try {
    const products = await Product.find({
      title: { $regex: query, $options: "i" },
      deleted: false,
      status: "active",
    }).limit(10);

    if (products.length === 0) {
      return res.json({ message: "Không có sản phẩm nào" });
    }

    res.json({ code: 200, products: products });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server khi tìm kiếm sản phẩm!" });
  }
};
