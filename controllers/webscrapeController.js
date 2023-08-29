const axios = require("axios");
const { scoresURL } = require("./constants")

async function scrapeEspn(req, res) {
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: scoresURL,
      headers: { 
        'authority': 'site.web.api.espn.com', 
        'accept': '*/*', 
        'accept-language': 'en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,es-US;q=0.6,es;q=0.5', 
        'origin': 'https://www.espn.com', 
        'referer': 'https://www.espn.com/', 
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"', 
        'sec-ch-ua-mobile': '?0', 
        'sec-ch-ua-platform': '"Windows"', 
        'sec-fetch-dest': 'empty', 
        'sec-fetch-mode': 'cors', 
        'sec-fetch-site': 'same-site', 
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
      }
    };

    const response = await axios.request(config);
    res.json(response.data); // Respond with the entire data from the API response
  } catch (error) {
    console.error("Error scraping:", error);
    res.status(500).json({ error: "Error scraping data" });
  }
}

module.exports = {
  scrapeEspn
};
