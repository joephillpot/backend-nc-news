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
          comment_count: expect.any(Number),
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
    test('PATCH: 201 - Updates the votes count amount when passed positive inc_votes', () => {
      const articleId = 1;
      const newVotes = { inc_votes: 1 };
      const newVoteCount = data.articleData[0].votes + 1;
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVotes)
        .expect(201)
        .then(({ body }) => {
          expect(body.msg.votes).toBe(newVoteCount);
        });
    });
    test('PATCH: 201 - Updates the votes count amount when passed negative inc_votes', () => {
      const articleId = 1;
      const newVotes = { inc_votes: -10 };
      const newVoteCount = data.articleData[0].votes - 10;
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVotes)
        .expect(201)
        .then(({ body }) => {
          expect(body.msg.votes).toBe(newVoteCount);
        });
    });
    test('PATCH: 400 - Responds with 400 Bad request when given an empty body', () => {
      const articleId = 1;
      const newVotes = {};
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
    test('PATCH: 400 - Responds with 400 Bad request when given a valid body but invalid input', () => {
      const articleId = 1;
      const newVotes = { inc_votes: ['not-a-number'] };
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
    test('PATCH: 201 - Responds with the correct updated article when the user updates the votes', () => {
      const articleId = 1;
      const newVotes = { inc_votes: 1 };
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVotes)
        .expect(201)
        .then(({ body }) => {
          expect(body.msg).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
    test('PATCH: 404 - Responds with 404 when article does not exist', () => {
      const articleId = 4096;
      const newVotes = { inc_votes: 1 };
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVotes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });
    test('PATCH: 201 - Responds with the correct updated article when given additional keys', () => {
      const articleId = 1;
      const newVotes = { inc_votes: 10, random_key: 5 };
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVotes)
        .expect(201)
        .then(({ body }) => {
          expect(body.msg).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
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
  test('GET: 200 - Articles are sorted by created_at date in DESC by default', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('created_at', { descending: true });
      });
  });
  describe('QUERY: sort_by', () => {
    test('GET: 200 - Sorts by sort_by query article_id', () => {
      return request(app)
        .get('/api/articles?sort_by=article_id')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('article_id', { descending: true });
        });
    });
    test('GET: 200 - Sorts by sort_by query author', () => {
      return request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('author', { descending: true });
        });
    });
    test('GET: 200 - Sorts by sort_by query title', () => {
      return request(app)
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('title', { descending: true });
        });
    });
    test('GET: 200 - Sorts by sort_by query topic', () => {
      return request(app)
        .get('/api/articles?sort_by=topic')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('topic', { descending: true });
        });
    });
    test('GET: 200 - Sorts by sort_by query created_at', () => {
      return request(app)
        .get('/api/articles?sort_by=created_at')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('created_at', { descending: true });
        });
    });
    test('GET: 200 - Sorts by sort_by query votes', () => {
      return request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('votes', { descending: true });
        });
    });
    test('GET: 200 - Sorts by sort_by query comment_count', () => {
      return request(app)
        .get('/api/articles?sort_by=comment_count')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('comment_count', { descending: true });
        });
    });
    test('GET: 400 - Responds with 400 if not a valid sort_by query', () => {
      return request(app)
        .get('/api/articles?sort_by=not_valid')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
  });
  describe('QUERY: order', () => {
    test('GET: 200 - Sorts by ASC order when given and order query of asc', () => {
      return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('created_at', { descending: false });
        });
    });
    test('GET: 200 - Sorts by ASC order when given and order query of ASC', () => {
      return request(app)
        .get('/api/articles?order=ASC')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('created_at', { descending: false });
        });
    });
    test('GET: 200 - Sorts by ASC order when given and order query of AsC', () => {
      return request(app)
        .get('/api/articles?order=AsC')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('created_at', { descending: false });
        });
    });
    test('GET: 200 - Sorts by ASC order when given a sort_by query', () => {
      return request(app)
        .get('/api/articles?sort_by=article_id&order=asc')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('article_id', { descending: false });
        });
    });
    test('GET: 400 - Responds with 400 if not a valid order query', () => {
      return request(app)
        .get('/api/articles?order=not_valid')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
  });
  describe('QUERY: topic', () => {
    test('GET: 200 - Filters articles by topic when given a valid topic query', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    test('GET: 200 - Returns an empty array when given a valid topic but has no articles', () => {
      return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(0);
        });
    });
    test('GET: 404 - Returns a 404 not found when given a non existent topic', () => {
      return request(app)
        .get('/api/articles?topic=not-a-topic')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });
  });
  describe('POST', () => {
    test('POST: 201 - Posts the article and returns an object of the article with the correct keys', () => {
      return request(app)
        .post('/api/articles')
        .send({
          author: 'butter_bridge',
          title: 'Test title',
          body: 'Test body',
          topic: 'paper',
          article_img_url: 'https://www.pexels.com/photo/close-up-photo-of-programming-of-codes-546819/',
        })
        .expect(201)
        .then(({ body: { postedArticle } }) => {
          expect(postedArticle).toMatchObject({
            author: 'butter_bridge',
            title: 'Test title',
            body: 'Test body',
            topic: 'paper',
            article_img_url: 'https://www.pexels.com/photo/close-up-photo-of-programming-of-codes-546819/',
            article_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          });
        });
    });
    test('POST: 201 - Posts the article and returns an object of the article with the correct keys and a default property for article_img_url when one is not provided', () => {
      return request(app)
        .post('/api/articles')
        .send({
          author: 'butter_bridge',
          title: 'Test title',
          body: 'Test body',
          topic: 'paper',
        })
        .expect(201)
        .then(({ body: { postedArticle } }) => {
          expect(postedArticle).toMatchObject({
            author: 'butter_bridge',
            title: 'Test title',
            body: 'Test body',
            topic: 'paper',
            article_img_url: 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
            article_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          });
        });
    });
    test('POST: 404 - Responds with Not found when the username does not exist in users', () => {
      return request(app)
        .post('/api/articles')
        .send({
          author: 'not_a_user',
          title: 'Test title',
          body: 'Test body',
          topic: 'paper',
          article_img_url: 'https://www.pexels.com/photo/close-up-photo-of-programming-of-codes-546819/',
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found")
        });
    });
    test('POST: 404 - Responds with Not found when the topic does not exist in topics', () => {
      return request(app)
        .post('/api/articles')
        .send({
          author: 'butter_bridge',
          title: 'Test title',
          body: 'Test body',
          topic: 'not_a_topic',
          article_img_url: 'https://www.pexels.com/photo/close-up-photo-of-programming-of-codes-546819/',
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found")
        });
    });
    test('POST: 400 - Responds with Bad request when not given an author key', () => {
      return request(app)
        .post('/api/articles')
        .send({
          title: 'Test title',
          body: 'Test body',
          topic: 'not_a_topic',
          article_img_url: 'https://www.pexels.com/photo/close-up-photo-of-programming-of-codes-546819/',
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request")
        });
    });
    test('POST: 400 - Responds with Bad request when not given a title key', () => {
      return request(app)
        .post('/api/articles')
        .send({
          author: 'butter_bridge',
          body: 'Test body',
          topic: 'not_a_topic',
          article_img_url: 'https://www.pexels.com/photo/close-up-photo-of-programming-of-codes-546819/',
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request")
        });
    });
    test('POST: 400 - Responds with Bad request when not given a body key', () => {
      return request(app)
        .post('/api/articles')
        .send({
          author: 'butter_bridge',
          title: 'Test title',
          topic: 'not_a_topic',
          article_img_url: 'https://www.pexels.com/photo/close-up-photo-of-programming-of-codes-546819/',
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request")
        });
    });
    test('POST: 400 - Responds with Bad request when not given a topic key', () => {
      return request(app)
        .post('/api/articles')
        .send({
          author: 'butter_bridge',
          title: 'Test title',
          body: 'Test body',
          article_img_url: 'https://www.pexels.com/photo/close-up-photo-of-programming-of-codes-546819/',
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request")
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
        random: 'this is a random property',
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
      const invalidArticleId = 'not-a-number';
      const newComment = {
        body: 'test comment body',
        author: 'butter_bridge',
      };
      return request(app)
        .post(`/api/articles/${invalidArticleId}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
    test('POST: 404 - Responds with 404 Not found when passed an invalid ID', () => {
      const nonExistentArticleId = '4096';
      const newComment = {
        body: 'test comment body',
        author: 'butter_bridge',
      };
      return request(app)
        .post(`/api/articles/${nonExistentArticleId}/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });
    test('POST: 400 - Responds with 400 when missing required field body/author', () => {
      const articleId = 2;
      const newComment = {
        body: 'test comment body',
      };
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
    test('POST: 404 - Responds with 404 when username does not exist', () => {
      const articleId = 2;
      const newComment = {
        body: 'test comment body',
        author: 'not-a-username',
      };
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });
  });
});

describe('/api/comments/:comment_id', () => {
  test('DELETE: 204 - Removes a comment by comment ID when given a valid ID', () => {
    const comment_id = 1;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test('DELETE: 204 - Removes a comment and checks it no longer exists', () => {
    const comment_id = 2;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .then(() => {
        return request(app)
          .get(`/api/comments/${comment_id}`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Not found');
          });
      });
  });
  test('DELETE: 404 - Returns 404 if given valid input but comment_id does not exist', () => {
    const nonExistentCommentId = 4096;
    return request(app)
      .delete(`/api/comments/${nonExistentCommentId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
  test('DELETE: 400 - Returns 400 if given a non valid input', () => {
    const nonValidCommentId = 'not-a-number';
    return request(app)
      .delete(`/api/comments/${nonValidCommentId}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  describe('PATCH', () => {
    test('PATCH: 200 - Increments the vote count of a comment', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { updatedComment } }) => {
          expect(updatedComment.votes).toBe(17);
        });
    });
    test('PATCH: 200 - Negatively increments the vote count of a comment', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({ body: { updatedComment } }) => {
          expect(updatedComment.votes).toBe(15);
        });
    });
    test('PATCH: 200 - Ignores any other keys being sent on the object', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 1, randomKey: 100 })
        .expect(200)
        .then(({ body: { updatedComment } }) => {
          expect(updatedComment.votes).toBe(17);
        });
    });
    test('PATCH: 400 - Responds with Bad request if not given inc_votes', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
    test('PATCH: 400 - Responds with Bad request if inc_votes is not valid', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 'not_a_number' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
    test('PATCH: 400 - Responds with Bad request if commend_id is invalid', () => {
      return request(app)
        .patch('/api/comments/not_a_number')
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
    test('PATCH: 404 - Responds with Not found if comment_id does not exist', () => {
      return request(app)
        .patch('/api/comments/4096')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });
  });
});

describe('/api/users', () => {
  test('GET: 200 - Responds with an array of users with username, name, avatar_url properties', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe('/api/users/:username', () => {
  test('GET: 200 - Responds with correct user when given a valid username', () => {
    return request(app)
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });
  test('GET: 404 - Responds with not found when given a username that is not present', () => {
    return request(app)
      .get('/api/users/not_a_user')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
});
