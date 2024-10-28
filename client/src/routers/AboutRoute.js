const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');

const infomationDevTeam = [
  { name: 'Nguyen Truong Truong Loc', position: 'CO-FOUNDER, PRESIDENT', image: 'img/nguyentruongtruongloc.jpg'},
  { name: 'Nguyen Huynh Tien', position: 'CO-FOUNDER, PRESIDENT', image: 'img/nguyenhuynhtien.jpg'},
  { name: 'Pham Lam Anh', position: 'CO-FOUNDER, PRESIDENT', image: 'img/phamlamanh.jpg'},
  { name: 'Pham Nam Phuong', position: 'CO-FOUNDER, PRESIDENT', image: 'img/phamnamphuong.jpg'},
  { name: 'Dao Van Dat', position: 'CO-FOUNDER, PRESIDENT', image: 'img/daovandat.jpg'},
];



router.get('/', (req, res) => {
  res.render('../MainLayout', { bodyPage: path.join('views', 'AboutPage'), datas: infomationDevTeam });
});



module.exports = router;
