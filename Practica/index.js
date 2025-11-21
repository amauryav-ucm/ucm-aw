const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");

const usuariosService = require("./services/usuariosService");
const concesionariosService = require("./services/concesionariosService");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: "purevolt",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24*60*60*1000 }
    }),
);
app.use(expressLayouts);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const myUtils = require("./utils/utils");
app.locals.myUtils = myUtils;

app.post("*", (req, res, next) => {
    console.log("DEBUG", req.body);
    next();
});

/*
function debugMiddleware(app) {
    const originalUse = app.use.bind(app);

    app.use = function (...args) {
        const mw = args[args.length - 1];

        if (typeof mw === "function") {
            const name = mw.name || "anonymous";

            const wrapped = function (req, res, next) {
                console.log(`[MW START] ${name} -> ${req.method} ${req.url}`);

                const wrappedNext = (err) => {
                    if (err) {
                        console.log(`[MW ERROR] ${name} ->`, err);
                        return next(err);
                    }
                    console.log(`[MW NEXT] ${name}`);
                    next();
                };

                return mw(req, res, wrappedNext);
            };

            args[args.length - 1] = wrapped;
        }

        return originalUse(...args);
    };
}

debugMiddleware(app);
*/
// Routes
app.use((req, res, next) => {
    if (!res.locals.active) res.locals.active = {};
    next();
});

app.use((req, res, next) => {
    if (!req.session.id_usuario) return next();

    console.log(`DEBUG Usuario con sesion iniciada en la session: ${req.session.id_usuario}`);
    usuariosService.read({ id_usuario: req.session.id_usuario }, (err, rows) => {
        if (err) return next(err);

        if (!rows || rows.length < 1) {
            req.session.id_usuario = null;
            return next();
        }

        const user = rows[0];
        concesionariosService.read({ id_concesionario: user.id_concesionario }, (err, rows) => {
            if (err || !rows || rows.length < 1) return next(err);
            res.locals.user = { correo: user.correo, nombre: user.nombre, foto_perfil: user.foto_perfil, rol: user.rol, concesionario: rows[0] };
            return next();
        });
    });
});

app.use((req, res, next) => {
    const acc = req.session.accessibility || {};
    res.locals.accessibility = { theme: acc.theme || "dark", fontSize: acc.fontSize || "md" };
    next();
});

const mainRoutes = require("./routes/index");
app.use("/", mainRoutes);

const routesVehiculos = require("./routes/vehiculos");
app.use("/vehiculos", routesVehiculos);

const routesReservas = require("./routes/reservas");
app.use("/reservas", routesReservas);

const routesLogin = require("./routes/login");
app.use("/login", routesLogin);

const routesRegistrarse = require("./routes/registrarse");
app.use("/registrarse", routesRegistrarse);

const routesAccesibilidad = require("./routes/accesibilidad");
app.use("/accesibilidad", routesAccesibilidad);

const routesAdministracion = require("./routes/administracion");
app.use("/administracion", routesAdministracion);

app.use((req, res, next) => {
    const err = new Error("Página no encontrada");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.render("error", {
        err: err,
    });
});

// Server
app.listen(PORT, () => {
    console.log(`EcoMarket EXAM app running at http://localhost:${PORT}`);
});
