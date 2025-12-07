(function () {
    "use strict";

    // Select all forms that need validation
    var forms = document.querySelectorAll("form.needs-validation");
    if (!forms.length) return;

    function validarCampo(campo) {
        var val = campo.value.trim();
        var ok = true;

        // Optional field handling
        if (!campo.required && val === "") {
            campo.classList.remove("is-invalid", "is-valid");
            return true;
        }

        // HTML5 validity
        if (!campo.checkValidity()) {
            campo.classList.add("is-invalid");
            campo.classList.remove("is-valid");
            ok = false;
        } else {
            campo.classList.remove("is-invalid");
            campo.classList.add("is-valid");
        }

        return ok;
    }

    forms.forEach(function (form) {
        // Required fields inside this form
        var requiredFields = Array.from(form.querySelectorAll("[required]"));

        // Add listeners
        requiredFields.forEach(function (campo) {
            campo.addEventListener("input", function () {
                validarCampo(campo);
            });
            campo.addEventListener("change", function () {
                validarCampo(campo);
            });
        });

        // Form submit validation
        form.addEventListener("submit", function (e) {
            var formOk = true;

            requiredFields.forEach(function (campo) {
                if (!validarCampo(campo)) formOk = false;
            });

            if (!formOk) {
                e.preventDefault();
                e.stopPropagation();
            }

            form.classList.add("was-validated");
        });
    });
})();
