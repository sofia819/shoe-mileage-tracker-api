import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

type Env = {
  Bindings: {
    DATABASE: D1Database;
  };
};

const mileageRoutes = new Hono<Env>();

/* -----------------------------
   Schemas
------------------------------ */

const MileageBaseSchema = z.object({
  shoeId: z.number(),
  miles: z.number(),
  createdAt: z.string(), // ISO string
});

const MileageRecordSchema = MileageBaseSchema.extend({
  id: z.number(),
});

const MileageDeleteParamsSchema = z.object({
  id: z.coerce.number(),
});

/* -----------------------------
   Helpers
------------------------------ */

const mapRow = (row: any) => ({
  ...row,
  miles: Number(row.miles),
});

/* -----------------------------
   Routes
------------------------------ */

// GET all mileage entries
mileageRoutes.get('/', async (c) => {
  const { results } = await c.env.DATABASE.prepare(
    'SELECT * FROM mileages ORDER BY createdAt DESC'
  ).all();

  const mileages = (results ?? []).map(mapRow);

  return c.json(z.array(MileageRecordSchema).parse(mileages));
});

// CREATE mileage entry
mileageRoutes.post('/', zValidator('json', MileageBaseSchema), async (c) => {
  const { shoeId, miles, createdAt } = c.req.valid('json');

  const row = await c.env.DATABASE.prepare(
    `INSERT INTO mileages (shoeId, miles, createdAt)
         VALUES (?, ?, ?)
         RETURNING *`
  )
    .bind(shoeId, miles, createdAt)
    .first();

  return c.json(MileageRecordSchema.parse(mapRow(row)), 201);
});

// UPDATE mileage entry
mileageRoutes.put('/', zValidator('json', MileageRecordSchema), async (c) => {
  const { id, shoeId, miles, createdAt } = c.req.valid('json');

  await c.env.DATABASE.prepare(
    `UPDATE mileages
         SET shoeId = ?, miles = ?, createdAt = ?
         WHERE id = ?`
  )
    .bind(shoeId, miles, createdAt, id)
    .run();

  return c.json({ success: true });
});

// DELETE mileage entry
mileageRoutes.delete(
  '/:id',
  zValidator('param', MileageDeleteParamsSchema),
  async (c) => {
    const { id } = c.req.valid('param');

    await c.env.DATABASE.prepare('DELETE FROM mileages WHERE id = ?')
      .bind(id)
      .run();

    return c.json({ success: true });
  }
);

export default mileageRoutes;
