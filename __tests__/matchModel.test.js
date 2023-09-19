const mongoose = require('mongoose');
const Match = require('../models/match');
require("dotenv").config();

beforeAll(() => {
  console.log('Starting tests...');
  mongoose.connect(process.env.DB);
});

afterAll(() => {
  console.log('All tests completed.');
});

describe('Match Model', () => {
  test('should create a new match', async () => {
    const matchData = {
      matches: [
        {
          matchDate: '2023-09-18',
          league: 'Premier League',
          homeTeam: 'Team A',
          awayTeam: 'Team B',
          homeScore: '2',
          awayScore: '1',
          matchStatus: 'Finished',
          homeLogo: 'logo_a.png',
          awayLogo: 'logo_b.png',
        },
      ],
    };

    const match = new Match(matchData);
    const savedMatch = await match.save();
    expect(savedMatch._id).toBeDefined();
  }, 60000);
});