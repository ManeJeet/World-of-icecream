const request = require('supertest');
const app = require('../app');

describe('Express App Tests', () => {
  test('GET / should render the index page', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Ice Cream Feedback');
  });

  test('POST /submit-feedback should save feedback and render thank you page', async () => {
    const feedbackData = {
      name: 'Test User',
      icecream: 'Vanilla',
      rating: 5,
      feedback: 'Delicious!'
    };

    const response = await request(app)
      .post('/submit-feedback')
      .type('form')
      .send(feedbackData);

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Thank You');
    expect(response.text).toContain('Test User');
    expect(response.text).toContain('Vanilla');
  });

  test('GET /feedback should display all feedback entries', async () => {
    const response = await request(app).get('/feedback');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Feedback Page');
  });

  test('POST /search should return matching feedback entries', async () => {
    // Insert a known feedback entry first
    await request(app)
      .post('/submit-feedback')
      .type('form')
      .send({
        name: 'Search Test',
        icecream: 'Chocolate',
        rating: 4,
        feedback: 'Good!'
      });

    const response = await request(app)
      .post('/search')
      .type('form')
      .send({ searchType: 'Chocolate' });

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Search Results');
    expect(response.text).toContain('Chocolate');
    expect(response.text).toContain('Search Test');
  });
});