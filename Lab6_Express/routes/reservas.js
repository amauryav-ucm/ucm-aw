const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('reservas', { vehiculos: req.app.locals.vehiculos });
});

router.get('/lista', (req, res) => {
    res.render('reservas_lista', {
        reservas: req.app.locals.reservas,
        vehiculos: req.app.locals.vehiculos,
    });
});

router.post('/', (req, res) => {
    console.log(req.body);
    req.app.locals.reservas.push(req.body);
    res.render('reservas', { vehiculos: req.app.locals.vehiculos });
});

module.exports = router;
