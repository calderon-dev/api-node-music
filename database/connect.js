const mongoose = require("mongoose")
require("dotenv").config();


const connection = async () => {
 
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Conectado correctamente a la DB");
    } catch (error) {
        console.error(error);
    throw new Error("No se ha podido conectar con la Base de datos");
    }
}

module.exports=connection