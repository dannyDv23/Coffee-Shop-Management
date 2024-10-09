const Table = require("../models/table");
const Product = require("../models/product");
const Booking = require("../models/booking");
const Order = require("../models/order")

const getTableCanBook = async () => {
  return await Table.find({ status: { $ne: 'Available'} });
};

const getTableByStatus = async (tableStatus) => {
  return await Table.find({ status: tableStatus });
};

const getTableByNumber = async (tableNumber) => {
  return await Table.findOne({ tableNumber: tableNumber });
};

const getAllTable = async () => {
  return await Table.find();
};

const getInfomationTableById = async (tableNumber) => {
  try {
    const parsedTableNumber = Number(tableNumber);
    const result = await Table.aggregate([
      {
        $match: {
          tableNumber: parsedTableNumber,
          status: 'Available'
        }
      },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'tableId',
          as: 'bookings'
        }
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'tableId',
          as: 'orders'
        }
      },
      {
        $unwind: {
          path: '$orders',
          preserveNullAndEmptyArrays: true // Keep the document even if there are no orders
        }
      },
      {
        $unwind: {
          path: '$orders.product', // Unwind to get individual products
          preserveNullAndEmptyArrays: true // Keep the document even if there are no products
        }
      },
      {
        $lookup: {
          from: 'products', // Your products collection
          localField: 'orders.product.productId', // Assuming each product has an ID
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: {
          path: '$productDetails',
          preserveNullAndEmptyArrays: true // Keep the document even if there are no product details
        }
      },
      {
        $group: {
          _id: '$_id',
          tableNumber: { $first: '$tableNumber' },
          status: { $first: '$status' },
          bookings: { $first: '$bookings' },
          products: {
            $push: {
              name: '$productDetails.name', // Get the product name from productDetails
              quantity: '$orders.product.numberProduct' // Ensure this matches the field in your orders
            }
          }
        }
      },
      {
        $project: {
          tableNumber: 1,
          status: 1,
          bookings: 1,
          orders: [{ product: '$products' }] // Group products under a single orders object
        }
      }
    ]);

    return result;
  } catch (error) {
    console.error('Error fetching table details:', error);
    throw error;
  }
};

const moveTableData = async (dataTableFrom, idTableTo, fromTableNumber , toTableNumber) => {
    // Transfer bookings to the destination table
    await Booking.updateMany(
      { tableId: dataTableFrom }, // Bookings linked to source table
      { $set: { tableId: idTableTo } } // Update tableId to destination table
    );

    // Transfer orders to the destination table (assumed structure similar to bookings)
    await Order.updateMany(
      { tableId: dataTableFrom }, // Orders linked to source table
      { $set: { tableId: idTableTo } } // Update tableId to destination table
    );

    // Step 3: Set source table status to 'Available' and remove bookings/orders
    await Table.updateOne(
      { tableNumber: fromTableNumber },
      {
        $set: { status: 'Empty' }, // Change status to Available
        $unset: { bookings: "", orders: "" } // Remove bookings and orders
      }
    );

    await Table.updateOne(
      { tableNumber: toTableNumber },
      {
        $set: { status: 'Available' }, // Change status to Available
      }
    );

};

const splitTableData = async (fromTableNumber, toTableNumber, arrayProduct, newInfomationBook) => {
  try {
    // Find the source and destination tables
    const tableFrom = await Table.findOne({ tableNumber: fromTableNumber });
    const idTableFrom = tableFrom._id;

    const tableTo = await Table.findOne({ tableNumber: toTableNumber });
    const idTableTo = tableTo._id;

    // Step 1: Create a new Booking
    const booking = new Booking({
      customerName: newInfomationBook.customerName,
      phoneNumber: newInfomationBook.phoneNumber,
      date: new Date(newInfomationBook.date),
      time: newInfomationBook.time,
      status: newInfomationBook.status,
      tableId: [idTableTo] // The booking is for the new table
    });

    // Save the booking to the database
    const savedBooking = await booking.save();
    // console.log('Booking created:', savedBooking);

    // Step 2: Create a new order for the destination table (toTableNumber) using splitProduct
    const newOrder = new Order({
      tableId: idTableTo,
      time: newInfomationBook.time,
      status: 'Pending',
      product: [],
      price: 0
    });

    // Add the split products to the new order and calculate the price
    let totalPrice = 0;
    for (const product of arrayProduct.splitProduct) {
      const foundProduct = await Product.findOne({ name: product._id });
      if (foundProduct) {
        totalPrice += foundProduct.price * product.quantity; // Calculate total price
        newOrder.product.push({
          productId: foundProduct._id,
          numberProduct: product.quantity
        });
      }
    }

    // Set the total price for the new order
    newOrder.price = totalPrice;

    // Save the new order to the database
    const savedOrder = await newOrder.save();
    // console.log('Order created:', savedOrder);

    // Step 3: Update the existing order for the source table (fromTableNumber) using keepProduct
    for (const product of arrayProduct.keepProduct) {
      const foundProduct = await Product.findOne({ name: product.name });
      if (foundProduct) {
        // Find the existing order(s) for the fromTable
        const existingOrders = await Order.find({ tableId: idTableFrom });

        // Update each existing order to include the keepProduct
        for (const existingOrder of existingOrders) {
          const existingProductIndex = existingOrder.product.findIndex(p => p.productId.equals(foundProduct._id));

          if (existingProductIndex > -1) {
            // If the product exists, override the quantity
            existingOrder.product[existingProductIndex].numberProduct = product.quantity; // Override the quantity
          } else {
            // If the product does not exist, add it to the product array
            existingOrder.product.push({
              productId: foundProduct._id, // Use the correct Product ID
              numberProduct: product.quantity
            });
          }

          // Save the updated existing order
          await existingOrder.save();
        }
      }
    }

    // Step 4: Update the status of the destination table (toTableNumber) to 'Available'
    await Table.updateOne(
      { tableNumber: toTableNumber },
      { $set: { status: 'Available' } }
    );
    
    return { booking: savedBooking, order: savedOrder }; // Return created booking and order

  } catch (error) {
    console.error("Error splitting table:", error);
    throw error; // It's important to throw the error again or handle it as needed
  }
};

const mergeTables = async (fromTables, toTableNumber, newBookingDetails) => {
  try {
      // Step 1: Fetch all products from the `fromTables`
      let mergedProducts = [];
      let totalPrice = 0;

      for (const tableNumber of fromTables) {
          // Find the table by `tableNumber` to get its `_id`
          const tableFrom = await Table.findOne({ tableNumber: tableNumber });
          const orders = await Order.find({ tableId: tableFrom._id });  // Use the table `_id` here
          orders.forEach(order => {
              order.product.forEach(product => {
                  mergedProducts.push(product);
                  //totalPrice += product.price * product.quantity;
              });
          });
      }

      // Step 2: Create a new order for the `toTable` with the merged products
      const tableTo = await Table.findOne({ tableNumber: toTableNumber });
      const idTableTo = tableTo._id;  // Get the correct `_id` for the `toTable`
      
      const newOrder = new Order({
          tableId: idTableTo,  // Use the `_id` of `toTable`
          product: mergedProducts,
          price: totalPrice,
          status: 'Pending',
          time: newBookingDetails.time
      });

      const savedOrder = await newOrder.save();

      // Step 3: Create a new booking for the `toTable`
      const booking = new Booking({
          customerName: newBookingDetails.customerName,
          phoneNumber: newBookingDetails.phoneNumber,
          date: new Date(newBookingDetails.date),
          time: newBookingDetails.time,
          status: newBookingDetails.status,
          tableId: [idTableTo]  // Use the `_id` of the `toTable`
      });

      const savedBooking = await booking.save();

      // Step 4: Update the status of the `toTable` to 'Occupied'
      await Table.updateOne(
          { _id: idTableTo },  // Use `_id` to find and update the table
          { $set: { status: 'Available' } }
      );

      // Return the new merged order and booking details
      return { booking: savedBooking, order: savedOrder };


  } catch (error) {
      console.error("Error merging tables:", error);
      throw error;
  }
};




module.exports = {
  getTableCanBook,
  getInfomationTableById,
  getAllTable,
  getTableByStatus,
  moveTableData,
  getTableByNumber,
  splitTableData,
  mergeTables
  
};
