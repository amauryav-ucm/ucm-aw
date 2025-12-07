(function() {
    'use strict';
    var form = document.getElementById('formulario-reserva');
    if (!form) return; 

    var campos = [
        form.querySelector('[name="nombre"]'),
        form.querySelector('[name="apellidos"]'),
        form.querySelector('[name="correo"]'),
        form.querySelector('[name="contrasena"]'),
        form.querySelector('[name="telefono"]'),
        form.querySelector('[name="id_concesionario"]')
    ].filter(c => c);

    function validarCampo(campo) {
        var val = campo.value.trim();
        var ok = true;
        
        // Manejo del campo opcional
        if (!campo.required && val === '') {
             campo.classList.remove('is-invalid', 'is-valid');
             return true;
        }   

        // Lógica general para todos los campos
        if (!campo.checkValidity()) {
            campo.classList.add('is-invalid');
            campo.classList.remove('is-valid');
            ok = false;
        } else {
            campo.classList.remove('is-invalid');
            campo.classList.add('is-valid');
        }
        
        return ok;
    }

    for (let campo of campos) {
        campo.addEventListener('input', e => validarCampo(e.target));
        campo.addEventListener('change', e => validarCampo(e.target));
    }

    form.addEventListener('submit', function(e) {
        let formOk = true;
        for (let campo of campos) {
            if (!validarCampo(campo)) formOk = false;
        }
        
        if (!formOk) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        form.classList.add('was-validated');
    });
})();