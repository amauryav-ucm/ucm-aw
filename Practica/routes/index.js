const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const user = req.session.user;
    if (user) {
        req.app.locals.user = { username: user.username, profilePicture: user.profilePicture };
    }
    res.render("index", { active: { inicio: true } });
});

router.get("/registrarse", (req, res) => {
    res.render("registrarse");
});

module.exports = router;
