import express from 'express';
import routes from './routes/index.ts';
import { errorHandler } from './middleware/index.ts';

const app = express();

app.use(express.json());

// Подключаем центральный роутер
app.use('/', routes);

// Централизованная обработка ошибок (FR010)
app.use(errorHandler);

export default app;
