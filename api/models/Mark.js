const mongoose = global.mongoose;
const markSchema = new mongoose.Schema({
	nombre: String,
	created_date: Date
});

const Mark = mongoose.model("marks", markSchema);

module.exports = Mark;
