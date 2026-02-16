import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const testShoe = {
  id: 1,
  name: 'test shoe',
  archived: false,
  createdAt: new Date().toISOString(),
};

const ShoesBaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  archived: z.boolean(),
});

const ShoesRecordSchema = ShoesBaseSchema.extend({
  createdAt: z.iso.datetime(),
});

const ShoesCreateSchema = z.object({
  name: z.string(),
});

const ShoesDeleteParamsSchema = z.object({
  id: z.coerce.number(),
});

const ShoesDeleteResponseSchema = z.object({
  status: z.boolean(),
});

const shoesRoutes = new Hono();

shoesRoutes.get('/', (c) => {
  console.log('Listing all shoes');

  const response = z.array(ShoesRecordSchema).parse([testShoe]);

  return c.json(response, 200);
});

shoesRoutes.post('/', zValidator('json', ShoesCreateSchema), (c) => {
  const body = c.req.valid('json');

  console.log(`Received request to create shoe`, body);

  const response = ShoesRecordSchema.parse(testShoe);

  return c.json(response, 200);
});

shoesRoutes.put('/', zValidator('json', ShoesBaseSchema), (c) => {
  const body = c.req.valid('json');

  console.log(`Received request to update shoe`, body);

  return c.json(body, 200);
});

shoesRoutes.delete(
  '/:id',
  zValidator('param', ShoesDeleteParamsSchema),
  (c) => {
    const { id } = c.req.valid('param');

    console.log(`Deleting shoe ID ${id}`);

    const response = ShoesDeleteResponseSchema.parse({ status: true });

    return c.json(response, 200);
  }
);

export default shoesRoutes;
