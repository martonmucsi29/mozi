import pool from '../utils/db.js';
import { Router } from 'express';

const statrouter = Router();

statrouter.get('/filmek', async (req, res) => {
    let sql = `SELECT filmek.cim, SUM(adatok.eladottJegy) AS eladottJegy, SUM(adatok.bevetel) AS bevetel, CONCAT(FORMAT(SUM(adatok.eladottJegy) / SUM(adatok.kapacitas) * 100, 2), '%') AS telitettseg FROM filmek JOIN (SELECT vetitesek.film_id, COUNT(foglalasok.id) AS eladottJegy,vetitesek.jegyar * COUNT(foglalasok.id) AS bevetel, termek.sorok * termek.szekek AS kapacitas FROM vetitesek JOIN termek ON termek.id = vetitesek.terem_id LEFT JOIN foglalasok ON vetitesek.id = foglalasok.vetites_id GROUP BY vetitesek.id) AS adatok ON adatok.film_id = filmek.id GROUP BY filmek.cim`;
    
    try{
        let [eredmeny] = await pool.query(sql);
        res.json(eredmeny);
    }catch (error) {
        console.error(error);
        res.status(500).json({hiba: 'Hiba az adatbázis lekérdezése során'});
    }
})

export default statrouter;