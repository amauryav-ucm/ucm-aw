const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
    res.locals.active = { reservas: true };
    next();
});

router.get("/", (req, res) => {
    res.render("reservas", {
        vehiculos: req.app.locals.vehiculos,
        selected: {},
    });
});

router.post("/", (req, res) => {
    console.log(req.body);
    res.redirect("/reservas/confirmacion");
});

router.get("/confirmacion", (req, res) => {
    res.render("reservas-confirmacion");
});

router.get("/:id", (req, res) => {
    res.render("reservas", {
        vehiculos: req.app.locals.vehiculos,
        selected: { vehiculo: req.params.id },
    });
});

module.exports = router;
