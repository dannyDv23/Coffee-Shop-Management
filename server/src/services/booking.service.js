const Table = require("../models/table");

const getBookingNowByTableNumber = async (tableNumber) => {
    try {
      const parsedTableNumber = Number(tableNumber);
      const result = await Table.aggregate([
        {
          $match: {
            tableNumber: parsedTableNumber,
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
          $unwind: '$bookings'
        },
        {
          $match: {
            'bookings.status': 'Now'
          }
        },
        {
          $group: {
            _id: '$_id',
            tableNumber: { $first: '$tableNumber' },
            status: { $first: '$status' },
            bookings: { $push: '$bookings' },
          }
        },
        {
          $project: {
            tableNumber: 1,
            status: 1,
            bookings: 1,
          }
        }
      ]);
  
      return result;
    } catch (error) {
      console.error('Error fetching table details:', error);
      throw error;
    }
  };
  
module.exports = {
    getBookingNowByTableNumber
};
