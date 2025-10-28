const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('vehiculos', { vehiculos: req.app.locals.vehiculos });
});

router.get('/:id', (req, res) => {
    res.render('vehiculos_detalle', {
        vehiculo: req.app.locals.vehiculos.find(
            (v) => parseInt(v.id) === parseInt(req.params.id)
        ),
    });
});

module.exports = router;
