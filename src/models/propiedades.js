const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

module.exports = function(db){
    const propidadesSchema = new Schema({
        "nombre": { type: String, require: true },
        "descripcion": { type: String, require: true },

        "tipo":  { type: String, require: true },
        
        "detalles":{
            "baños": { type: String },
            "habitaciones": { type: String },
            "tipo_acuerdo": { type: String, require: true },
            "estado": { type: String }
        },

        "contacto": { type: String, require: true },

        "fotos": [],

        "tipo_moneda": { type: String, require: true },
        "price": { type: String, require: true },
        
        "publicado": { type: String, require: true },
        "venta": { type: String },

        "lugar": { type: String, require: true },

        "comuna":{ type: String, require: true },
        "provincia":{ type: String, require: true },
        "region":{ type: String, require: true },
        "region_numero":{ type: String, require: true },


    }, { timestamps: true }); 

    db.model('Propiedades', propidadesSchema, 'propiedades');

}