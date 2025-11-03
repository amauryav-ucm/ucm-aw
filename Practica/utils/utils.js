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

module.exports = {
    capitalize: capitalize,
    paramsToArray: paramsToArray,
};
