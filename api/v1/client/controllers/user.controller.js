const User = require("../../models/user.model");
const md5 = require("md5");

module.exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const email = req.body.email
    const username = req.body.username
    console.log(email)
    console.log(username)

    // Check if email already exists
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.json({
        code: 400,
        message: "Đã tồn tại email!",
      });
    }

    // Check if username already exists
    const existUsername = await User.findOne({ username });
    if (existUsername) {
      return res.json({
        code: 401,
        message: "Đã tồn tại username!",
      });
    }

    // Hash password and create new user
    if (!existEmail && !existUsername) {
      req.body.password = md5(req.body.password);

      const user = new User(req.body);
      const data = await user.save();

      console.log(data);

      return res.json({
        code: 200,
        message: "Tạo thành công!",
        data: data,
      });
    }

  } catch (e) {
    console.error(e);  // Log the error for debugging
    return res.json({
      code: 500,
      message: "Đã xảy ra lỗi khi tạo người dùng!",
    });
  }
};

module.exports.login = async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  const user = await User.findOne({
    username: username,
    deleted: false
  })

  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại!",
    })

    return;
  }
  if (md5(password) !== user.password) {
    res.json({
      code: 400,
      message: "Sai mật khẩu!",
    })
    return;
  }

  const token = user.token
  res.cookie("token", token)

  res.json({
    code: 200,
    message: "Đăng nhập thành công!",
    token: token
  })
}

module.exports.verifyUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Vui lòng gửi kèm token!" });
    }

    const token = authHeader.split(" ")[1]; // 'Bearer token_value'

    const user = await User.findOne({ token: token, deleted: false }).select("-password");

    if (!user) {
      res.json({code: 400, message: "Token không hợp lệ hoặc tài khoản đã bị xóa!" });
    }

    // Tìm role tương ứng của tài khoản
    res.json({
      code: 200,
      message: "Xác nhận tài khoản thành công!",
      user: {
        _id: user._id,
        fullName: user.fullName,
        // avatar: user.avatar,
        email: user.email,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống, vui lòng thử lại sau!" });
  }
};

module.exports.checkToken = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log(token)

  const user = await User.findOne({
    deleted: false,
    token: token
  })

  if (user) {
    res.json({
      code: 200,
      message: "Tồn tại token!",
    })
  } else {
    res.json({
      code: 400,
      message: "Token sai!",
    })
  }
}