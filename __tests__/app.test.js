const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const request = require('supertest');
const db = require('../db/connection');
const endpoints = require('../endpoints.json');
require('jest-sorted');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('/api/not-a-path', () => {
  test('GET: 404 - Responds with 404 Not Found when given an invalid path', () => {
    return request(app)
      .get('/api/not-valid')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
});

describe('/api/topics', () => {
  test('GET: 200 - Responds with an array of topics with slug and description properties', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe('/api', () => {
  test('GET: 200 - Responds with a list of all available endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe('/api/articles/:article_id', () => {
  test('GET: 200 - Responds with the requested article if it exists', () => {
    return request(app)
      .get('/api/articles/2')
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 2,
          title: expect.any(String),
          author: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          body: expect.any(String),
        });
      });
  });
  test('GET: 400 - Responds with Bad request when given an invalid article_id', () => {
    return request(app)
      .get('/api/articles/not-a-number')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('GET: 404 - Responds with 404 Not Found for an article that does not exist', () => {
    const nonExistentArticleId = 8094;
    return request(app)
      .get(`/api/articles/${nonExistentArticleId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
});

describe('/api/articles', () => {
  test('GET: 200 - Responds with an array of articles with author, title, article_id, topic, created_at, votes, article_img_url, comment_count properties', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy('created_at', { descending: true });
        articles.forEach((article) => {
          expect(article).not.toContain(articles.body);
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe('/api/articles/:article_id/comments', () => {
  test('GET: 200 - Responds with an array of all comments for a given article_id', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
        expect(comments).toBeSortedBy('created_at', { descending: true });
      });
  });
  test('GET: 400 - Responds with Bad request when given an invalid article_id', () => {
    return request(app)
      .get('/api/articles/not-a-number/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('GET: 404 - Responds with 404 Not Found for an article that does not exist', () => {
    const nonExistentArticleId = 8094;
    return request(app)
      .get(`/api/articles/${nonExistentArticleId}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
  test('GET: 200 - Responds with an empty array if the article_id is valid but there are no comments', () => {
    const validIdWithNoComments = 13;
    return request(app)
      .get(`/api/articles/${validIdWithNoComments}/comments`)
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
});
