const path = require('path');

module.exports = {
	name: path.basename(__filename).split('.')[0],
	once: false,
	execute(client){
		return console.error;
	}
}
