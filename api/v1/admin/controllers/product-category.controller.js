const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../helpers/createTree");

// ==========================
// LẤY DANH SÁCH
// ==========================
module.exports.index = async (req, res) => {
  try {
    const records = await ProductCategory.find({ deleted: false });

    const newRecords = createTreeHelper.tree(records);

    res.json({
      code: 200,
      message: "Lấy toàn bộ danh mục thành công!",
      categories: newRecords,
    });
  } catch (e) {
    res.json({
      code: 500,
      message: "Lỗi server!",
    });
  }
};

// ==========================
// TẠO MỚI
// ==========================
module.exports.create = async (req, res) => {
  try {
    const category = new ProductCategory(req.body);
    const data = await category.save();

    res.json({
      code: 200,
      message: "Tạo danh mục thành công!",
      data: data,
    });
  } catch (e) {
    res.json({
      code: 400,
      message: "Lỗi khi tạo danh mục!",
    });
  }
};

// ==========================
// LẤY CHI TIẾT
// ==========================
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const item = await ProductCategory.findById(id);

    if (!item || item.deleted) {
      return res.json({
        code: 404,
        message: "Không tìm thấy danh mục!",
      });
    }

    res.json({
      code: 200,
      message: "Lấy chi tiết danh mục thành công!",
      data: item,
    });
  } catch (e) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// ==========================
// CẬP NHẬT
// ==========================
module.exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const item = await ProductCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!item) {
      return res.json({
        code: 404,
        message: "Không tìm thấy danh mục!",
      });
    }

    res.json({
      code: 200,
      message: "Cập nhật thành công!",
      data: item,
    });
  } catch (e) {
    res.json({
      code: 400,
      message: "Lỗi khi cập nhật!",
    });
  }
};

// ==========================
// XÓA MỀM
// ==========================
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const item = await ProductCategory.findById(id);
    if (!item) {
      return res.json({
        code: 404,
        message: "Không tìm thấy danh mục!",
      });
    }

    item.deleted = true;
    await item.save();

    res.json({
      code: 200,
      message: "Xóa danh mục thành công!",
    });
  } catch (e) {
    res.json({
      code: 400,
      message: "Lỗi khi xóa!",
    });
  }
};
