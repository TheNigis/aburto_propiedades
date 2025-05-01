const bcrypt = require('bcrypt');
const passport = require('passport');

const { UserConnection } = require('../config/db/index');

const divisionTerritorial = require('../../public/divisionTerritorialChile.json');

// const { user } = require("../middlewares/user-populated");

class AuthController{

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

module.exports = AuthController;