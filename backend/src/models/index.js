const sequelize = require("../config/database");
const Customer = require("./Customer");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Item = require("./Item");
const Stock = require("./Stock");
const StockHistory = require("./StockHistory");
const StockMovement = require("./StockMovement");
const OrderPayment = require("./OrderPayment");
const BuyerPayment = require("./BuyerPayment");
const Voucher = require("./Voucher");


// Customer → Orders
Customer.hasMany(Order, { foreignKey: "customerId" });
Order.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

// Order → OrderItems
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// Item → OrderItems
Item.hasMany(OrderItem, { foreignKey: "itemId" });
OrderItem.belongsTo(Item, { foreignKey: "itemId", as: "item" });

// Item → Stock
Item.hasMany(Stock, { foreignKey: "itemId" });
Stock.belongsTo(Item, { foreignKey: "itemId" });

// Stock → StockHistory (audit trail)
Stock.hasMany(StockHistory, { foreignKey: "stockId" });
StockHistory.belongsTo(Stock, { foreignKey: "stockId" });
Item.hasMany(StockHistory, { foreignKey: "itemId" });
StockHistory.belongsTo(Item, { foreignKey: "itemId", as: "item" });

Order.hasMany(OrderPayment, { foreignKey: "orderId", as: "payments" });
OrderPayment.belongsTo(Order, { foreignKey: "orderId", as: "order" });

module.exports = {
  sequelize,
  Customer,
  Order,
  OrderItem,
  Item,
  Stock,
  StockHistory,
  OrderPayment,
  StockMovement,
  BuyerPayment,
  Voucher
};
