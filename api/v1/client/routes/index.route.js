const productRouter = require("./products.route");
const ProductCategoryRouter = require("./product-category.route");
const UserRouter = require("./user.route");
const OrderRouter = require("./order.route");
const CartRouter = require("./cart.route");
const FavoriteRouter = require("./favorite.route");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(version + "/products", productRouter);
  app.use(version + "/products-category", ProductCategoryRouter);
  app.use(version + "/users", UserRouter);
  app.use(version + "/cart", CartRouter);
  app.use(version + "/favorite", FavoriteRouter);
  app.use(version + "/order", OrderRouter);
};
