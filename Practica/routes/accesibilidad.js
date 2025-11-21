const express = require("express");
const router = express.Router();
const usuariosService = require('../services/usuariosService');

router.post("/guardar", (req, res) => {
    const preferencias = { theme: req.body.theme, fontSize: req.body.fontSize };
    
    req.session.accessibility = preferencias;
    if (req.session.id_usuario){
        usuariosService.setPreferencias(req.session.id_usuario, preferencias, (error, result) => { 
            if (error)
                console.error("Ha habido un error al guardar las preferencias del usuario", error)
        });
         return res.redirect(req.get("referer") || "/");
    }else{
        return res.redirect(req.get("referer") || "/");
    }
});

module.exports = router;
