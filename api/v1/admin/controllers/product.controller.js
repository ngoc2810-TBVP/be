const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }

  const products = await Product.find(find)
  const newProducts = []

  products.map((item) => {
    if (item.title != null) {
      newProducts.push(item)
    }
  })

  if (products.length > 0) {
    res.json({
      code: 200,
      message: "Lấy toàn bộ sản phẩm thành công!",
      products: newProducts
    })
  }
  else {
    res.json({
      code: 400,
      message: "Không tồn tại sản phẩm nào!",
    })
  }
}

module.exports.create = async (req, res) => {
  try {
    console.log(req.body)
    const product = new Product(req.body)
    const data = await product.save()

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

module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug
    console.log(slug)

    const product = await Product.findOne({
      deleted: false,
      slug: slug
    })

    if (product) {
      res.json({
        code: 200,
        message: "Lấy thông tin thành công!",
        product: product
      })
    } else {
      res.json({
        code: 404,
        message: "Không tồn tại sản phẩm này!"
      })
    }
  } catch (e) {
    console.error("Error occurred:", e);
    res.status(500).json({
      code: 500,
      message: "Lỗi server!"
    });
  }
}

module.exports.delete = async (req, res) => {
  try {
    const slug = req.params.slug
    console.log(slug)

    const data = await Product.updateOne({ slug: slug },
      {
        deleted: true,
      }
    )

    if (data) {
      res.json({
        code: 200,
        message: "Xóa sản phẩm thành công!",
      })
    } else {
      res.json({
        code: 404,
        message: "Không tồn tại sản phẩm này!"
      })
    }
  } catch (e) {
    console.error("Error occurred:", e);
    res.status(500).json({
      code: 500,
      message: "Lỗi server!"
    });
  }
}



