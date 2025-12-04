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
    // Lấy các danh mục cha
    const categories = await ProductCategory.find({
      deleted: false,
      status: "active",
      parent_id: "",
    });

    console.log("categories: ", categories);

    // Duyệt qua các danh mục cha và lấy danh mục con, sản phẩm của chúng
    const categoriesWithSubCategories = await Promise.all(
      categories.map(async (category) => {
        // Lấy các danh mục con của mỗi danh mục cha
        const subCategories = await productCategoryHelper.getSubCategory(
          category._id
        );

        console.log("subCategories: ", subCategories);

        // Lấy sản phẩm của danh mục cha (chỉ lấy 8 sản phẩm)
        const products = await Product.find({
          product_category_id: {
            $in: [category._id, ...subCategories.map((sub) => sub._id)],
          }, // Lấy sản phẩm từ danh mục cha và các danh mục con
          stock: { $ne: 0 },
          deleted: false,
        })
          .sort({ position: "desc" })
          .limit(8);

        // Gom danh mục cha và danh mục con thành một mảng
        const mergedCategoryData = [
          { ...category, isParentCategory: true }, // Đánh dấu danh mục cha
          ...subCategories.map((sub) => ({ ...sub, isParentCategory: false })), // Các danh mục con
        ];

        return {
          categories: mergedCategoryData,
          products: products,
        };
      })
    );

    // Sau khi tất cả các danh mục và sản phẩm được lấy xong, trả về kết quả
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
