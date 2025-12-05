const express = require("express");
const router = express.Router();
const vehiculosService = require("../services/vehiculosService");
const usuariosService = require("../services/usuariosService");
const reservasService = require("../services/reservasService");
const myUtils = require("../utils/utils");

router.use((req, res, next) => {
    res.locals.active = { reservas: true };
    res.locals.selected = {};
    next();
});

router.get('/comentarios', function (req, res) {
    reservasService.readComentariosYValoraciones((err, clientesComentarios) => {
        if (err) {
            return res.status(500).render('error', { message: 'Error al obtener comentarios' });
        }
        res.render('comentarios', { clientesComentarios }); 
    });
});

router.use((req, res, next) => {
    if (!req.session.id_usuario) return res.redirect("/login");
    usuariosService.read({ id_usuario: req.session.id_usuario }, (err, rows) => {
        if (err) return next(err);

        if (!rows || rows.length < 1) {
            req.session.id_usuario = null;
            return res.redirect("/login");
        }
        const id_concesionario = rows[0].id_concesionario;
        vehiculosService.read({ id_concesionario: id_concesionario }, (err, rows) => {
            if (err) return next(err);
            res.locals.vehiculos = rows;
            return next();
        });
    });
});

router.get("/", (req, res) => {
    res.render("reservas");
});

router.post("/", (req, res) => {
    let reserva = req.body;
    reserva.fecha_inicio = reserva.fecha_inicio.replace("T", " ") + ":00";
    reserva.fecha_fin = reserva.fecha_fin.replace("T", " ") + ":00";
    reservasService.create(reserva, (err, id) => {
        if (err) return res.render("reservas", { err: err.message });

        res.redirect("/reservas/confirmacion");
    });
});

router.get("/confirmacion", (req, res) => {
    res.render("reservas-confirmacion");
});

router.use("/historial", (req, res) => {
    reservasService.read({ id_usuario: req.session.id_usuario }, (err, reservas) => {
        if (err) return next(err);
        vehiculosService.read({}, (err, vehiculos) => {
            if (err) return next(err);
            reservas.forEach((r) => {
                r.vehiculo = vehiculos.find((v) => v.id_vehiculo === r.id_vehiculo);
            });
            console.log(reservas);
            return res.render("reservas-historial", { reservas: reservas, myUtils: myUtils });
        });
    });
});

router.get("/:id", (req, res) => {
    res.render("reservas", {
        selected: { vehiculo: req.params.id },
    });
});

router.post("/finalizar/:id", (req, res) => {
    reservasService.finalizarReserva(req.params.id, (err, result) => {
        if (err) return next(err);
        res.redirect("/reservas/historial");
    });
});

module.exports = router;
