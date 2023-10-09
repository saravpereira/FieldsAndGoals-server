const request = require('supertest');
const app = require('../index');

beforeAll(() => {
  console.log('Starting tests...');
});

afterAll(() => {
  console.log('All tests completed.');
});

describe('Match Routes', () => {
  test('should create a new match', async () => {
    const res = await request(app)
      .post('/espn')
      .send({
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
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('matches');
  });
}, 60000);