const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", { active: { inicio: true } });
});

router.post("/logout", (req, res) => {
    req.session.id_usuario = null;
    req.app.locals.user = null;
    res.redirect("/");
});

module.exports = router;
