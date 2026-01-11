import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import itemRoutes from './routes/itemRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

export default app;
