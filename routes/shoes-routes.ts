import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

const testShoe = {
  id: 1,
  name: 'test shoe',
  archived: false,
  createdAt: new Date().toISOString(),
};

const ShoesRecordSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  archived: Type.Boolean(),
  createdAt: Type.String({ format: 'date-time' }),
});

const ShoesCreateSchema = Type.Object({
  name: Type.String(),
});

const ShoesDeleteParamsSchema = Type.Object({
  id: Type.Number(),
});

const ShoesDeleteResponseSchema = Type.Object({
  status: Type.Boolean(),
});

export const shoesRoutes: FastifyPluginAsyncTypebox = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: Type.Array(ShoesRecordSchema),
        },
      },
    },
    async () => {
      console.log(`Listing all shoes`);
      return [testShoe];
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: ShoesCreateSchema,
        response: { 200: ShoesRecordSchema },
      },
    },
    async (request) => {
      console.log(`Received request to create shoe ${request.body}`);
      return testShoe;
    }
  );

  fastify.put(
    '/',
    {
      schema: {
        body: ShoesRecordSchema,
        response: { 200: ShoesRecordSchema },
      },
    },
    async (request) => {
      console.log(`Received request to update shoe ${request.body}`);
      return testShoe;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: ShoesDeleteParamsSchema,
        response: {
          200: ShoesDeleteResponseSchema,
        },
      },
    },
    async (request) => {
      console.log(`Deleting shoe ID ${request.params.id}`);
      return { status: true };
    }
  );
};
