import pool from '../utils/db.js';
import { Router } from 'express';

const vetitesrouter = Router();

vetitesrouter.get('/', async (req, res) => {
    let params = [];
    let szurok = [];

    const {datum} = req.query;

    let sql = `SELECT filmek.id, filmek.cim, termek.nev, vetitesek.kezdes, ADDTIME(vetitesek.kezdes, SEC_TO_TIME(filmek.hossz * 60)) AS veg, vetitesek.jegyar, ((termek.szekek * termek.sorok) - COUNT(foglalasok.id)) AS szabadhely FROM filmek LEFT JOIN vetitesek ON vetitesek.film_id = filmek.id LEFT JOIN termek ON termek.id = vetitesek.terem_id LEFT JOIN foglalasok ON vetitesek.id = foglalasok.vetites_id`;

    if(datum){
        params.push(datum);
        szurok.push(`DATE(vetitesek.kezdes) = ?`);
    }

    if(szurok.length > 0) {
        sql += ` WHERE ${szurok.join(' AND ')}`;
    }

    sql += ` GROUP BY vetitesek.id ORDER BY vetitesek.kezdes ASC`;

    try{
        const [results] = await pool.query(sql, params);
        if (results.length === 0) {
            return res.status(400).json({"vetítések": "A megadott napon nincsenek vetítések."});
        }
        res.json({vetitesek: results});
    }
    catch (error){
        console.error(error);
        res.status(500).json({hiba: 'Hiba történt az adatbázis lekérdezése közben.'})
    }
});

vetitesrouter.get('/:id', async (req, res) => {
    const {id} = req.params;

    let sql = `SELECT filmek.id, filmek.cim, termek.nev, vetitesek.kezdes, vetitesek.jegyar, termek.sorok, termek.szekek, COUNT(foglalasok.id) AS foglalt, ((termek.szekek * termek.sorok) - COUNT(foglalasok.id)) AS szabadhely FROM filmek LEFT JOIN vetitesek ON vetitesek.film_id = filmek.id LEFT JOIN termek ON termek.id = vetitesek.terem_id LEFT JOIN foglalasok ON vetitesek.id = foglalasok.vetites_id WHERE filmek.id = ? GROUP BY vetitesek.id`;
    let sqlfoglalt = `SELECT foglalasok.sor, foglalasok.szek FROM filmek LEFT JOIN vetitesek ON vetitesek.film_id = filmek.id LEFT JOIN termek ON termek.id = vetitesek.terem_id LEFT JOIN foglalasok ON vetitesek.id = foglalasok.vetites_id WHERE foglalasok.id IS NOT NULL AND filmek.id = 3 ORDER BY foglalasok.sor, foglalasok.szek`;

    try{
        let [eredmeny] = await pool.query(sql, id);
        if (eredmeny.length === 0) {
            return res.status(404).json({hiba: "A megadott id-vel nem találtunk filmet"});
        }
        let [foglalteredeny] = await pool.query(sqlfoglalt, id);
        res.json(
            {"vetítés": eredmeny,
            "foglalt": foglalteredeny}
            );
    }catch (error) {
        console.error(error);
        res.status(500).json({hiba: 'Hiba az adatbázis lekérdezése során'});
    }
});

export default vetitesrouter;