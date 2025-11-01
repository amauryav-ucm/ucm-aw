function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function normalizeQueryParams(param) {
    if (!param) return [];
    else if (Array.isArray(param)) return param;
    else return [param];
}

module.exports = {
    capitalize: capitalize,
    normalizeQueryParams: normalizeQueryParams,
};
