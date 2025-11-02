const express = require("express");
const router = express.Router();
const myUtils = require("../utils/utils.js");

router.get("/", (req, res) => {
    res.render("index", { active: { inicio: true } });
});

router.get("/reservas", (req, res) => {
    res.render("reservas.ejs", {
        active: { reservas: true },
        vehiculos: req.app.locals.vehiculos,
        selected: {},
    });
});

router.get("/reservas/:id", (req, res) => {
    res.render("reservas.ejs", {
        active: { reservas: true },
        vehiculos: req.app.locals.vehiculos,
        selected: { vehiculo: req.params.id },
    });
});

router.get("/vehiculos", (req, res) => {
    let filtros = req.query;
    filtros.color = myUtils.normalizeQueryParams(filtros.color);
    filtros.numero_plazas = myUtils.normalizeQueryParams(filtros.numero_plazas).map((p) => parseInt(p));
    filtros.estado = myUtils.normalizeQueryParams(filtros.estado);
    let vehiculosFiltrados = req.app.locals.vehiculos.filter((v) => {
        return (
            (filtros.color.length === 0 || filtros.color.includes(v.color)) &&
            (filtros.numero_plazas.length === 0 || filtros.numero_plazas.includes(parseInt(v.numero_plazas))) &&
            (!filtros.autonomia_km || parseInt(v.autonomia_km) >= parseInt(filtros.autonomia_km)) &&
            ((filtros.estado.length === 0 && v.estado === "disponible") || filtros.estado.includes(v.estado))
        );
    });
    color = new Set(req.app.locals.vehiculos.map((v) => v.color));
    numero_plazas = new Set(req.app.locals.vehiculos.map((v) => v.numero_plazas));
    console.log(filtros);
    res.render("vehiculos.ejs", {
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

router.get("/registrarse", (req, res) => {
    res.render("registrarse");
});

router.post("/reservas", (req, res) => {
    throw new Error("Not implemented");
});

module.exports = router;
