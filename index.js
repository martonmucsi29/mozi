import 'dotenv/config';
import express from 'express';
import filmrouter from './routes/filmRoute.js';

const app = express();
app.use(express.json());

app.use('/filmek', filmrouter);


const PORT = Number(process.env.PORT ?? 3000);


app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));