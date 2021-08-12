class User{
	static instance;

	constructor() {
		if(User.instance){
			return User.instance;
		}
		this.data = new Map();
		this.presenceUpdated = false;
		User.instance = this;
	}

	setPresenceUpdated(arg){
		this.presenceUpdated = arg;
	}
	// getData(user_id){
	// 	return this.data.get(user_id);
	// }
	//
	// setData(user_id, activities){
	// 	this.data.set(user_id, activities);
	// }
}

module.exports = User;
