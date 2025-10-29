const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { active: { inicio: true } });
});

router.get('/reservas', (req, res) => {
    res.render('reservas.ejs', {
        active: { reservas: true },
        vehiculos: req.app.locals.vehiculos,
        selected: {},
    });
});

router.get('/reservas/:id', (req, res) => {
    res.render('reservas.ejs', {
        active: { reservas: true },
        vehiculos: req.app.locals.vehiculos,
        selected: { vehiculo: req.params.id },
    });
});

router.get('/vehiculos', (req, res) => {
    res.render('vehiculos.ejs', {
        myUtils: req.app.locals.myUtils,
        vehiculos: req.app.locals.vehiculos,
        active: { vehiculos: true },
    });
});

module.exports = router;
