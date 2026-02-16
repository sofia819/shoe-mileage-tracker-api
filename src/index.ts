import { Hono } from 'hono';
import shoesRoutes from '../routes/shoes-routes';
import mileageRoutes from '../routes/mileage-routes';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/shoes', shoesRoutes);
app.route('/mileage', mileageRoutes);

export default app;
