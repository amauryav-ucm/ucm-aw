const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/", (req, res) => {
    const usuarios = req.app.locals.usuarios;
    const credentials = req.body;
    const user = usuarios.find((u) => u.username === credentials.username.toLowerCase() && u.password === credentials.password);
    if (user) {
        req.session.user = user;
        res.redirect("/");
    } else {
        res.render("login", {
            wrongCredentials: true,
        });
    }
});

module.exports = router;
