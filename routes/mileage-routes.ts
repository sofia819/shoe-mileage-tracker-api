import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

const testMileage = {
  id: 1,
  shoeId: 123,
  miles: 1.0,
  createdAt: new Date().toISOString(),
};

const MileageBaseSchema = Type.Object({
  shoeId: Type.Number(),
  miles: Type.Number(),
  createdAt: Type.String({ format: 'date-time' }),
});

export const MileageCreateSchema = MileageBaseSchema;

export const MileageRecordSchema = Type.Intersect([
  Type.Object({
    id: Type.Number(),
  }),
  MileageBaseSchema,
]);

const MileageDeleteParamsSchema = Type.Object({
  id: Type.Number(),
});

const MileageDeleteResponseSchema = Type.Object({
  status: Type.Boolean(),
});

export const mileageRoutes: FastifyPluginAsyncTypebox = async (
  fastify
): Promise<void> => {
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: Type.Array(MileageRecordSchema),
        },
      },
    },
    async () => {
      console.log(`Listing all mileages`);
      return [testMileage];
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: MileageCreateSchema,
        response: { 200: MileageRecordSchema },
      },
    },
    async (request) => {
      console.log(`Received request to create mileage ${request.body}`);
      return testMileage;
    }
  );

  fastify.put(
    '/',
    {
      schema: {
        body: MileageRecordSchema,
        response: { 200: MileageRecordSchema },
      },
    },
    async (request) => {
      console.log(`Received request to update mileage ${request.body}`);
      return testMileage;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: MileageDeleteParamsSchema,
        response: {
          200: MileageDeleteResponseSchema,
        },
      },
    },
    async (request) => {
      console.log(`Deleting mileage ID ${request.params.id}`);
      return { status: true };
    }
  );
};
