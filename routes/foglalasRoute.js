import pool from '../utils/db.js';
import { Router } from 'express';

const foglalasrouter = Router();

foglalasrouter.post('/', async (req, res) => {
    const {vetites_id, nev, sor, szek} = req.body;

    if(!vetites_id || !nev || !sor || !szek){
        res.status(400).send("Hiba: Hiányzó értékek!");
    }
    if(!Number(sor) ||!Number(szek)){
        res.status(404).send("Hiba: A szék és sor értékeknek számnak kell lenniük!");
    }

    let sql = `INSERT INTO foglalasok( vetites_id, nev, sor, szek) VALUES (?, ?, ?, ?)`;
    try {   
        const [eredmeny] = await pool.query(sql, [vetites_id, nev, sor, szek]);
        return res.status(201).json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatbázisba írás során' });
    }
});

foglalasrouter.delete('/:id', async (req, res) => {
    const {id} = req.params;

    let sql = `DELETE FROM foglalasok WHERE id = ?`;

    try {   
        const [eredmeny] = await pool.query(sql, id);
        return res.status(201).json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatbázisból való adat törlés során' });
    }
});

export default foglalasrouter;