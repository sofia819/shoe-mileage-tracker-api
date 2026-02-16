import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

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

const shoesRoutes = new Hono<Env>();

shoesRoutes.get('/', async (c) => {
  const { results } = await c.env.DATABASE.prepare('SELECT * FROM shoes').all();

  return c.json(results, 200);
});

shoesRoutes.post('/', zValidator('json', ShoesCreateSchema), async (c) => {
  const body = c.req.valid('json');

  const result = await c.env.DATABASE.prepare(
    `INSERT INTO shoes (name, archived, createdAt)
         VALUES (?, ?, ?)
         RETURNING *`
  )
    .bind(body.name, false, new Date().toISOString())
    .first();

  return c.json(result, 201);
});

shoesRoutes.put('/', zValidator('json', ShoesBaseSchema), async (c) => {
  const body = c.req.valid('json');

  await c.env.DATABASE.prepare(
    `UPDATE shoes
         SET name = ?, archived = ?
         WHERE id = ?`
  )
    .bind(body.name, body.archived, body.id)
    .run();

  return c.json(body, 200);
});

shoesRoutes.delete(
  '/:id',
  zValidator('param', ShoesDeleteParamsSchema),
  async (c) => {
    const { id } = c.req.valid('param');

    await c.env.DATABASE.prepare('DELETE FROM shoes WHERE id = ?')
      .bind(id)
      .run();

    return c.json({ status: true }, 200);
  }
);

export default shoesRoutes;
