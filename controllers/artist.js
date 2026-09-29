const Artist = require("../models/artistModel.js")



const save = async (req, res) => {

    try {
        let params = req.body

        if (!params) {
            return res.status(400).json({
                status: "error",
                message: "El campo 'name' es obligatorio"
            });
        }

        let artist = new Artist(params)

        const artistStored = await artist.save()

        if (!artistStored) {
            return res.status(400).json({
                status: "error",
                message: "Error , no se a guardado el artista",
                error: error.message
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Mensaje de Save",
            artistStored
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al guardar el artista",
            error: error.message
        });
    }

}

const getOne = async (req, res) => {
    try {
        const artistId = req.params.id;

        const artist = await Artist.findById(artistId);

        if (!artist) {
            return res.status(404).json({
                status: "error",
                message: "Artista no encontrado"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Artista encontrado",
            artist
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener el artista",
            error: error.message
        });
    }
};

const list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Usar paginate directamente
        const result = await Artist.paginate({}, {
            page,
            limit,
            sort: { created_at: -1 },
            lean: true // devuelve objetos planos, más rápido
        });

        return res.status(200).json({
            status: "success",
            message: "Listado de artistas",
            page: result.page,
            limit: result.limit,
            totalDocs: result.totalDocs,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            artists: result.docs
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al listar artistas",
            error: error.message
        });
    }
};


module.exports = {
    save, list
}