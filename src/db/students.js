const mongoose = require('mongoose');
const { studentSchema } = require('./schema/student');

const Student = mongoose.model('Student', studentSchema);

async function getStudents() {
    return await Student.find({}).exec();
}

async function getStudent(params) {
    if (params) {
        const regex = new RegExp(params.id, 'i')
        return mongoose.isValidObjectId(params.id) ?
            await Student.findById(params.id).populate('college').exec() :
            await Student.find({ name: { $regex: regex }}).populate('college').exec();
    }
    return 'Invalid request!';
}

module.exports = {
    getStudents,
    getStudent
};
