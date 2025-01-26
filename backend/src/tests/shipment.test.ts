import request from 'supertest';
import app from '../index'; 
import { Shipment, ShipmentStatus, ShipmentWeight } from '../entities/Shipment';

describe('Shipment API', () => {
  it('should create a new shipment', async () => {
    const newShipment: Shipment = {
        status: ShipmentStatus.ORIGIN,
        weight: ShipmentWeight.LESS_THAN_1KG,
        originPostOffice: '12345',
        destinationPostOffice: '67890'
    };

    const res = await request(app).post('/shipments').send(newShipment);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id'); // Check if ID is assigned
    expect(res.body.status).toBe(newShipment.status);
    expect(res.body.weight).toBe(newShipment.weight);
    expect(res.body.originPostOffice).toBe(newShipment.originPostOffice);
    expect(res.body.destinationPostOffice).toBe(newShipment.destinationPostOffice);
  });

  it('should get shipments with filters', async () => {
    const res = await request(app)
      .get('/shipments')
      .query({ status: ShipmentStatus.ORIGIN });

    expect(res.status).toBe(200);
    // Assert that the returned shipments array contains only shipments with the specified status
  });

  // Add more test cases for different scenarios (e.g., invalid input, error handling)
});