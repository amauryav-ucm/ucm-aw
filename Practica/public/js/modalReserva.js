const formRes = document.getElementById("formRes");
const formResVehiculo = document.getElementById("formResVehiculo");
const formResFechaIni = document.getElementById("formResFechaIni");
const formResHoraIni = document.getElementById("formResHoraIni");
const formResFechaFin = document.getElementById("formResFechaFin");
const formResHoraFin = document.getElementById("formResHoraFin");
const formResSubmit = document.getElementById("formResSubmit");
const modalConfirmacion = document.getElementById("modalConfirmacion");
const modalConfirmacionObject = new bootstrap.Modal(modalConfirmacion);
const modalConfirmacionBody = document.getElementById("modalConfirmacionBody");

formResSubmit.addEventListener("click", (e) => {
    if (!formRes.checkValidity()) {
        formRes.reportValidity();
    } else {
        modalConfirmacionObject.show();
    }
});

modalConfirmacion.addEventListener("show.bs.modal", () => {
    console.log(formResVehiculo.options);
    modalConfirmacionBody.innerHTML = `
        <p>Seguro que desea reservar un ${formResVehiculo.options[formResVehiculo.value].text} desde el ${formResFechaIni.value} a las ${formResHoraIni.value} hasta el ${formResFechaFin.value} a las ${formResHoraFin.value} ?</p>
    `;
});
