const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.urlencoded(true));

const routesVehiculos = require('./routes/vehiculos');
const routesReservas = require('./routes/reservas');
const routesApi = require('./routes/api');

app.use('/vehiculos', routesVehiculos);
app.use('/reservas', routesReservas);
app.use('/api', routesApi);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('Escuchando en puerto 3000');
});

app.locals.vehiculos = [
    {
        id: 1,
        marca: 'Tesla',
        modelo: 'Model 3',
        anyo: 2023,
        potencia: 283,
        autonomia: 580,
        traccion: 'RWD',
        plazas: 5,
        precio: 22,
    },
    {
        id: 2,
        marca: 'Tesla',
        modelo: 'Model Y',
        anyo: 2024,
        potencia: 384,
        autonomia: 505,
        traccion: 'AWD',
        plazas: 5,
        precio: 28,
    },
    {
        id: 3,
        marca: 'Tesla',
        modelo: 'Model S',
        anyo: 2022,
        potencia: 670,
        autonomia: 650,
        traccion: 'AWD',
        plazas: 5,
        precio: 60,
    },
    {
        id: 4,
        marca: 'Tesla',
        modelo: 'Model X',
        anyo: 2023,
        potencia: 1020,
        autonomia: 560,
        traccion: 'AWD',
        plazas: 7,
        precio: 73,
    },
    {
        id: 5,
        marca: 'Nissan',
        modelo: 'Leaf',
        anyo: 2022,
        potencia: 150,
        autonomia: 385,
        traccion: 'FWD',
        plazas: 5,
        precio: 15,
    },
    {
        id: 6,
        marca: 'Nissan',
        modelo: 'Ariya',
        anyo: 2023,
        potencia: 215,
        autonomia: 490,
        traccion: 'AWD',
        plazas: 5,
        precio: 23,
    },
    {
        id: 7,
        marca: 'Nissan',
        modelo: 'e-NV200',
        anyo: 2024,
        potencia: 122,
        autonomia: 280,
        traccion: 'FWD',
        plazas: 2,
        precio: 17,
    },
    {
        id: 8,
        marca: 'Nissan',
        modelo: 'Note e-Power',
        anyo: 2022,
        potencia: 140,
        autonomia: 360,
        traccion: 'FWD',
        plazas: 5,
        precio: 14,
    },
    {
        id: 9,
        marca: 'BMW',
        modelo: 'i3',
        anyo: 2023,
        potencia: 170,
        autonomia: 310,
        traccion: 'RWD',
        plazas: 4,
        precio: 18,
    },
    {
        id: 10,
        marca: 'BMW',
        modelo: 'i4',
        anyo: 2024,
        potencia: 340,
        autonomia: 590,
        traccion: 'RWD',
        plazas: 5,
        precio: 30,
    },
    {
        id: 11,
        marca: 'BMW',
        modelo: 'iX',
        anyo: 2022,
        potencia: 523,
        autonomia: 600,
        traccion: 'AWD',
        plazas: 5,
        precio: 57,
    },
    {
        id: 12,
        marca: 'BMW',
        modelo: 'iX3',
        anyo: 2023,
        potencia: 286,
        autonomia: 460,
        traccion: 'RWD',
        plazas: 5,
        precio: 32,
    },
    {
        id: 13,
        marca: 'Hyundai',
        modelo: 'Kona Electric',
        anyo: 2022,
        potencia: 204,
        autonomia: 450,
        traccion: 'FWD',
        plazas: 5,
        precio: 16,
    },
    {
        id: 14,
        marca: 'Hyundai',
        modelo: 'Ioniq 5',
        anyo: 2023,
        potencia: 305,
        autonomia: 480,
        traccion: 'AWD',
        plazas: 5,
        precio: 23,
    },
    {
        id: 15,
        marca: 'Hyundai',
        modelo: 'Ioniq 6',
        anyo: 2024,
        potencia: 325,
        autonomia: 530,
        traccion: 'RWD',
        plazas: 5,
        precio: 26,
    },
    {
        id: 16,
        marca: 'Hyundai',
        modelo: 'Bayon EV',
        anyo: 2022,
        potencia: 136,
        autonomia: 380,
        traccion: 'FWD',
        plazas: 5,
        precio: 13,
    },
];

app.locals.reservas = [];
