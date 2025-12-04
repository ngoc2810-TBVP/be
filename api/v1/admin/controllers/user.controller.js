const User = require("../../models/user.model");

// Lấy danh sách tất cả user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ deleted: false }).select("-password"); // loại bỏ password
    res.status(200).json({
      code: 200,
      message: "Lấy danh sách user thành công",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: err.message,
    });
  }
};

// Xem chi tiết user
exports.getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user || user.deleted) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy user",
      });
    }
    res.status(200).json({
      code: 200,
      message: "Lấy chi tiết user thành công",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: err.message,
    });
  }
};

// Tạo user mới
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json({
      code: 201,
      message: "Tạo user thành công",
      data: savedUser,
    });
  } catch (err) {
    res.status(400).json({
      code: 400,
      message: "Tạo user thất bại",
      error: err.message,
    });
  }
};

// Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.deleted) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy user",
      });
    }
    Object.assign(user, req.body); // cập nhật các trường gửi lên
    const updatedUser = await user.save();
    res.status(200).json({
      code: 200,
      message: "Cập nhật user thành công",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      code: 400,
      message: "Cập nhật thất bại",
      error: err.message,
    });
  }
};

// Xóa user (soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.deleted) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy user",
      });
    }
    user.deleted = true; // soft delete
    await user.save();
    res.status(200).json({
      code: 200,
      message: "Xóa user thành công",
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: "Xóa thất bại",
      error: err.message,
    });
  }
};
