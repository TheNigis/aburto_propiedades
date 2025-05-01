const { UserConnection } = require('../config/db/index');

const userStudent = async( userId ) => {
	await UserConnection.connect();

	const Student = UserConnection.db.models.Student;

	const student = await Student.findById({ _id: userId }, (err, user) => {
		if(err) //console.log(err);
		return user;
	}).select({ "_id": 1, "username": 1, "email":1 , "team": 1, "role": 1 }).populate("team", { "_id": 1, "name": 1 }).lean();

	return student;
}

const userTeacher = async( userId ) => {
	await UserConnection.connect();

	const Teacher = UserConnection.db.models.Teacher;

	const teacher = await Teacher.findById({ _id: userId }, (err, user) => {
		if(err) //console.log(err);
		return user;
	}).select({ "_id": 1, "username": 1, "email":1, "role": 1 }).populate("team", { "_id": 1, "name": 1 }).lean();

	return teacher;
}

const userAdmin = async( userId ) => {
	await UserConnection.connect();

	const Admin = UserConnection.db.models.Admin;

	const user = await Admin.findById({ _id: userId }, (err, user) => {
		if(err) //console.log(err);
		return user;
	}).select({ "_id": 1, "username": 1, "role": 1 }).lean();

	return user;
}

async function userPopulated(id, role){
	let myUser

	if(role == 'STUDENT') myUser = await userStudent(id);
	if(role == 'TEACHER') myUser = await userTeacher(id);
	if(role == 'ADMIN') myUser = await userAdmin(id);

	return myUser;
} 


async function user(req, res){
	if(req.user.role == 'STUDENT') res.locals.user = await userStudent(req.user.userId);
	if(req.user.role == 'TEACHER') res.locals.user = await userTeacher(req.user.userId);
	if(req.user.role == 'ADMIN') res.locals.user = await userAdmin(req.user.userId);
} 

module.exports = { user, userPopulated }