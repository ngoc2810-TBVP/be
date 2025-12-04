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
  const slug = req.params.slug;

  if (!slug) {
    return res.json({
      code: 400,
      message: "Slug không hợp lệ!",
    });
  }

  const category = await ProductCategory.findOne({
    slug: slug,
    deleted: false,
    status: "active",
  });

  if (!category) {
    return res.json({
      code: 400,
      message: `Không tồn tại danh mục với slug: ${slug}`,
    });
  }

  // Lấy danh mục con
  const listSubCategory = await productCategoryHelper.getSubCategory(
    category.id
  );
  const listSubCategoryId = listSubCategory.map((item) => item.id);

  let products = await Product.find({
    product_category_id: { $in: [category.id, ...listSubCategoryId] },
    stock: { $ne: 0 },
    deleted: false,
  }).sort({ position: "desc" });

  if (products.length > 0) {
    res.json({
      code: 200,
      message: "Lấy danh mục và sản phẩm thành công!",
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
};

module.exports.getProductsInCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      deleted: false,
      status: "active",
    });

    if (category) {
      console.log("Category found: ", category); // Log category

      const subCategories = await productCategoryHelper.getSubCategory(
        category._id
      );
      console.log("Subcategories: ", subCategories); // Log subcategories

      const subCategoryIds = subCategories.map((item) => item._id);

      let products = await Product.find({
        product_category_id: { $in: [category._id, ...subCategoryIds] },
      })
        .sort({ position: "desc" })
        .limit(8); // Giới hạn lấy 8 sản phẩm

      let categoriesWithProducts = [
        {
          category: category, // Danh mục cha
          products: products,
        },
      ];

      for (const subCategory of subCategories) {
        let subCategoryProducts = await Product.find({
          product_category_id: subCategory.id,
          stock: { $ne: 0 },
          deleted: false,
        }).limit(8);

        categoriesWithProducts.push({
          category: subCategory, // Danh mục con
          products: subCategoryProducts,
        });
      }

      if (categoriesWithProducts.length > 0) {
        return res.json({
          code: 200,
          message: "Lấy danh mục và sản phẩm thành công!",
          data: categoriesWithProducts,
        });
      } else {
        return res.json({
          code: 400,
          message: "Không có sản phẩm nào trong danh mục này!",
        });
      }
    } else {
      return res.json({
        code: 400,
        message: "Không tồn tại danh mục này!",
      });
    }
  } catch (error) {
    return res.json({
      code: 500,
      message: error.message,
    });
  }
};
