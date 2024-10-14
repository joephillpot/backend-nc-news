const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const request = require('supertest');
const db = require('../db/connection');
const endpoints = require('../endpoints.json');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('/api/topics', () => {
  test('GET: 200 - Responds with an array of topics with slug and description properties', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(topic).toHaveProperty('slug');
          expect(topic).toHaveProperty('description');
        });
      });
  });
});
