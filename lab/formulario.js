const verifyField = (field) => {
    valid = field.isvalid();
    if (valid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
    return valid;
};

let fields = [];

patternNombre = patternApellidos = /^.{3,}$/;
patternEmail = /^[A-Za-z0-9_]+@[a-z-.]+\.[a-z]{2,}$/;
patternTelefono = /^[0-9]{9}$/;

// Nombre
campoNombre = document.getElementById('campo-nombre');
campoNombre.isvalid = () => {
    return campoNombre.value.match(patternNombre) !== null;
};
fields.push(campoNombre);

// Apellidos
campoApellidos = document.getElementById('campo-apellidos');
campoApellidos.isvalid = () => {
    return campoApellidos.value.match(patternNombre) !== null;
};
fields.push(campoApellidos);

// Email
campoEmail = document.getElementById('campo-email');
campoEmail.isvalid = () => {
    return campoEmail.value.match(patternEmail) !== null;
};
fields.push(campoEmail);

// Telefono
campoTelefono = document.getElementById('campo-telefono');
campoTelefono.isvalid = () => {
    return campoTelefono.value.match(patternTelefono) !== null;
};
fields.push(campoTelefono);

// Vehiculo
campoVehiculo = document.getElementById('campo-vehiculo');
campoVehiculo.isvalid = () => {
    return campoVehiculo.value != 0;
};
fields.push(campoVehiculo);

// Fecha de inicio
campoFechaInicio = document.getElementById('campo-fecha-inicio');
campoFechaInicio.isvalid = () => {
    const fechaInicio = new Date(campoFechaInicio.value);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    return fechaInicio > fechaActual;
};
fields.push(campoFechaInicio);

//Fecha de fin
campoFechaFin = document.getElementById('campo-fecha-fin');
campoFechaFin.isvalid = () => {
    const fechaFin = new Date(campoFechaFin.value);
    const fechaInicio = new Date(campoFechaInicio.value);
    return fechaFin >= fechaInicio;
};
fields.push(campoFechaFin);

formProgressBar = document.getElementById('form-progress-bar');

function updateProgressBar() {
    nFields = 0;
    nValidfields = 0;
    fields.forEach((field) => {
        nFields++;
        nValidfields += field.isvalid() ? 1 : 0;
    });
    console.log(nValidfields / nFields);
    formProgressBar.setAttribute(
        'style',
        `width: ${(100 * nValidfields) / nFields}%`
    );
}

fields.forEach((field) => {
    field.addEventListener('focusout', (event) => {
        updateProgressBar();
    });
    field.oninput = () => verifyField(field);
});

formularioReserva = document.getElementById('formulario-reserva');
formularioReserva.onsubmit = (event) => {
    valid = true;
    console.log(valid);
    fields.forEach((field) => {
        valid &&= verifyField(field);
    });
    console.log(valid);
    if (!valid) event.preventDefault();
};

formularioReserva.onreset = (event) => {
    fields.forEach((field) => {
        field.classList.remove('is-invalid');
        field.classList.remove('is-valid');
    });
};
