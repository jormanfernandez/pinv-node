const mongoose = global.mongoose;
const userSchema = new mongoose.Schema({
	nick: String,
	password: String,
	person: {type: mongoose.Schema.Types.ObjectId, ref: "personas"},
	created_date: Date,
	access: Object
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

const User = mongoose.model("users", userSchema);

module.exports = User;
