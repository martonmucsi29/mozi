import pool from '../utils/db.js';
import { Router } from 'express';

const filmrouter = Router();

filmrouter.get('/', async (req, res) => {
    let sql = `SELECT filmek.id, filmek.cim, filmek.hossz, filmek.korhatar, COUNT(DISTINCT vetitesek.id) AS vetitesDb, COUNT(foglalasok.id) AS eladottJegy FROM vetitesek LEFT JOIN foglalasok ON vetitesek.id = foglalasok.vetites_id LEFT JOIN termek ON termek.id = vetitesek.terem_id LEFT JOIN filmek ON vetitesek.film_id = filmek.id GROUP BY filmek.cim`;
    
    try{
        let [eredmeny] = await pool.query(sql);
        res.json(eredmeny);
    }catch (error) {
        console.error(error);
        res.status(500).json({hiba: 'Hiba az adatbázis lekérdezése során'});
    }
});

filmrouter.get('/:id', async (req, res) => {
    const {id} = req.params;
    
    let sql = `SELECT filmek.id, filmek.cim, filmek.hossz, filmek.korhatar FROM vetitesek LEFT JOIN foglalasok ON vetitesek.id = foglalasok.vetites_id LEFT JOIN termek ON termek.id = vetitesek.terem_id LEFT JOIN filmek ON vetitesek.film_id = filmek.id WHERE filmek.id = ? GROUP BY filmek.cim`;
    let sqlvet = `SELECT vetitesek.id, termek.nev, vetitesek.kezdes, vetitesek.jegyar FROM vetitesek LEFT JOIN foglalasok ON vetitesek.id = foglalasok.vetites_id LEFT JOIN termek ON termek.id = vetitesek.terem_id LEFT JOIN filmek ON vetitesek.film_id = filmek.id WHERE filmek.id = ? GROUP BY filmek.cim`;

    try{
        let [eredmeny] = await pool.query(sql, id);
        let [veteredeny] = await pool.query(sql, id);
        res.json(
            {eredmeny},
            {"vetitesek": veteredeny}
            );
    }catch (error) {
        console.error(error);
        res.status(500).json({hiba: 'Hiba az adatbázis lekérdezése során'});
    }
})

export default filmrouter;