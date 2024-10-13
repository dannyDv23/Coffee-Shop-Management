const Table = require("../models/table");
const Product = require("../models/product");
const Booking = require("../models/booking");
const Order = require("../models/order")

const getTableCanBook = async () => {
  return await Table.find({ status: { $ne: 'Available' } });
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

// const getInfomationTableById = async (tableNumber) => {
//   try {
//     const parsedTableNumber = Number(tableNumber);
//     const result = await Table.aggregate([
//       {
//         $match: {
//           tableNumber: parsedTableNumber,
//           status: { $in: ['Available', 'Booked'] }
//         }
//       },
//       {
//         $lookup: {
//           from: 'bookings',
//           localField: '_id',
//           foreignField: 'tableId',
//           as: 'bookings'
//         }
//       },
//       {
//         $lookup: {
//           from: 'orders',
//           let: { tableId: '$_id' },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ['$tableId', '$$tableId'] },
//                     { $eq: ['$status', 'Now'] } // Only include orders with status 'Now'
//                   ]
//                 }
//               }
//             },
//             {
//               $unwind: {
//                 path: '$product',
//                 preserveNullAndEmptyArrays: true // Include tables with no orders
//               }
//             },
//             {
//               $lookup: {
//                 from: 'products',
//                 localField: 'product.productId',
//                 foreignField: '_id',
//                 as: 'productDetails'
//               }
//             },
//             {
//               $unwind: {
//                 path: '$productDetails',
//                 preserveNullAndEmptyArrays: true // Allow empty product details for tables without orders
//               }
//             },
//             {
//               $group: {
//                 _id: '$tableId',
//                 products: {
//                   $push: {
//                     name: '$productDetails.name',
//                     quantity: '$product.numberProduct'
//                   }
//                 }
//               }
//             }
//           ],
//           as: 'orders'
//         }
//       },
//       {
//         // Ensure orders always have a default structure even if empty
//         $addFields: {
//           orders: {
//             $cond: {
//               if: { $eq: ['$orders', []] }, // If no orders found
//               then: [{ products: [{}] }],      // Assign a default structure
//               else: '$orders'                 // Otherwise return the orders
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           tableNumber: 1,
//           status: 1,
//           bookings: 1,
//           orders: {
//             $map: {
//               input: '$orders',
//               as: 'order',
//               in: {
//                 products: '$$order.products'
//               }
//             }
//           }
//         }
//       }
//     ]);

//     return result;
//   } catch (error) {
//     console.error('Error fetching table details:', error);
//     throw error;
//   }
// };

const getInfomationTableById = async (tableNumber) => {
  try {
    const parsedTableNumber = Number(tableNumber);
    const result = await Table.aggregate([
      {
        $match: {
          tableNumber: parsedTableNumber,
          status: { $in: ['Available', 'Booked'] }
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
        // Filter bookings to include only those with status 'Now' or 'Appointment'
        $addFields: {
          bookings: {
            $filter: {
              input: '$bookings',
              as: 'booking',
              cond: { 
                $in: ['$$booking.status', ['Now', 'Appointment']] // Only keep bookings with status 'Now' or 'Appointment'
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'orders',
          let: { tableId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$tableId', '$$tableId'] },
                    { $eq: ['$status', 'Now'] } // Only include orders with status 'Now'
                  ]
                }
              }
            },
            {
              $unwind: {
                path: '$product',
                preserveNullAndEmptyArrays: true // Include tables with no orders
              }
            },
            {
              $lookup: {
                from: 'products',
                localField: 'product.productId',
                foreignField: '_id',
                as: 'productDetails'
              }
            },
            {
              $unwind: {
                path: '$productDetails',
                preserveNullAndEmptyArrays: true // Allow empty product details for tables without orders
              }
            },
            {
              $group: {
                _id: '$tableId',
                products: {
                  $push: {
                    name: '$productDetails.name',
                    quantity: '$product.numberProduct'
                  }
                }
              }
            }
          ],
          as: 'orders'
        }
      },
      {
        // Ensure orders always have a default structure even if empty
        $addFields: {
          orders: {
            $cond: {
              if: { $eq: ['$orders', []] }, // If no orders found
              then: [{ products: [{}] }],    // Assign a default structure
              else: '$orders'                // Otherwise return the orders
            }
          }
        }
      },
      {
        $project: {
          tableNumber: 1,
          status: 1,
          bookings: 1,
          orders: {
            $map: {
              input: '$orders',
              as: 'order',
              in: {
                products: '$$order.products'
              }
            }
          }
        }
      }
    ]);

    return result;
  } catch (error) {
    console.error('Error fetching table details:', error);
    throw error;
  }
};

const moveTableData = async (dataTableFrom, idTableTo, fromTableNumber, toTableNumber) => {
  // Transfer bookings to the destination table
  await Booking.updateMany(
    { tableId: dataTableFrom, status: 'Now' }, // Bookings linked to source table
    { $set: { tableId: idTableTo } } // Update tableId to destination table
  );

  // Transfer orders to the destination table (assumed structure similar to bookings)
  await Order.updateMany(
    { tableId: dataTableFrom }, // Orders linked to source table
    { $set: { tableId: idTableTo } } // Update tableId to destination table
  );

  // Step 3: Check if the table has any 'Appointment' bookings
  const appointmentBookings = await Booking.find({
    tableId: dataTableFrom,
    status: 'Appointment'
  });

  if (appointmentBookings.length > 0) {
    // If there are appointment bookings, set the status to 'Booked'
    await Table.updateOne(
      { tableNumber: fromTableNumber },
      { $set: { status: 'Booked' } } // Change status to Booked
    );
  } else {
    // If no appointment bookings, set status to 'Empty' and remove bookings/orders
    await Table.updateOne(
      { tableNumber: fromTableNumber },
      {
        $set: { status: 'Empty' }, // Change status to Empty
        $unset: { bookings: "", orders: "" } // Remove bookings and orders
      }
    );
  }

  // Update the destination table status to 'Available'
  await Table.updateOne(
    { tableNumber: toTableNumber },
    { $set: { status: 'Available' } } // Change status to Available
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
      time: new Date(newInfomationBook.date),
      status: 'Now',
      product: [],
      price: 0
    });

    // Add the split products to the new order and calculate the price
    let totalPrice = 0;
    for (const product of arrayProduct.splitProduct) {
      const foundProduct = await Product.findOne({ name: product.name });
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
    // Step 1: Fetch all products from the `fromTables` that have orders with status 'Now'
    let mergedProducts = [];
    let totalPrice = 0;

    for (const tableNumber of fromTables) {
      // Find the table by `tableNumber` to get its `_id`
      let tableFrom = await Table.findOne({ tableNumber: tableNumber });

      // Check if the table was found
      if (!tableFrom) {
        console.error(`Table with number ${tableNumber} not found.`);
        continue; // Skip to the next iteration
      }

      let tableFromId = tableFrom._id;
      // Step 1.4: Merge products only from orders with status 'Now'
      let orders = await Order.find({ tableId: tableFromId, status: 'Now' }); // Only 'Now' orders

      // Check if orders exist
      if (orders.length === 0) {
        console.log(`No active orders found for table ${tableNumber}.`);
        continue; // Skip to the next iteration
      }

      orders.forEach(order => {
        order.product.forEach(product => {
          const existingProduct = mergedProducts.find(p => p.productId.toString() === product.productId.toString());

          if (existingProduct) {
            existingProduct.numberProduct += product.numberProduct; // Sum up quantities
          } else {
            mergedProducts.push({
              productId: product.productId,
              numberProduct: product.numberProduct
            });
          }

        });
      });

      // Step 1.1: Update table status based on booking status
      let bookingFrom = await Booking.findOne({ tableId: tableFromId, status: 'Appointment' });
      let newStatus = bookingFrom ? 'Booked' : 'Empty';

      await Table.updateOne({ _id: tableFromId }, { $set: { status: newStatus } });

      // Step 1.2: Update the orders with status 'Now' to 'Cancelled' and set reason
      await Order.updateMany(
        { tableId: tableFromId, status: 'Now' },
        { $set: { status: 'Cancelled', reason: 'merge table' } }
      );

      // Step 1.3: Update bookings with status 'Now' to 'Cancelled' and set reason
      await Booking.updateMany(
        { tableId: tableFromId, status: 'Now' },
        { $set: { status: 'Cancelled', reason: 'merge table' } }
      );

    }

    // Step 2: Create a new order for the `toTable` with the merged products
    const tableTo = await Table.findOne({ tableNumber: toTableNumber });

    // Check if the destination table exists
    if (!tableTo) {
      console.error(`Destination table with number ${toTableNumber} not found.`);
      return; // Exit if table not found
    }

    const idTableTo = tableTo._id;  // Get the correct `_id` for the `toTable`

    const newOrder = new Order({
      tableId: idTableTo,  // Use the `_id` of `toTable`
      product: mergedProducts,
      price: totalPrice,
      status: 'Now',
      time: new Date(newBookingDetails.date)
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
