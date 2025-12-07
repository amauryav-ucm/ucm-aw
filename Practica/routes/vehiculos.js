const express = require("express");
const router = express.Router();
const myUtils = require("../utils/utils.js");
const vehiculosService = require("../services/vehiculosService");
const usuariosService = require("../services/usuariosService");
const concesionariosService = require("../services/concesionariosService");

router.use((req, res, next) => {
    res.locals.active = { vehiculos: true };
    next();
});

router.use((req, res, next) => {
    if (!req.session.id_usuario) return res.redirect("/login");
    concesionariosService.read({ activo: true }, (err, concesionarios) => {
        if (err) return next(err);
        res.locals.concesionarios = concesionarios;
        usuariosService.read({ id_usuario: req.session.id_usuario, activo: true }, (err, usuario) => {
            if (err) return next(err);
            if (!usuario || usuario.length < 1) {
                req.session.id_usuario = null;
                return res.redirect("/login");
            }
            usuario = usuario[0];
            usuario.concesionario = concesionarios.find((c) => c.id_concesionario === usuario.id_concesionario);
            res.locals.usuario = usuario;
            vehiculosService.read({ activo: true }, (err, vehiculos) => {
                if (err) return next(err);
                vehiculos.forEach((v) => (v.concesionario = concesionarios.find((c) => c.id_concesionario === v.id_concesionario)));
                res.locals.vehiculos = vehiculos;
                return next();
            });
        });
    });
});

router.get("/", (req, res) => {
    let filtros = req.query;
    if (!filtros.ciudad && !filtros.concesionario) return res.redirect(`/vehiculos?concesionario=${res.locals.usuario.id_concesionario}`);

    // Normalizamos los parametros de la url para que sean todos arrays
    filtros.ciudad = myUtils.paramsToArray(filtros.ciudad).map((c) => c.toLowerCase());
    filtros.color = myUtils.paramsToArray(filtros.color);
    filtros.numero_plazas = myUtils.paramsToArray(filtros.numero_plazas).map((p) => parseInt(p));
    filtros.estado = myUtils.paramsToArray(filtros.estado);
    filtros.concesionario = myUtils.paramsToArray(filtros.concesionario).map((c) => parseInt(c));

    // Creamos la lista de vehiculos que cumplen los filtros
    console.log(res.locals.usuario, filtros);
    let vehiculosFiltrados = res.locals.vehiculos.filter((v) => {
        return (
            (filtros.concesionario.length === 0 || filtros.concesionario.includes(v.id_concesionario)) &&
            (filtros.ciudad.length === 0 || filtros.ciudad.includes(v.concesionario.ciudad.toLowerCase())) &&
            (filtros.color.length === 0 || filtros.color.includes(v.color)) &&
            (filtros.numero_plazas.length === 0 || filtros.numero_plazas.includes(parseInt(v.numero_plazas))) &&
            (!filtros.autonomia_km || parseInt(v.autonomia_km) >= parseInt(filtros.autonomia_km)) &&
            ((filtros.estado.length === 0 && v.estado === "disponible") || filtros.estado.includes(v.estado))
        );
    });

    // Creamos sets con las opciones disponibles de color y numero de plazas para mostrarlas en los filtros
    let opciones = {};
    opciones.ciudad = new Set(res.locals.concesionarios.map((c) => c.ciudad));
    opciones.concesionario = res.locals.concesionarios;
    opciones.color = new Set(res.locals.vehiculos.map((v) => v.color));
    opciones.numero_plazas = new Set(res.locals.vehiculos.map((v) => v.numero_plazas));

    res.render("vehiculos.ejs", {
        myUtils: req.app.locals.myUtils,
        vehiculos: vehiculosFiltrados,
        opciones: opciones,
        filtros: filtros,
    });
});

module.exports = router;
