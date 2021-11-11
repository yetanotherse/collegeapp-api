const mongoose = require('mongoose');
const { Schema } = mongoose;

const collegeSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    year_founded: Number,
    city: String,
    state: String,
    country: String,
    students_count: Number,
    courses: [String],
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }]
});

module.exports = {
    collegeSchema
};
