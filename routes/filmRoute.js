import pool from '../utils/db.js';
import { Router } from 'express';

const filmrouter = Router();

filmrouter.get('/', async (req, res) => {
    let sql = `SELECT filmek.id, filmek.cim, filmek.hossz, filmek.korhatar, COUNT(DISTINCT vetitesek.id) AS vetitesDb, COUNT(foglalasok.id) AS eladottJegy FROM filmek LEFT JOIN vetitesek ON vetitesek.film_id = filmek.id LEFT JOIN termek ON termek.id = vetitesek.terem_id LEFT JOIN foglalasok ON vetitesek.id = foglalasok.vetites_id GROUP BY filmek.cim ORDER BY filmek.cim`;
    
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
    let sqlvet = `SELECT vetitesek.id, termek.nev, vetitesek.kezdes, vetitesek.jegyar, ((termek.szekek * termek.sorok) - COUNT(foglalasok.id)) AS szabadhely FROM filmek LEFT JOIN vetitesek ON vetitesek.film_id = filmek.id LEFT JOIN termek ON termek.id = vetitesek.terem_id LEFT JOIN foglalasok ON vetitesek.id = foglalasok.vetites_id WHERE filmek.id = 1 GROUP BY vetitesek.id`;
    try{
        let [eredmeny] = await pool.query(sql, id);
        if (eredmeny.length === 0) {
            return res.status(404).json({"vetítések": eredmeny});
        }
        let [veteredeny] = await pool.query(sqlvet, id);
        res.json(
            {"film": eredmeny,
            "vetítések": veteredeny}
            );
    }catch (error) {
        console.error(error);
        res.status(500).json({hiba: 'Hiba az adatbázis lekérdezése során'});
    }
})

export default filmrouter;