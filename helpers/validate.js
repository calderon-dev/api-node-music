const validator = require("validator")

const validate = (params) => {

    let result = false

    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: undefined }) &&
        validator.isAlpha(params.name, "es-ES")

    let nick = !validator.isEmpty(params.nick) &&
        validator.isLength(params.nick, { min: 2, max: 60 })

    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email)

    let password = !validator.isEmpty(params.password) &&
        validator.isLength(params.password, { min: 6, max: undefined });

    let surnameValid = true
    if (params.surname) {
        surnameValid = !validator.isEmpty(params.surname) &&
            validator.isLength(params.surname, { min: 3, max: undefined }) &&
            validator.isAlpha(params.surname, "es-ES")
    }
    if (!surnameValid) {
        throw new Error("No se ha superado la validación del apellido")
    } else {
        console.log("Validación de apellido superada")
    }

    if (!name || !nick || !email || !password) {
        throw new Error("no se ha superado la validación")
    } else {
        console.log("Validación Superada");
        result = true
    }

    return result
}

module.exports = validate