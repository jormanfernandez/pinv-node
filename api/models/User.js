const mongoose = global.mongoose;
const userSchema = new mongoose.Schema({
	person: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "personas"
	},
	created_date: Date,
	password: String,
	access: Object,
	nick: String,
});

userSchema.methods.logIn = function (session, callback) {

	const Session = require("./Sessions");
	return Session.updateOne({
		id: session
	}, {
		user: this._id,
		last_access: new Date()
	}, {
		upsert: true
	}, callback);
}

userSchema.methods.logOut = function (session, callback) {

	const Session = require("./Sessions");
	return Session.updateOne({
		id: session
	}, {
		user: null,
		last_access: new Date()
	}, {
		upsert: true
	}, callback);
}

const User = mongoose.model("users", userSchema);

module.exports = User;
