const mongoose = global.mongoose;
const userSchema = new mongoose.Schema({
	nick: String,
	password: String,
	person: {type: mongoose.Schema.Types.ObjectId, ref: "personas"},
	created_date: Date,
	access: Object
});

const User = mongoose.model("users", userSchema);

module.exports = User;
