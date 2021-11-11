const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    email: String,
    batch: Number,
    skills: [String],
    college: { type: Schema.Types.ObjectId, ref: 'College' }
});

module.exports = {
    studentSchema
};
