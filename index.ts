import fastify from 'fastify';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { shoesRoutes } from './routes/shoes-routes.js';
import { mileageRoutes } from './routes/mileage-routes.js';

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

server.get('/health-check', async () => {
  return 'Health check success';
});

server.register(shoesRoutes, { prefix: '/shoes' });
server.register(mileageRoutes, { prefix: '/mileage' });

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
