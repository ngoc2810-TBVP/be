const ProductCategory = require("../../models/product-category.model")
const Product = require("../../models/product.model")
const productCategoryHelper = require("../helpers/product-category")

module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await ProductCategory.find(find);
  if (records) {
    console.log("newRecords data: ", JSON.stringify(records, null, 2)); // Log formatted output for better readability
    res.json({
      code: 200,
      message: "Lấy toàn bộ sản phẩm thành công!",
      categories: records,
    });
  }
};


module.exports.getProductsInCategory = async (req, res) => {
  var products = []

  const slug = req.params.slug


  var listSubCategory = null

  if (slug) {
    console.log("slug", slug)

    const category = await ProductCategory.findOne({
      slug: slug,
      deleted: false,
      status: "active"
    })

    if (category) {
      listSubCategory = await productCategoryHelper.getSubCategory(category.id)
      const listSubCategoryId = listSubCategory.map(item => item.id)
      products = await Product.find({
        product_category_id: { $in: [category.id, ...listSubCategoryId] },
        stock: { $ne: 0 },
        deleted: false,
      }).sort({ position: "desc" })

      if (products.length > 0) {
        res.json({
          code: 200,
          message: "Lấy toàn bộ sản phẩm thành công!",
          data: products,
          pageTitle: category.title
        });
      } else {
        res.json({
          code: 400,
          message: "Không tồn tại sản phẩm nào!",
          pageTitle: category.title
        });
      }
    } else {
      res.json({
        code: 400,
        message: "Không tồn tại danh mục này!"
      });
    }

  }
}
