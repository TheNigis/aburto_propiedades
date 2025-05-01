const { user } = require("../middlewares/user-populated");

const { UserConnection, PropiedadesConnection } = require('../config/db/index');
const { restart } = require("nodemon");

class IndexControllers {

	/**
	 *
	 * Allows to check if an user that request a verification view still logged
	 * Must be access it by a purchaser, a maker or admin user only
	 *
	 * @param {*} req
	 * @param {*} res
	 */

	static async index(req, res) {
		await UserConnection.connect();
        const Users = UserConnection.db.models.Users;
		const Admin = UserConnection.db.models.Admin;

		await PropiedadesConnection.connect();
		const Propiedades = PropiedadesConnection.db.models.Propiedades;

		let numeros = [];
		let aleatorios = [];

		let propiedades = await Propiedades.find({ }).lean();
		
		if(propiedades.length > 3){
			
			function generarListaAleatoria(max) {
				const numeros = [];
				while (numeros.length < 3) {
					const num = Math.floor(Math.random() * max);  // Números entre 1 y 100
					if (!numeros.includes(num)) {
						numeros.push(num);
					}
				}
				return numeros;
			}

			numeros = generarListaAleatoria(propiedades.length);

			if(propiedades.length > 3){
				numeros.forEach(numero => {
					aleatorios.push(propiedades[numero]);
				});
			}	
		}

        res.render("index", { "aleatorios": aleatorios, "propiedades": propiedades})	;

	}

	static async propiedad(req, res) {
		await UserConnection.connect();
        const Users = UserConnection.db.models.Users;
		const Admin = UserConnection.db.models.Admin;

		await PropiedadesConnection.connect();
		const Propiedades = PropiedadesConnection.db.models.Propiedades;

		let numeros = [];
		let aleatorios = [];

		let propiedades = await Propiedades.find({ }).lean();

		console.log(req.params.id, typeof req.params.id);
        if(!req.params.id  || req.params.id == undefined || req.params.id == "undefined"){
            return res.json({ "msg": "fallido" })
        }

		function generarListaAleatoria(max) {
			const numeros = [];
			while (numeros.length < 3) {
				const num = Math.floor(Math.random() * max);  // Números entre 1 y 100
				if (!numeros.includes(num)) {
					numeros.push(num);
				}
			}
			return numeros;
		}

		numeros = generarListaAleatoria(propiedades.length);

		if(propiedades.length > 3){
			numeros.forEach(numero => {
				aleatorios.push(propiedades[numero]);
			});
		}		

		let propiedad = await Propiedades.findById({ _id: req.params.id }, (err, propiedad) => {
			if (err) throw new Error(err);
			return propiedad;
		}).lean();


        res.render("propiedad", { "aleatorios": aleatorios, "propiedad": propiedad})	;

	}

	/**
	 *
	 * Allows to check if an user that request a verification view still logged
	 * Must be access it by a purchaser, a maker or admin user only
	 *
	 * @param {*} req
	 * @param {*} res
	 */

	static async landingTeam(req, res) {
		if (req.user) await user(req, res);
		res.render("./landing/team");
	}

	/**
	 *
	 * Allows to check if an user that request a verification view still logged
	 * Must be access it by a purchaser, a maker or admin user only
	 *
	 * @param {*} req
	 * @param {*} res
	 */

	static async landingUser(req, res) {
		if (req.user) await user(req, res);
		res.render("./landing/student");
	}

	/**
	 *
	 * Allows to check if an user that request a verification view still logged
	 * Must be access it by a purchaser, a maker or admin user only
	 *
	 * @param {*} req
	 * @param {*} res
	 */
	
	/* Ver perfil Maestranza Como Externo */
	static async viewStudentProfile(req, res) {
		try {
			await UserConnection.connect();
			const User = UserConnection.db.models.User;
            const Teacher = UserConnection.db.models.Teacher;
			const Student = UserConnection.db.models.Student;

            let generalUser = await User.findById({ _id: req.params.UserId }, (err, user) => {
                if(err) throw new Error(err);
                if(!user) res.render('404');
                return user;
            }).select({ '_id': 1, "role": 1, "userId": 1 }).lean();

			if (req.user) await user(req, res);

            let principalUser;

            if(generalUser.role == 'STUDENT'){
                principalUser = await Student.findById({ _id: generalUser.userId },(err, user) => {
                        if (err) throw new Error(err);
                        if (!user) res.render("404");
                        return user;
                    }
                ).lean();
            } else if(generalUser.role == "Teacher"){
                principalUser = await Teacher.findById({ _id: generalUser.userId },(err, user) => {
                        if (err) throw new Error(err);
                        if (!user) res.render("404");
                        return user;
                    }
                ).lean();

            } else {
                return res.render("404"); 
            }

            
			res.render("./external-profiles/user", {
				user: principalUser
			});
		} catch (error) {
			res.render("404");
		}
	}
	
	/**
	 *
	 * Allows to check if an user that request a verification view still logged
	 * Must be access it by a purchaser, a maker or admin user only
	 *
	 * @param {*} req
	 * @param {*} res
	 */
	
	/* Ver perfil Maestranza Como Externo */
	static async viewTeamProfile(req, res) {
		try {
			await UserConnection.connect();
			const Team = UserConnection.db.models.Team;

			if (req.user) await user(req, res);

			let team = await Team.findById({ _id: req.params.TeamId },(err, team) => {
					if (err) throw new Error(err);
					if (!team) res.render("404");
					return team;
				}
			).lean();

			res.render("./external-profiles/team", {
				team:team
			});
		} catch (error) {
			res.render("404");
		}
	}

	/**
	 *
	 * Allows to check if an user that request a verification view still logged
	 * Must be access it by a purchaser, a maker or admin user only
	 *
	 * @param {*} req
	 * @param {*} res
	 */
	static logout(req, res) {
		req.logout(req.user, err => {
			if(err) return next(err);
			res.redirect("/");
		});
	}
}

module.exports = IndexControllers;