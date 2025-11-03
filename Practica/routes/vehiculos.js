const express = require("express");
const router = express.Router();
const myUtils = require("../utils/utils.js");

router.use((req, res, next) => {
    res.locals.active = { vehiculos: true };
    next();
});

router.get("/", (req, res) => {
    let filtros = req.query;

    // Normalizamos los parametros de la url para que sean todos arrays
    filtros.color = myUtils.paramsToArray(filtros.color);
    filtros.numero_plazas = myUtils.paramsToArray(filtros.numero_plazas).map((p) => parseInt(p));
    filtros.estado = myUtils.paramsToArray(filtros.estado);

    // Creamos la lista de vehiculos que cumplen los filtros
    let vehiculosFiltrados = req.app.locals.vehiculos.filter((v) => {
        return (
            (filtros.color.length === 0 || filtros.color.includes(v.color)) &&
            (filtros.numero_plazas.length === 0 || filtros.numero_plazas.includes(parseInt(v.numero_plazas))) &&
            (!filtros.autonomia_km || parseInt(v.autonomia_km) >= parseInt(filtros.autonomia_km)) &&
            ((filtros.estado.length === 0 && v.estado === "disponible") || filtros.estado.includes(v.estado))
        );
    });

    // Creamos sets con las opciones disponibles de color y numero de plazas para mostrarlas en los filtros
    let opciones = {};
    opciones.color = new Set(req.app.locals.vehiculos.map((v) => v.color));
    opciones.numero_plazas = new Set(req.app.locals.vehiculos.map((v) => v.numero_plazas));

    console.log(filtros);
    res.render("vehiculos.ejs", {
        myUtils: req.app.locals.myUtils,
        vehiculos: vehiculosFiltrados,
        opciones: opciones,
        filtros: filtros,
    });
});

module.exports = router;
