// constants.js

const ROLES = ['Admin', 'Employee'];
const EMPLOYEE_STATUSES = ['Active', 'Inactive'];
const TABLE_STATUSES = ['Available', 'Empty', 'Booked'];
const BOOKING_STATUSES = ['Appointment', 'Now', 'Cancelled'];
const ORDER_STATUSES = ['Now', 'Completed', 'Cancelled'];
const PRODUCT_STATUSES = ['Available', 'Unavailable'];
const EQUIPMENT_STATUSES = ['Active', 'Pending'];
const HISTORY_MONEY_STATUSES = ['Spend', 'Collect'];
const MATERIAL_STATUSES = ['Active', 'Delete'];
const HISTORY_MATERIAL_STATUSES = ['Used', 'OutOfStock','InStock','Reserved']; //InStock: Hàng hóa đã được nhập vào kho và sẵn sàng để bán. , Reserved: Hàng hóa đã được đặt trước hoặc giữ lại để phục vụ đơn hàng sắp tới.


module.exports = {
    ROLES,
    EMPLOYEE_STATUSES,
    TABLE_STATUSES,
    BOOKING_STATUSES,
    ORDER_STATUSES,
    PRODUCT_STATUSES,
    EQUIPMENT_STATUSES,
    HISTORY_MONEY_STATUSES,
    MATERIAL_STATUSES,
    HISTORY_MATERIAL_STATUSES
};
