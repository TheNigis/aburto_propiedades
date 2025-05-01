const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

module.exports = function(db){

    const adminSchema = new Schema({
        username: { type: String, required:true },
        password: { type: String, required:true },
    }, { timestamps: true }); 

    db.model('Admin', adminSchema, 'admin');

    const usersSchema = new Schema({
        role: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, required: true },
    }, { timestamps: true });

    db.model('Users', usersSchema, 'users');
}