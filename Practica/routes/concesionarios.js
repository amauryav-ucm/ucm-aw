const express = require('express');
const router = express.Router();
const concesionariosService = require('../services/concesionariosService');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload-json", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.render("administracion/concesionarios", {
            logs: [{ mensaje: "No se subió archivo", tipo: "error" }]
        });
    }

    let a;
    try {
        a = JSON.parse(req.file.buffer.toString("utf8"));
        if (!Array.isArray(a)) throw new Error();
    } catch (e) {
        return res.render("administracion/concesionarios", {
            logs: [{ mensaje: "JSON inválido", tipo: "error" }]
        });
    }

    concesionariosService.upsertMany(a, (error, resultados) => {
        if (error) {
            console.log(error);
            return res.render("administracion/concesionarios", {
                logs: [{ mensaje: error.message, tipo: "error" }]
            });
        }

        const logs = resultados.map(r => ({
            mensaje: `Concesionario ${r.nombre} ${r.accion}`,
            tipo: r.accion === "insertado" || r.accion === "actualizado" ? "success" : "info"
        }));

        //res.render("administracion/concesionarios", { logs });
        res.redirect("/administracion/concesionarios");
    });
});


router.get('/coordenadas', function (req, res) {
/*   concesionariosService.obtenerUbicacionConcesionarios(function (err, concesionarios) {
        console.log("he llegado a concesionarios de routes", concesionarios);

    if (err) {
      return res.status(500).json({ ok: false, error: 'Error al hacer fetch de las coordenadas de los concesionarios' });
    }
    res.json({ ok: true, data: concesionarios });
  }); */
  concesionariosService.read({}, (err, concesionarios)=>{
    if (err) {
      return res.status(500).json({ ok: false, error: 'Error al hacer fetch de las coordenadas de los concesionarios' });
    }
    res.json({ ok: true, data: concesionarios.filter(c=>c.longitud && c.latitud) });

  })
});

module.exports = router;