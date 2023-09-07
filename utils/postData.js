const axios = require('axios');
const config = require('../controllers/constants');

async function postData(allMatchData) {
  try {
    const endpoint = `${config.serverUrl}/api/todo`;
    const response = await axios.post(endpoint, { matches: allMatchData });
    console.log(`Data sent to ${endpoint}:`, response.data);

    return true;
  } catch (error) {
    console.error(`Error sending data to ${endpoint}:`, error);
  }
}

module.exports = {
  postData
}