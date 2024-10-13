const Order = require("../models/order");
const Table = require("../models/table");

const getOrderNowFromTableNumber = async (tableNumber) => {
  // Find the table using the provided tableNumber
  const table = await Table.findOne({ tableNumber: Number(tableNumber) });
  // If the table exists, find orders with the table ID and 'Pending' status
  if (table) {
    // Use populate to join the product information
    const orders = await Order.find({ tableId: table._id, status: 'Now' })
      .populate({
        path: 'product.productId', // Path to the productId in the nested product array
        model: 'Product', // Reference the Product model
        select: 'name price status', // Select the fields you want to retrieve
      });

    return orders;
  }

  // If no table is found, return an empty array
  return [];
};


const getAllOrder = async () => {
  return await Order.find();
};


module.exports = {
  getOrderNowFromTableNumber,
  getAllOrder
};
