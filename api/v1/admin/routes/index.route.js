const productRouter = require("./product.route")
const errorRouter = require("./error404.route")
const roleRouter = require("./role.route")
const accountRouter = require('./account.route')
const authMiddleWare = require('../middlewares/auth.middleware')
const ProductCategoryRouter = require("./product-category.route")
const NotificationRouter = require("./notification.route")
const OrderRouter = require("./order.route")

module.exports = (app) => {
  const version = "/api/v1/admin"

  app.use(version + '/products', authMiddleWare.requireAuth, productRouter)
  app.use(version + '/products-category', authMiddleWare.requireAuth, ProductCategoryRouter)
  app.use(version + '/roles', authMiddleWare.requireAuth, roleRouter)
  app.use(version + '/accounts', accountRouter)
  app.use(version + '/order', OrderRouter)
  app.use(version + '/notifications', NotificationRouter)
  app.use(version + '/error404', errorRouter)

}