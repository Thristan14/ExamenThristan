module.exports = (sequelize, Sequelize) => {
	const Juego = sequelize.define('juego', {	
	  id_juego: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
	  },
	  nombre_juego: {
			type: Sequelize.STRING
	  },
	  genero: {
			type: Sequelize.STRING
  	},
	  plataforma: {
			type: Sequelize.STRING
	  },
	  fecha_lanzamiento: {
			type: Sequelize.STRING
    },
    precio_alquiler: {
      type: Sequelize.STRING
    },
    fecha_devolución: {
      type: Sequelize.INTEGER

    },
    nombre_Cliente: {   
        type: Sequelize.INTEGER
  
    },
      comentario: {
        type: Sequelize.STRING
      }
    

	});
	
	return Juego;
}
