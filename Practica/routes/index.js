const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", { active: { inicio: true } });
});

router.get("/registrarse", (req, res) => {
    res.render("registrarse");
});

router.post("/logout", (req, res) => {
    req.session.username = null;
    req.app.locals.user = null;
    res.redirect("/");
});

module.exports = router;
