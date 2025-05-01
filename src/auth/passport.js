const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { UserConnection } = require("../config/db/index");

passport.use( "local-login-student", new LocalStrategy(
		{ usernameField: "email" },
		async (email, password, done) => {
			await UserConnection.connect();
			const Student = UserConnection.db.models.Student;
			const Users = UserConnection.db.models.Users;

			if (email) {
				email = email.toLocaleLowerCase();
				email = email.replace(/ /g, "");
			}

			const student = await Student.findOne({
				$or: [
					{ "email": email }, { "username": email }
				],
			});

			if (!student) {
				return done(null, false, {
					message: "No hay ningun usuario asociado a este email",
				});
			}

			const user = await Users.findOne(
				{ userId: student._id },
				(err, user) => {
					if (err) //console.log(err);
					return user;
				}
			);

			bcrypt
				.compare(password, student.password)
				.then((match) => {
					if (match) {
						//console.log("Login Correcto!");
						return done(null, user, { message: "Login Correcto!" });
					}
					return done(null, false, {
						message: "El email o contraseña son incorrectos",
					});
				})
				.catch((err) => {
					return done(null, false, { message: "Algo ha sucedido" });
				});
		}
	)
);

passport.use( "local-login-teacher", new LocalStrategy(
		{ usernameField: "email" },
		async (email, password, done) => {
			await UserConnection.connect();
			const Teacher = UserConnection.db.models.Teacher;
			const Users = UserConnection.db.models.Users;

			if (email) {
				email = email.toLocaleLowerCase();
				email = email.replace(/ /g, "");
			}

			const teacher = await Teacher.findOne({ email: email });

			if (!teacher) {
				return done(null, false, {
					message: "No hay ningun usuario asociado a este email",
				});
			}

			const user = await Users.findOne(
				{ userId: teacher._id },
				(err, user) => {
					if (err) //console.log(err);
					return user;
				}
			);

			bcrypt.compare(password, teacher.password).then(match => {
			    //console.log(match);
			    if(match){
			        return done(null, user, { message: "Login Correcto!" });
			    }
			    return done(null, false, { message: 'El email o contraseña son incorrectos' });
			}).catch(err => {
			    return done(null, false, { message: 'Algo ha sucedido' });
			});
		}
	)
);

passport.use("local-login-admin", new LocalStrategy(
		{ usernameField: "username", passwordField: "password" },
		async (username, password, done) => {
			await UserConnection.connect();
			const Admin = UserConnection.db.models.Admin;
			const Users = UserConnection.db.models.Users;

			const admin = await Admin.findOne({ username: username });

			//console.log(admin);

			if (!admin) {
				return done(null, false, {
					message: "No hay ningun usuario asociado a este email",
				});
			}

			const user = await Users.findOne(
				{ userId: admin._id },
				(err, user) => {
					if (err) //console.log(err);
					return user;
				}
			);

			bcrypt
				.compare(password, admin.password)
				.then((match) => {
					if (match) {
						return done(null, user, { message: "Login Correcto!" });
					}
					return done(null, false, {
						message: "El email o contraseña son incorrectos",
					});
				})
				.catch((err) => {
					return done(null, false, { message: "Algo ha sucedido" });
				});
		}
	)
);

passport.use( "local-login-general", new LocalStrategy( { usernameField: "email" },
	async (email, password, done) => {
		await UserConnection.connect();
		const Users = UserConnection.db.models.Users;

		const user = await Users.findOne(
			{ userId: id },
			(err, user) => {
				if (err) //console.log(err);
				return user;
			}
		);

		return done(null, user, { message: "Correct" });
	}
)
);

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
	await UserConnection.connect();
	const Users = UserConnection.db.models.Users;

	const user = await Users.findById({ _id: id }, (err, user) => {
		if (err) //console.log(err);
		return user;
	});

	done(null, user);
});