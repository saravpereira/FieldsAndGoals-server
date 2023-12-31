const MatchData = require('../models/match');
const {
  getDateRange,
  getYesterdayDate,
  formatDateToLongString,
} = require('../utils/dateUtils');
const scrapeController = require('./webscrapeController');
const { setCache, getCache } = require('../utils/cache');

const yesterdayDate = getYesterdayDate();

exports.createMatch = (req, res) => {
  const matchesData = req.body.matches;

  const matchData = new MatchData({
    matches: matchesData.map((match) => ({
      matchDate: match.matchDate,
      league: match.league,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      matchStatus: match.matchStatus,
      homeLogo: match.homeLogo,
      awayLogo: match.awayLogo,
    })),
  });

  matchData
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Match data added successfully',
        matches: result.matches,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Failed to add match data',
        error: err,
      });
    });
};

exports.getPastResults = async (_, res) => {
  try {
    const allMatchData = await scrapeController.scrapeEspn(
      yesterdayDate,
      yesterdayDate
    );

    const saveMatchPromises = allMatchData.map((matchData) => {
      const newMatch = new MatchData({
        matchDate: matchData.matchDate,
        league: matchData.league,
        homeTeam: matchData.homeTeam,
        awayTeam: matchData.awayTeam,
        homeScore: matchData.homeScore,
        awayScore: matchData.awayScore,
        matchStatus: matchData.matchStatus,
        homeLogo: matchData.homeLogo,
        awayLogo: matchData.awayLogo,
      });
      return newMatch.save();
    });

    const savedMatches = await Promise.all(saveMatchPromises);

    if (savedMatches.length) {
      const successMessage = 'Successfully posted data';
      console.log(successMessage, savedMatches);
      if (res) {
        res.status(200).json({ message: successMessage, savedMatches });
      }
    } else {
      const errorMessage = 'Failed to post data';
      console.log(errorMessage);
      if (res) {
        res.status(500).json({ error: errorMessage });
      }
    }
  } catch (error) {
    console.error('Error saving data to database:', error);
    if (res) {
      res.status(500).json({ error: error.message });
    }
  }
};

/**
 * User can specify endDate by appending it as a query parameter:
 * http://localhost:8080/espn/getGamesByDates?endDate=20231125
 */
exports.getResultsByDates = async (req, res) => {
  const userEndDate = req.query.endDate;

  try {
    const { startDate, endDate } = getDateRange(userEndDate);
    const cacheKey = `${startDate}-${endDate}`;

    const cachedData = getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        ...cachedData,
        message: 'Data retrieved from cache',
      });
    }

    const scrapedData = await scrapeController.scrapeEspn(startDate, endDate);

    setCache(cacheKey, scrapedData);

    res.status(200).json({
      data: scrapedData,
      isCached: false,
      message: 'Freshly scraped data',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sample query: http://localhost:8080/espn/getPastMatchesByDate?date=20230907
exports.getPastMatchesByDate = async (req, res) => {
  let queryDate = req.query.date;

  if (!queryDate) {
    const yesterdayDate = getYesterdayDate();
    queryDate = formatDateToLongString(yesterdayDate);
  } else {
    queryDate = formatDateToLongString(queryDate);
  }

  try {
    const matches = await MatchData.find({ 'matches.matchDate': queryDate });
    if (matches.length) {
      res.status(200).json(matches);
    } else {
      res.status(404).json({ message: 'No matches found for the given date' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
