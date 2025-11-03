const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
    res.locals.active = { reservas: true };
    next();
});

router.get("/", (req, res) => {
    res.render("reservas.ejs", {
        vehiculos: req.app.locals.vehiculos,
        selected: {},
    });
});

router.get("/:id", (req, res) => {
    res.render("reservas.ejs", {
        vehiculos: req.app.locals.vehiculos,
        selected: { vehiculo: req.params.id },
    });
});

module.exports = router;
