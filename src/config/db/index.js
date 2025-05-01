const mongoose = require('mongoose');
const chalk = require("chalk");
const { USERS_URI, PROPIEDADES_URI } = require('./config');

const optionsMongoose = {
    useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true   
}

mongoose.set('useFindAndModify', false);

class UserConnection{
    static async connect(){
        if(this.db) return this.db;

        let connection;

        try {
            connection = await mongoose.createConnection(this.url, this.options);
            
            //Require models
            require('../../models/user')(connection);

            this.db = connection;

            return this.db;
        } catch (error) {
            //console.log(error);
        }
    }
}

UserConnection.db = null;
UserConnection.url = USERS_URI;
UserConnection.options = optionsMongoose;

class PropiedadesConnection{
    static async connect(){
        if(this.db) return this.db;

        let connection;

        try {
            connection = await mongoose.createConnection(this.url, this.options);

            //Require models
            require('../../models/propiedades')(connection);

            this.db = connection;
            
            return this.db;
        } catch (error) {
            //console.log(error);
        }
    }
}

PropiedadesConnection.db = null;
PropiedadesConnection.url = PROPIEDADES_URI;
PropiedadesConnection.options = optionsMongoose;

module.exports = { UserConnection, PropiedadesConnection }