const mongoose = global.mongoose;
const sessionSchema = new mongoose.Schema({
	id: {
		type: String, 
		default: '', 
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "users"
	},
	last_access: Date,
	browser: String,
	ip: String,
});

const Session = mongoose.model("sessions", sessionSchema);

module.exports = Session;
