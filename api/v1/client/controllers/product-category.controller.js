const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const productCategoryHelper = require("../helpers/product-category");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
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

module.exports.getProductsBySlugCategory = async (req, res) => {
  var products = [];

  const slug = req.params.slug;

  var listSubCategory = null;

  if (slug) {
    console.log("slug", slug);

    const category = await ProductCategory.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });

    if (category) {
      listSubCategory = await productCategoryHelper.getSubCategory(category.id);
      const listSubCategoryId = listSubCategory.map((item) => item.id);
      products = await Product.find({
        product_category_id: { $in: [category.id, ...listSubCategoryId] },
        stock: { $ne: 0 },
        deleted: false,
      }).sort({ position: "desc" });

      if (products.length > 0) {
        res.json({
          code: 200,
          message: "Lấy toàn bộ sản phẩm thành công!",
          data: products,
          pageTitle: category.title,
        });
      } else {
        res.json({
          code: 400,
          message: "Không tồn tại sản phẩm nào!",
          pageTitle: category.title,
        });
      }
    } else {
      res.json({
        code: 400,
        message: "Không tồn tại danh mục này!",
      });
    }
  }
};

module.exports.getProductsInCategory = async (req, res) => {
  try {
    const categories = await ProductCategory.find({
      deleted: false,
      status: "active",
      parent_id: "",
    });

    // Chỉ giữ lại các trường cần thiết trong categories
    const cleanedCategories = categories.map((category) => {
      return {
        _id: category._id,
        title: category.title,
        parent_id: category.parent_id,
        description: category.description,
        slug: category.slug,
      };
    });

    console.log("cleanedCategories: ", cleanedCategories);

    const categoriesWithSubCategories = await Promise.all(
      cleanedCategories.map(async (category) => {
        // Lấy các danh mục con của mỗi danh mục cha
        const subCategories = await productCategoryHelper.getSubCategory(
          category._id
        );

        console.log("subCategories: ", subCategories);

        // Lấy sản phẩm của danh mục cha và các danh mục con
        let products = await Product.find({
          product_category_id: {
            $in: [category._id, ...subCategories.map((sub) => sub._id)],
          },
          stock: { $ne: 0 },
          deleted: false,
        })
          .sort({ position: "desc" })
          .limit(8); // Giới hạn lấy 8 sản phẩm

        // Gom danh mục cha và danh mục con thành một mảng
        const mergedCategoryData = [
          { ...category, isParentCategory: true }, // Đánh dấu danh mục cha
          ...subCategories.map((sub) => ({ ...sub, isParentCategory: false })), // Các danh mục con
        ];

        if (products.length == 0) {
          return {};
        }

        return {
          categories: mergedCategoryData,
          products: products,
        };
      })
    );

    // Trả về dữ liệu đã được xử lý
    res.json({
      code: 200,
      message: "Lấy danh mục và sản phẩm thành công!",
      data: categoriesWithSubCategories,
    });
  } catch (error) {
    res.json({
      code: 500,
      message: error.message,
    });
  }
};
