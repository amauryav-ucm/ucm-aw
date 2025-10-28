const express = require('express');
const router = express.Router();

router.get('/vehiculos', (req, res) => {
    res.send(req.app.locals.vehiculos);
});

router.get('/reservas', (req, res) => {
    res.send(req.app.locals.reservas);
});

module.exports = router;
