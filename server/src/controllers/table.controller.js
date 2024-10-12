const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { tableService, bookingService  } = require("../services");
const ApiError = require("../utils/ApiError");

const viewInfomationByTableNumber = catchAsync(async (req, res) => {
    const infoTable = await tableService.getInfomationTableById(req.params.tableNumber);
    res.status(httpStatus.OK).send({ infoTable });
});

const viewAllTable = catchAsync(async (req, res) => {
    const listTable = await tableService.getAllTable();
    res.status(httpStatus.OK).send({ listTable });
});

const viewTableCanBook = catchAsync(async (req, res) => {
    const listTableCanBook = await tableService.getTableCanBook();
    res.status(httpStatus.OK).send({ listTableCanBook });
});

const viewTableByStatus = catchAsync(async (req, res) => {
    const listTable = await tableService.getTableByStatus(req.params.tableStatus);
    res.status(httpStatus.OK).send({ listTable });
});

const viewTableProductById = catchAsync(async (req, res) => {
    const product = await tableService.getProductById(req.params.id);
    res.status(httpStatus.OK).send({ product });
});

const moveTableController = catchAsync(async (req, res) => {
    try {
        const { fromTableNumber, toTableNumber } = req.body;
        const sourceTableData = await tableService.getInfomationTableById(Number(fromTableNumber));
        if (sourceTableData.length === 0) {
            return res.status(404).json({ message: `Table ${fromTableNumber} not found or not available` });
        }
        const destinationTable = await tableService.getTableByNumber(Number(toTableNumber));
        console.log("destinationTable", destinationTable)

        if (!destinationTable) {
            return res.status(404).json({ message: `Table ${toTableNumber} not found` });
        }

        await tableService.moveTableData(sourceTableData[0]._id, destinationTable._id, fromTableNumber, toTableNumber);
        res.status(200).json({ message: "Table moved successfully", fromTableNumber, toTableNumber });
    } catch (error) {
        console.error('Error moving table:', error);
        res.status(500).json({ message: 'Error moving table', error });
    }
});

 const splitTableController = catchAsync(async (req, res) => {
    try {
        const { fromTableNumber, toTableNumber, product, newInfomationBook} = req.body;

        await tableService.splitTableData(
            fromTableNumber,
            toTableNumber,
            product,
            newInfomationBook
        );

        res.status(200).json({ message: "Table split successfully", fromTableNumber, toTableNumber });
    } catch (error) {
        console.error('Error splitting table:', error);
        res.status(500).json({ message: 'Error splitting table', error });
    }
});

const mergeTableController = catchAsync(async (req, res) => {
    try {
        // Destructure `fromTables`, `toTable`, and `newBookingDetails` from the request body
        const { fromTables, toTable, newBookingDetails } = req.body;

        // Call the tableService's mergeTable method, passing the array of `fromTables`, `toTable`, and `newBookingDetails`
        await tableService.mergeTables(
            fromTables,
            toTable,
            newBookingDetails
        );

        // Send a success response
        res.status(200).json({ message: "Table merger successful", fromTables, toTable });
    } catch (error) {
        console.error('Error merging tables:', error);

        // Send an error response in case of failure
        res.status(500).json({ message: 'Error merging tables', error });
    }
});

const cancelTableController = async (req, res) => {
    try {
        const { tableNumber } = req.params; 
        await tableService.cancelTable(tableNumber);
        res.status(200).json({ message: 'Table, bookings, and orders updated successfully' });
    } catch (error) {
        console.error('Error canceling table:', error);
        res.status(500).json({ message: 'Error updating statuses', error: error.message });
    }
};

module.exports = {
    viewInfomationByTableNumber,
    viewAllTable,
    viewTableCanBook,
    viewTableProductById,
    viewTableByStatus,
    moveTableController,
    splitTableController,
    mergeTableController,
    cancelTableController
};
