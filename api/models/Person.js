const mongoose = global.mongoose;
const personSchema = new mongoose.Schema({
	created_date: Date,
	apellido: String,
	nombre: String,
	cedula: Number,
});

const Person = mongoose.model("personas", personSchema);

module.exports = Person;
