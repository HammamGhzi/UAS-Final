import 'dotenv/config';

import express, { Request, Response } from 'express';
import cors from 'cors';
import prisma from './config/prisma';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import sanggarRoutes from './routes/sanggarRoutes';
import batikCategoryRoutes from './routes/batikCategoryRoutes';
import reviewRoutes from './routes/reviewRoutes';
import criteriaRoutes from './routes/criteriaRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import spkSessionRoutes from './routes/spkSessionRoutes';
import regionRoutes from './routes/regionRoutes'; 
import dashboardRoutes from './routes/dashboardRoutes';
const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from backend (TypeScript)' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sanggars', sanggarRoutes);
app.use('/api/batik-categories', batikCategoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/criteria', criteriaRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/spk-sessions', spkSessionRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/dashboard', dashboardRoutes);
const server = app.listen(PORT, () => {
  console.log(`Server berjalan di PORT : ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});