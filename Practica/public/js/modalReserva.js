const formRes = document.getElementById("formRes");
const formResVehiculo = document.getElementById("formResVehiculo");
const formResFechaIni = document.getElementById("formResFechaIni");
const formResFechaFin = document.getElementById("formResFechaFin");
const formResSubmit = document.getElementById("formResSubmit");
const modalConfirmacion = document.getElementById("modalConfirmacion");
const modalConfirmacionObject = new bootstrap.Modal(modalConfirmacion);
const modalConfirmacionBody = document.getElementById("modalConfirmacionBody");

formResSubmit.addEventListener("click", (e) => {
    const fechaHoy = new Date();
    const fechaIni = formResFechaIni ? new Date(formResFechaIni.value) : null;
    const fechaFin = formResFechaFin ? new Date(formResFechaFin.value) : null;
    if (fechaIni) {
        if (fechaIni < fechaHoy) formResFechaIni.setCustomValidity("La fecha de inicio debe ser posterior a la fecha actual");
        else formResFechaIni.setCustomValidity("");
    }
    if (fechaFin) {
        if (fechaIni && fechaFin < fechaIni) formResFechaFin.setCustomValidity("La fecha de fin debe ser posterior a la fecha de inicio");
        else formResFechaFin.setCustomValidity("");
    }
    if (!formRes.checkValidity()) {
        formRes.classList.add("was-validated");
        return;
    }

    modalConfirmacionObject.show();
});

modalConfirmacion.addEventListener("show.bs.modal", () => {
    console.log(formResVehiculo.options);
    const [fechaIni, horaIni] = formResFechaIni.value.split("T");
    const [fechaFin, horaFin] = formResFechaFin.value.split("T");
    modalConfirmacionBody.innerHTML = `

        <p>Seguro que desea reservar el vehículo <strong>${formResVehiculo.options[formResVehiculo.selectedIndex].text}</strong> desde el ${fechaIni} a las ${horaIni} hasta el ${fechaFin} a las ${horaFin}?</p>
    `;
});
