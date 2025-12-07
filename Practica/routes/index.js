const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    return res.render("index", { active: { inicio: true }});
});

router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error al destruir la sesión", err);
        }
        req.app.locals.user = null;
        res.redirect("/");
    });
});

module.exports = router;
