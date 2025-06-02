const childProcess = require('child_process');
const app = require('./app');
const http = require('http');
const httpServer = http.createServer(app);

const chalk = require("chalk");

const APP_PORT = process.env.PORT;
// const APP_HOST = process.env.STEELGO_HOST || 'localhost';

httpServer.listen(APP_PORT, async () => {
	console.clear();
	console.log(
		chalk.hex('#FFCA76').inverse(`CorredoraAburtoPropiedades-WebApp`),
		`was developed and it is maintained by`,
		chalk.hex('#6969ff').inverse(`Cristian Saavedra,`),
		`👨 💻 👩`
	);
	console.log(
		`Copyright ©️`,
		String(new Date().getUTCFullYear()),
		chalk.hex('#6969ff').inverse(`Corredora Aburto Propiedades`),
		`, All rights reserved`
	);
	console.log(
		chalk.inverse.white(`CorredoraAburtoPropiedades-WebApp:`),
		`I'm started running 🚀 on port`,
		chalk.hex('#82FFF8').inverse(APP_PORT)
	);
	
	console.log(__dirname);
	
	

});
