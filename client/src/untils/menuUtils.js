const getMenuData = async (req) => {
    try {
      const response = await req.axios.get('http://localhost:3000/api/menu');
      return response.data; // Return the fetched data
    } catch (err) {
      console.error('Error fetching menu data:', err.message);
      throw err; // Re-throw to handle errors in the route
    }
  };
  
  const getMaterialsData = async (req) => {
    try {
      const response = await req.axios.get('http://localhost:3000/api/material');
      return response.data; // Return the fetched materials data
    } catch (err) {
      console.error('Error fetching materials data:', err.message);
      throw err;
    }
  };
  
  const getMenuById = async (req, id) => {
    try {
      const response = await req.axios.get(`http://localhost:3000/api/menu/${id}`);
      return response.data; // Return the fetched menu by ID
    } catch (err) {
      console.error('Error fetching menu by ID:', err.message);
      throw err;
    }
  };
  
  module.exports = {
    getMenuData,
    getMaterialsData,
    getMenuById
  };
  