const validate = require("../helpers/validate.js")
const User = require("../models/userModels.js")
const bcrypt = require("bcrypt")
const fs = require("fs")
const path = require("path")
const jwt = require("../helpers/jwt.js")

const register = async (req, res) => {

    let params = req.body

    console.log(params)

    if (!params.name || !params.nick || !params.email) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }

    try {
        validate(params)
    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Validación no superada"
        })
    }

    //Duplicate
    try {
        const existingUser = await User.findOne({
            $or: [
                { email: params.email.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        })

        if (existingUser) {
            return res.status(400).send({
                status: "error",
                message: "El Usuario ya existe"
            })
        }

        const pwd = await bcrypt.hash(params.password, 10)
        params.password = pwd

        const userSave = new User(params)
        const userStored = await userSave.save()

        let userClean = userStored.toObject()
        delete userClean.password
        delete userClean.role

        const token = jwt.createToken(userStored)

        return res.status(200).send({
            status: "success",
            message: "Usuario Registrado",
            User: userClean,
            token
        })

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error en el servidor",
            error: error.message
        })
    }
}

const login = async (req, res) => {

    let params = req.body

    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }

    try {
        const user = await User.findOne({ email: params.email.toLowerCase() }).select("+password")
        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "Usuario no encontrado"
            })
        }

        const pwdOK = await bcrypt.compare(params.password, user.password)

        if (!pwdOK) return res.status(400).send({ status: "error", message: "Credenciales incorrectas" })

        let userClean = user.toObject()
        delete userClean.password

        const token = jwt.createToken(user)

        return res.status(200).send({
            status: "success",
            message: "Usuario Valido",
            user: userClean,
            token
        })
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error en el servidor", error: error.message });
    }
}

const profile = async (req, res) => {

    const id = req.params.id
    const user = await User.findById(id).select("-password -role")
    if (!user) {
        return res.status(401).send({
            status: "error",
            message: "Usuario No encontrado"
        })
    }

    return res.status(200).send({
        status: "success",
        message: "Usuario Valido",
        id,
        user
    })
}

const update = async (req, res) => {


    try {
        const userIdentity = req.user
        let userToUpdate = req.body

        delete userToUpdate.role;
        delete userToUpdate.create_at;

        if (userToUpdate.password) {
            const hashPW = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = hashPW;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userIdentity.id,
            userToUpdate,
            { new: true }
        ).select("-password -role")

        if (!updatedUser) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Usuario actualizado correctamente",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
            error: error.message
        });
    }

}

const upload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "No se subió el archivo"
            })
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { image: req.file.filename },
            { returnDocument: "after" }
        ).select("-password -role");

        return res.status(200).json({
            status: "success",
            message: "Imagen subida correctamente",
            user: updatedUser,
            file: req.file
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al subir la imagen",
            error: error.message
        });
    }
}

const avatar = async (req, res) => {
    const file = req.params.file

    const file_path = "./uploads/avatars" + file

    fs.stat(file_path, (error, exist) => {
        if (error || !exist) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            })
        }

        return res.sendFile(path.resolve(file_path))

    })

}

module.exports = {
    register,
    login,
    profile,
    update,
    upload,
    avatar
}