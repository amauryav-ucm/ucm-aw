validarNombre = () => {
    let nombre = document.getElementById("nombre").value;
    return nombre.length >= 3;
}

validarEmail = () => {
    let email = document.getElementById("email").value;
    let patron = '/^[a-zA-Z0-9.-]+@[a-zA-Z0-9].-+\.[a-zA-Z]{2,}$/';
    return patron.test(email);
}

validarReserva = (fechaIntroducida) => {
    let fechaActual=new Date();
    return fechaActual.getTime() >= fechaIntroducida.getTime();
}

comprobarCampos = () => {
    let nombre = document.getElementById("nombre").value;
    let apellidos = document.getElementById("apellidos").value;
    let email = document.getElementById("email").value;
    let reserva = document.getElementById("reserva").value;
    document.getEleem
}

document.getElementById("formulario-reserva").addEventListener('submit', function(event) {
    if(!validarNombre() || !validarEmail() || !validarReserva())
        event.preventDefault();

})
