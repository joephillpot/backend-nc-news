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
  describe('PATCH', () => {
    test('PATCH: 200 - Updates the votes count amount when passed positive inc_votes', () => {
      const articleId = 1
      const newVotes = {inc_votes: 1};
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.msg.votes).toBe(data.articleData[0].votes + 1);
        });
    });
    test('PATCH: 200 - Updates the votes count amount when passed negative inc_votes', () => {
      const articleId = 1
      const newVotes = {inc_votes: -10};
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.msg.votes).toBe(data.articleData[0].votes - 10);
        });
    });
    test('PATCH: 400 - Responds with 400 Bad request when given an empty body', () => {
      const articleId = 1
      const newVotes = {};
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test('PATCH: 400 - Responds with 400 Bad request when given a valid body but invalid input', () => {
      const articleId = 1
      const newVotes = {inc_votes: ["not-a-number"]};
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
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
  describe('POST:', () => {
    test('POST: 201 - Updates the comments database with a new comment when passed the correct input', () => {
      const articleId = 1;
      const newComment = {
        body: 'test comment body',
        author: 'butter_bridge',
      };
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toHaveProperty('author');
          expect(body.comment).toHaveProperty('body');
          expect(body.comment).toHaveProperty('article_id');
          expect(body.comment).toMatchObject({
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
    });
    test('POST: 201 - Updates the comments database with a new comment and ignores unnecessary properties', () => {
      const articleId = 2;
      const newComment = {
        body: 'test comment body',
        author: 'butter_bridge',
        random: 'this is a random property'
      };
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toHaveProperty('author');
          expect(body.comment).toHaveProperty('body');
          expect(body.comment).toHaveProperty('article_id');
          expect(body.comment).toMatchObject({
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
    });
    test('POST: 400 - Responds with 400 Invalid ID when passed an invalid ID', () => {
      const invalidArticleId = "not-a-number"
      const newComment = {
        body: 'test comment body',
        author: 'butter_bridge'
      };
      return request(app)
        .post(`/api/articles/${invalidArticleId}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test('POST: 404 - Responds with 404 Not found when passed an invalid ID', () => {
      const nonExistentArticleId = "4096"
      const newComment = {
        body: 'test comment body',
        author: 'butter_bridge'
      };
      return request(app)
        .post(`/api/articles/${nonExistentArticleId}/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
    test('POST: 400 - Responds with 400 when missing required field body/author', () => {
      const articleId = 2
      const newComment = {
        body: 'test comment body',
      };
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing required fields");
        });
    });
    test('POST: 404 - Responds with 404 when username does not exist', () => {
      const articleId = 2
      const newComment = {
        body: 'test comment body',
        author: "not-a-username"
      };
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
});

