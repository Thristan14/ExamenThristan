const db = require('../config/db.config.js');
const Juego = db.Juego;

// Create a new game entry
exports.create = (req, res) => {
    let juego = {};

    try {
        juego.nombre_juego = req.body.nombre_juego;
        juego.genero = req.body.genero;
        juego.plataforma = req.body.plataforma;
        juego.fecha_lanzamiento = req.body.fecha_lanzamiento;
        juego.precio_alquiler = req.body.precio_alquiler;
        juego.fecha_devolucion = req.body.fecha_devolucion; 
        juego.nombre_cliente = req.body.nombre_cliente; 
        juego.comentario = req.body.comentario;

        Juego.create(juego).then(result => {
            res.status(200).json({
                message: "Upload Successfully a Juego with id = " + result.id_juego,
                juego: result,
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

// Retrieve all games
exports.retrieveAllJuegos = (req, res) => {
    Juego.findAll()
        .then(juegos => {
            res.status(200).json({
                message: "Get all Juegos' Infos Successfully!",
                juegos: juegos
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error!",
                error: error
            });
        });
}

// Get a game by id
exports.getJuegoById = (req, res) => {
    let juegoId = req.params.id;
    Juego.findByPk(juegoId)
        .then(juego => {
            res.status(200).json({
                message: "Successfully Get a Juego with id = " + juegoId,
                juego: juego
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error!",
                error: error
            });
        });
}

// Filter games by genre
exports.filteringByGenre = (req, res) => {
    let genre = req.query.genero;

    Juego.findAll({
        attributes: ['id_juego', 'nombre_juego', 'genero', 'plataforma', 'fecha_lanzamiento', 'precio_alquiler', 'comentario'],
        where: { genero: genre }
    })
    .then(results => {
        res.status(200).json({
            message: "Get all Juegos with genre = " + genre,
            juegos: results,
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Error!",
            error: error
        });
    });
}

// Pagination for games
exports.pagination = (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        const offset = page ? page * limit : 0;

        Juego.findAndCountAll({ limit: limit, offset: offset })
            .then(data => {
                const totalPages = Math.ceil(data.count / limit);
                const response = {
                    message: "Pagination completed! Query parameters: page = " + page + ", limit = " + limit,
                    data: {
                        totalItems: data.count,
                        totalPages: totalPages,
                        limit: limit,
                        currentPageNumber: page + 1,
                        currentPageSize: data.rows.length,
                        juegos: data.rows
                    }
                };
                res.send(response);
            });  
    } catch (error) {
        res.status(500).send({
            message: "Error -> Cannot complete paging request!",
            error: error.message,
        });
    }    
}

// Update a game by id
exports.updateById = async (req, res) => {
    try {
        let juegoId = req.params.id;
        let juego = await Juego.findByPk(juegoId);

        if (!juego) {
            res.status(404).json({
                message: "Not Found for updating a Juego with id = " + juegoId,
                error: "404"
            });
        } else {
            let updatedObject = {
                nombre_juego: req.body.nombre_juego,
                genero: req.body.genero,
                plataforma: req.body.plataforma,
                fecha_lanzamiento: req.body.fecha_lanzamiento,
                precio_alquiler: req.body.precio_alquiler,
                fecha_devolucion: req.body.fecha_devolucion, // Adjusted to match model field name
                nombre_cliente: req.body.nombre_cliente, // Adjusted to match model field name
                comentario: req.body.comentario
            };
            let result = await Juego.update(updatedObject, { returning: true, where: { id_juego: juegoId } });

            if (!result) {
                res.status(500).json({
                    message: "Error -> Cannot update a Juego with id = " + req.params.id,
                    error: "Cannot be updated",
                });
            }

            res.status(200).json({
                message: "Update successfully a Juego with id = " + juegoId,
                juego: updatedObject,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Cannot update a Juego with id = " + req.params.id,
            error: error.message
        });
    }
}

// Delete a game by id
exports.deleteById = async (req, res) => {
    try {
        let juegoId = req.params.id;
        let juego = await Juego.findByPk(juegoId);

        if (!juego) {
            res.status(404).json({
                message: "Does Not exist a Juego with id = " + juegoId,
                error: "404",
            });
        } else {
            await juego.destroy();
            res.status(200).json({
                message: "Delete Successfully a Juego with id = " + juegoId,
                juego: juego,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Cannot delete a Juego with id = " + req.params.id,
            error: error.message,
        });
    }
}
