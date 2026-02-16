import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const mileageRoutes = new Hono();

const testMileage = {
  id: 1,
  shoeId: 123,
  miles: 1.0,
  createdAt: new Date().toISOString(),
};

/**
 * Schemas (Zod equivalents of your TypeBox schemas)
 */

// Base schema
const MileageBaseSchema = z.object({
  shoeId: z.number(),
  miles: z.number(),
  createdAt: z.iso.datetime(),
});

// Record schema
export const MileageRecordSchema = MileageBaseSchema.extend({
  id: z.number(),
});

// Delete params
const MileageDeleteParamsSchema = z.object({
  id: z.coerce.number(),
});

// Delete response
const MileageDeleteResponseSchema = z.object({
  status: z.boolean(),
});

/**
 * Routes
 */

mileageRoutes.get('/', (c) => {
  console.log('Listing all mileages');

  const response = z.array(MileageRecordSchema).parse([testMileage]);

  return c.json(response, 200);
});

mileageRoutes.post('/', zValidator('json', MileageBaseSchema), (c) => {
  const body = c.req.valid('json');

  console.log('Received request to create mileage', body);

  const response = MileageRecordSchema.parse({
    id: 1,
    ...body,
  });

  return c.json(response, 200);
});

mileageRoutes.put('/', zValidator('json', MileageRecordSchema), (c) => {
  const body = c.req.valid('json');

  console.log('Received request to update mileage', body);

  return c.json(body, 200);
});

mileageRoutes.delete(
  '/:id',
  zValidator('param', MileageDeleteParamsSchema),
  (c) => {
    const { id } = c.req.valid('param');

    console.log(`Deleting mileage ID ${id}`);

    const response = MileageDeleteResponseSchema.parse({
      status: true,
    });

    return c.json(response, 200);
  }
);

export default mileageRoutes;
