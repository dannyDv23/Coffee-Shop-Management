const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');

const infomationDevTeam = [
  { name: 'Pham Lam Anh', position: 'CO-FOUNDER, PRESIDENT', image: 'https://via.placeholder.com/150'},
  { name: 'Nguyen Huynh Tien', position: 'CO-FOUNDER, PRESIDENT', image: 'https://via.placeholder.com/150'}, 
  { name: 'Nguyen Truong Truong Loc', position: 'CO-FOUNDER, PRESIDENT', image: 'https://via.placeholder.com/150'},
  { name: 'Dao Van Dat', position: 'CO-FOUNDER, PRESIDENT', image: 'https://via.placeholder.com/150'},
  { name: 'Pham Nam Phuong', position: 'CO-FOUNDER, PRESIDENT', image: 'https://via.placeholder.com/150'},
];



router.get('/', (req, res) => {
  res.render('../MainLayout', { bodyPage: path.join('views', 'AboutPage'), datas: infomationDevTeam });
});



module.exports = router;
