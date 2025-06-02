const bcrypt = require('bcrypt');
const passport = require('passport');
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const { UserConnection, PropiedadesConnection } = require('../config/db/index');

const divisionTerritorial = require('../../public/divisionTerritorialChile.json');
const propiedades = require('../models/propiedades');

// const { user } = require("../middlewares/user-populated");

class AdminController{

    static async panelAdmin(req, res) {
		await UserConnection.connect();
        const Users = UserConnection.db.models.Users;
		const Admin = UserConnection.db.models.Admin;

		await PropiedadesConnection.connect();
		const Propiedades = PropiedadesConnection.db.models.Propiedades;

		let propiedades = await Propiedades.find({ }).lean();

        res.render("view-admin", {"propiedades": propiedades })	;

	}

    static async editarPropiedad(req, res) {
		await UserConnection.connect();
        const Users = UserConnection.db.models.Users;
		const Admin = UserConnection.db.models.Admin;

		await PropiedadesConnection.connect();
		const Propiedades = PropiedadesConnection.db.models.Propiedades;
        
        console.log(req.params.id, typeof req.params.id);
        if(!req.params.id  || req.params.id == undefined || req.params.id == "undefined"){
            return res.json({ "msg": "fallido" })
        }

		let propiedad = await Propiedades.findById({ _id: req.params.id }, (err, propiedad) => {
			if (err) throw new Error(err);
			return propiedad;
		}).lean();


        res.render("editarPropiedad", { "propiedad": propiedad, "divisionTerritorial": divisionTerritorial })	;
	}

    static async confirmarEdicionPropiedad(req, res){
        await UserConnection.connect();
        const Users = UserConnection.db.models.Users;
        const Admin = UserConnection.db.models.Admin;

        await PropiedadesConnection.connect();
        const Propiedades = PropiedadesConnection.db.models.Propiedades;        

        const data = req.body;
        let region;

        for(let i = 0; i < divisionTerritorial.regiones.length; i++){            
            if(i == data.region-1 ){
                region = divisionTerritorial.regiones[i].region.nombre                
            }
        }
        await Propiedades.findOneAndUpdate(
            { _id: data._id },
            {
                $set: {
                    "nombre": data.nombre,
                
                    "descripcion": data.descripcion,
                    "tipo": data.tipo,

                    "detalles":{
                        "baños": data.detalles.baños, 
                        "habitaciones": data.detalles.habitaciones,
                        "tipo_acuerdo": data.detalles.tipo_acuerdo,
                        "estado": data.detalles.estado, 
                    },

                    "contacto" : data.contacto,    
                    "tipo_moneda" :  data.tipo_moneda,
                    "price" : data.price,
                    "lugar" : data.lugar,
                    "comuna" : data.comuna,
                    "provincia" : data.provincia,
                    "region" : region,                    
                    "region_numero" : data.region,
                },
            }
        );

        res.json({
            msg:"Propiedad actualizada"
        });

    }


    static async eliminarPropiedad(req, res){
        await UserConnection.connect();
        const Users = UserConnection.db.models.Users;
        const Admin = UserConnection.db.models.Admin;

        await PropiedadesConnection.connect();
        const Propiedades = PropiedadesConnection.db.models.Propiedades;        

        const data = req.body;
        
        let propiedad = await Propiedades.findById({ _id: data._id }, (err, propiedad) => {
			if (err) throw new Error(err);
			return propiedad;
		}).lean();

        console.log(propiedades.fotos);

        await Propiedades.findOneAndDelete(
            { _id: data._id }
        );

        for(let i = 0; i < propiedad.fotos.length; i++) {  // bucle "for in" para recorrer objetos
            console.log("hola xd: " + propiedad.fotos[i]);
            
            fs.unlink(propiedad.fotos[i], (err) => {  // data[key] devuelve el valor del campo
                if(err) throw err;
                console.log('File deleted: ' + propiedad.fotos[i]);
            });
        }

        res.json({
            msg:"Propiedad eliminada"
        });

    }

    static async crearPropiedades(req, res){
        await UserConnection.connect();
        const Users = UserConnection.db.models.Users;
        const Admin = UserConnection.db.models.Admin;

        await PropiedadesConnection.connect();
        const Activities = PropiedadesConnection.db.models.Propiedades;

        // const userLinked = await Users.findById(
        //     { _id: req.session.passport.user },
        //     (err, user) => {
        //         if (err) throw new Error(err);
        //         if (!user) throw new Error("User not found");
        //         return user;
        //     }
        // ).lean();

        // let user = await Admin.findById({ _id: userLinked.userId }, (err, user) => {
        //     if(err) throw new Error(err);
        //     return user;
        // }).lean();
        
        // if(!user) res.redirect('/');

        

        res.render("crearPropiedades", { divisionTerritorial: divisionTerritorial})
        
    }

    static returnFiles(req, res){
		return res.sendStatus(200, {'Content-Type': 'text/plain'});
	}

    static async envioPropiedades(req, res){
        await UserConnection.connect();
        const Users = UserConnection.db.models.Users;
        const Admin = UserConnection.db.models.Admin;

        await PropiedadesConnection.connect();
        const Propiedades = PropiedadesConnection.db.models.Propiedades;        

        const data = req.body;

        const nuevaPropiedad = new Propiedades();

        let region;

        for(let i = 0; i < divisionTerritorial.regiones.length; i++){            
            if(i == data.region-1 ){
                region = divisionTerritorial.regiones[i].region.nombre
                console.log(divisionTerritorial.regiones[i].region.nombre);
                
            }
        }

        nuevaPropiedad.nombre = data.nombre;
        nuevaPropiedad.descripcion = data.descripcion;
        nuevaPropiedad.tipo = data.tipo;
        nuevaPropiedad.detalles.baños = data.detalles.baños; 
        nuevaPropiedad.detalles.habitaciones = data.detalles.habitaciones; 
        nuevaPropiedad.detalles.tipo_acuerdo = data.detalles.tipo_acuerdo; 
        nuevaPropiedad.detalles.estado = data.detalles.estado; 
        nuevaPropiedad.contacto = data.contacto;    
        nuevaPropiedad.tipo_moneda =  data.tipo_moneda;
        nuevaPropiedad.price = data.price;
        nuevaPropiedad.lugar = data.lugar;
        nuevaPropiedad.comuna = data.comuna;
        nuevaPropiedad.provincia = data.provincia;
        nuevaPropiedad.region = region;
        nuevaPropiedad.region_numero = data.region;
        
        let fotos = [];

        for(let i = 0; i< data.fotos.length; i++ ){
            const fileId = uuidv4();
            const dir = `${__dirname}/public/propiedades/${nuevaPropiedad._id}/`;        
            const dirFile = `${__dirname}/public/propiedades/${nuevaPropiedad._id}/${fileId}.${data.fotos[i].ext}`;  

            let base64File = data.fotos[i].file.split(';base64,').pop();

            fotos.push(dirFile);


			if (fs.existsSync(dir)) {
                fs.writeFile( dirFile, base64File, { recursive:true, encoding: "base64" }, function (e, data) {
                    if (e) return console.log(e);
                    return
                });	
			} 
            if (!fs.existsSync(dir)){
				fs.mkdirSync(dir);

				fs.writeFile( dirFile, base64File, { recursive:true, encoding: "base64" }, function (e, data) {
					if (e) return console.log(e);
					return
				});	
			}
            
        }

        nuevaPropiedad.fotos = fotos;

        await nuevaPropiedad.save();

        res.json({
            msg:"Propiedad creada"
        });

    }

    /**
     *
     * Allows to check if an user that request a verification view still logged
     * Must be access it by a purchaser, a maker or admin user only
     *
     * @param {*} req
     * @param {*} res
     */
    
    static async loginAdmin(req, res){
        const { email, password } = req.body;

        if(!email || !password){
            req.flash('error', 'Rellena todos los datos');
            //return res.redirect('/loginAdmin'); <= Falta vista de login de admin
        }

        passport.authenticate('local-login-admin', (err, user, info) => {
            if(err){
                req.flash('error', info.message);
                return res.redirect('/500');
            }

            if(!user){
                req.flash('error', info.message);
                //return res.redirect('/loginAdmin'); <= Falta vista de login de admin
            }

            req.logIn(user, () => {
                if(err){
                    req.flash('error', info.message);
                    return res.redirect('/500');
                }
                //return res.redirect('/admin/inicio'); => Falta inicio de admin
            });
        })(req, res, next);
    }

    /**
     *
     * Allows to check if an user that request a verification view still logged
     * Must be access it by a purchaser, a maker or admin user only
     *
     * @param {*} req
     * @param {*} res
     */
    
    static async postRegisterAdmin(req, res){
        try {
            await UserConnection.connect();
            const Admin = UserConnection.db.models.Admin;
            const Users = UserConnection.db.models.Users;

            const { username, password } = req.body;

            await Admin.exists({ username: username }, (err, result) =>{
                if(err){
                    req.flash("error", "Este admin ya existe");
                    req.flash("username", username);
                    return res.redirect('/registroAdmin');
                }
            }).lean();

            const hashedPassword = await bcrypt.hash(password, 10);

            const newAdmin = new Admin({ 
                username: username,
                password: hashedPassword
            });

            const newUser = new Users({
                role: 'ADMIN',
                userId: newAdmin._id
            });

            await newUser.save();

            await newAdmin.save().then((newAdmin) =>{
                return res.redirect('/');
            }).catch(error => { 
                new Error(error);
            });

        } catch (error) {
            res.redirect('/error');
        }
    }
}

module.exports = AdminController;