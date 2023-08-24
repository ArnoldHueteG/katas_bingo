import request from 'supertest';
import express from 'express';
import app from './index'; // Modify this path accordingly

describe('API Tests', () => {

  describe('GET /getNumber', () => {
    it('should return a number if not all have been drawn', async () => {
      const res = await request(app).get('/getNumber');
      expect(res.status).toBe(200);
      expect(typeof res.body.number).toBe('number');
    });
    
    // Add more tests like checking if the number of requests exceeds 75 etc.
  });
  
  describe('GET /generateCard', () => {
    it('should return a bingo card', async () => {
      const res = await request(app).get('/generateCard');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.card)).toBe(true);
    });
  });

  describe('POST /generateNCards', () => {
    it('should return multiple bingo cards', async () => {
      const res = await request(app).post('/generateNCards').send({ n: 5 });
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(5);
    });

    it('should return 400 for invalid input', async () => {
      const res = await request(app).post('/generateNCards').send({ n: -5 });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /clearDrawnNumbers', () => {
    it('should clear drawn numbers', async () => {
      const res = await request(app).get('/clearDrawnNumbers');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('List of drawn numbers cleared');
    });
  });

  describe('GET /getDrawnNumbers', () => {
    it('should return list of drawn numbers', async () => {
      const res = await request(app).get('/getDrawnNumbers');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

});

