const axios = require('axios');

const addAuthHeaders = (req, res, next) => {
  const token = req.cookies["accessToken"];
  if (token) {
    req.axios = axios.create({
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });
    next();
  } else {
    return res.redirect('/login'); // Redirect to login if no token
  }
};

module.exports = addAuthHeaders;
