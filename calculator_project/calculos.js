function sum(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    if (b == 0) throw new Error('Error: No se puede dividir por cero');
    return a / b;
}

module.exports = {
    sum: sum,
    subtract: subtract,
    multiply: multiply,
    divide: divide,
};
