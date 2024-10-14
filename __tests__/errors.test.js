const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const request = require('supertest');
const db = require('../db/connection');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('GET: Invalid URL', () => {
  test('Responds with 404 Not Found when given an invalid path', () => {
    return request(app)
      .get('/api/not-valid')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
});
