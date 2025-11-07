const express = require("express");
const router = express.Router();

router.post("/guardar", (req, res) => {
    console.log(req.body);
    req.session.accessibility = { theme: req.body.theme, fontSize: req.body.fontSize };
    res.redirect(req.get("referer") || "/");
});

module.exports = router;
