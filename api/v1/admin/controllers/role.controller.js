const Role = require("../../models/roles.model")

module.exports.index = async (req, res) => {
  try {
    const find = {
      deleted: false
    }

    const roles = await Role.find(find);

    if (roles.length > 0) {
      res.json({
        code: 200,
        message: "Lấy toàn bộ quyền thành công!",
        roles: roles
      })
    } else {
      res.json({
        code: 400,
        message: "Không tồn tại quyền nào!",
      })
    }
  } catch (e) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server!"
    });
  }

}

module.exports.create = async (req, res) => {
  try {
    console.log(req.body)
    const role = new Role(req.body)
    const data = await role.save()

    res.json({
      code: 200,
      message: "Tạo thành công!",
      data: data
    })
  } catch (e) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

module.exports.permissions = async (req, res) => {
  try {
    const find = {
      deleted: false
    }

    const roles = await Role.find(find);
    console.log('roles: ', roles)

    if (roles) {
      res.json({
        code: 200,
        message: "Lấy toàn bộ quyền thành công!",
        roles: roles
      })
    } else {
      res.json({
        code: 400,
        message: "Không tồn tại quyền nào!",
      })
    }
  } catch (e) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server!"
    });
  }
}
module.exports.updatePermissions = async (req, res) => {
  try {
    const permissions = req.body; // Lưu dữ liệu từ req.body
    console.log('data: ', permissions); // Kiểm tra dữ liệu

    const roles = []; // Mảng để lưu các role đã cập nhật

    for (const item of permissions) {
      console.log("item: ", item);
      console.log("item permissions: ", item.permissions);
      console.log("item _id: ", item._id); // Sử dụng _id

      // Cập nhật permissions trong cơ sở dữ liệu
      const save = await Role.updateOne(
        { _id: item._id }, // Sử dụng _id
        { permissions: item.permissions }
      );

      // Kiểm tra kết quả cập nhật
      if (save.nModified === 1) {
        const role = await Role.findOne({ _id: item._id }); // Tìm lại nếu cần
        roles.push(role);
      } else {
        console.log("No changes made for item with id:", item._id);
      }
    }

    console.log('roles data: ', roles);

    res.json({
      code: 200,
      message: "Cập nhật permission thành công!",
      roles: roles
    });
  } catch (e) {
    console.error("Error updating permissions:", e); // Ghi lỗi để dễ theo dõi
    res.status(500).json({
      code: 500,
      message: "Lỗi server!"
    });
  }
};




