const fetchAvailableTables = async (req) => {
    const response = await req.axios.get('http://localhost:3000/api/table/status/Available');
    return response.data.listTable;
  };
  
  const fetchBookableTables = async (req) => {
    const response = await req.axios.get('http://localhost:3000/api/table/list-can-booking');
    return response.data.listTableCanBook;
  };

  const fetchAllTables = async (req) => {
    const response = await req.axios.get('http://localhost:3000/api/table/all');
    return response.data.listTable;
  };
  
  module.exports = {
    fetchAvailableTables,
    fetchBookableTables,
    fetchAllTables
  };
  