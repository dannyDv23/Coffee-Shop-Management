// utils/apiUtils.js
const fetchMaterials = async (req) => {
    const response = await req.axios.get('http://localhost:3000/api/material');
    return response.data; // Return the materials data
  };
  
  const fetchMaterialById = async (req, id) => {
    const response = await req.axios.get(`http://localhost:3000/api/material/${id}`);
    return response.data; // Return the material data
  };
  
  module.exports = {
    fetchMaterials,
    fetchMaterialById,
  };
  