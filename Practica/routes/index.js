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
    let filtros = req.query;
    if (filtros.color) filtros.color = filtros.color.split(',');
    if (filtros.numero_plazas)
        filtros.numero_plazas = filtros.numero_plazas
            .split(',')
            .map((p) => parseInt(p));
    let vehiculosFiltrados = req.app.locals.vehiculos.filter((v) => {
        return (
            (!filtros.color || filtros.color.includes(v.color)) &&
            (!filtros.numero_plazas ||
                filtros.numero_plazas.includes(parseInt(v.numero_plazas))) &&
            (!filtros.autonomia_km ||
                parseInt(v.autonomia_km) >= parseInt(filtros.autonomia_km)) &&
            ((filtros.estado && filtros.estado.split(',').includes(v.estado)) ||
                (!filtros.estado && v.estado === 'disponible'))
        );
    });
    color = new Set(req.app.locals.vehiculos.map((v) => v.color));
    numero_plazas = new Set(
        req.app.locals.vehiculos.map((v) => v.numero_plazas)
    );
    res.render('vehiculos.ejs', {
        active: { vehiculos: true },
        myUtils: req.app.locals.myUtils,
        vehiculos: vehiculosFiltrados,
        opciones: {
            color: color,
            numero_plazas: numero_plazas,
        },
        filtros: filtros,
    });
});

router.get('/registrarse', (req, res) => {
    res.render('registrarse', { active: {} });
});

module.exports = router;
