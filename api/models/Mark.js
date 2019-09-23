const mongoose = global.mongoose;
const markSchema = new mongoose.Schema({
	created_date: Date,
	nombre: String,
});

const Mark = mongoose.model("marks", markSchema);

module.exports = Mark;
