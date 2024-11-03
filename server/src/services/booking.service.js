const Table = require("../models/table");
const Booking = require("../models/booking");

const getBookingByTableNumber = async (tableNumbe) => {
    try {
      const parsedTableNumber = Number(tableNumbe);
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
          $addFields: {
            bookings: {
              $filter: {
                input: '$bookings',
                as: 'booking',
                cond: {
                  $eq: ['$$booking.status', 'Appointment'] 
                }
              }
            }
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
  

  const getAllBooking = async () => {
    try {
      const result = await Booking.find({ status: "Appointment" }).populate({
        path: 'tableId',
        select: 'tableNumber',
      });
  
      return result;
    } catch (error) {
      console.error('Error fetching table details:', error);
      throw error;
    }
  };
  

  const updateStatusBookingById = async (bookingId, statusGet) => {
    try {
        const booking = await Booking.findById(bookingId).populate('tableId');       
        if (!booking) {
            throw new Error('Booking not found');
        }

        await Booking.findByIdAndUpdate(bookingId, {
            $set: {
                status: statusGet
            }
        });

        let tableStatus;

        if (statusGet === 'Completed') {
            const otherBookings = await Booking.find({
                tableId: booking.tableId[0]._id,
                status: 'Appointment'
            });

            tableStatus = otherBookings.length === 0 ? 'Empty' : 'Booked';
        } else if (statusGet === 'Now') {
            tableStatus = 'Available';
        } else if (statusGet === 'Cancelled') {
            tableStatus = 'Empty';
        } else {
            tableStatus = 'Booked';
        }

        const updateResult = await Table.findByIdAndUpdate(booking.tableId[0]._id, {
            $set: {
                status: tableStatus
            }
        });

        return { message: 'updated successfully.' };

    } catch (error) {
        console.error('Error updating booking status:', error);
        throw error;
    }
};


module.exports = {
  getBookingByTableNumber,
  updateStatusBookingById,
  getAllBooking
};
