/**
 * Convierte el primer caracter de la cadena a mayuscula
 * @param {String} str
 * @returns
 */

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convierte el parametro a un array
 * @param {*} param
 * @returns
 */
function paramsToArray(param) {
    // Si es nulo devolvemos un array vacío
    if (!param) return [];
    // Si es un objeto devolvemos un array con el objeto
    else if (!Array.isArray(param)) return [param];
    else return param;
}

function formatDate(d) {
    const pad = (n) => String(n).padStart(2, "0");

    const day = d.getDate();
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();

    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

module.exports = {
    capitalize: capitalize,
    paramsToArray: paramsToArray,
    formatDate: formatDate,
};
