import 'dotenv/config';
import express from 'express';
import filmrouter from './routes/filmRoute.js';
import vetitesrouter from './routes/vetitesRoute.js';
import statrouter from './routes/statRoute.js';
import foglalasrouter from './routes/foglalasRoute.js';

const app = express();
app.use(express.json());

app.use('/filmek', filmrouter);
app.use('/vetitesek', vetitesrouter);
app.use('/statisztika', statrouter);
app.use('/foglalasok', foglalasrouter);

const PORT = Number(process.env.PORT ?? 3000);


app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));