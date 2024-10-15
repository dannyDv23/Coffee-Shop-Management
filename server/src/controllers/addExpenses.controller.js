const HistoryMoney = require('../models/historyMoney');

// Hàm xử lý logic để thêm khoản chi
const addExpense = async (req, res) => {
  try {
    const { name, money, date } = req.body;
    
     // Kiểm tra ràng buộc dữ liệu
     if (!name || !money || !date) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      if (money <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
      }

    // Tạo một bản ghi mới trong collection historymoneys
    const newExpense = new HistoryMoney({
      name,
      money,
      date: new Date(date),
      status: 'Collect', // Thiết lập giá trị status là 'Expense'
    });

    // Lưu bản ghi vào database
    await newExpense.save();

    res.status(200).json({ message: `Đã nhập khoản chi "${name}" thành công` });
  } catch (err) {
    console.error('Error in addExpense:', err);
    res.status(500).json({ error: 'Cannot add expense' });
  }
};

module.exports = {
  addExpense,
};
