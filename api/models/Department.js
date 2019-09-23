const mongoose = global.mongoose;
const departmentSchema = new mongoose.Schema({
	created_date: Date,
	nombre: String,
});

const Department = mongoose.model("department", departmentSchema);

module.exports = Department;
