const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let db = null;
let dbConnectionUri = process.env.MONGODB_URI;

const { studentSchema } = require('./schema/student');
const Student = mongoose.model('Student', studentSchema);
const { collegeSchema } = require('./schema/college');
const College = mongoose.model('College', collegeSchema);

async function connect() {
    try {
        await mongoose.connect(dbConnectionUri);
    } catch(error) {
        throw new Error(error);
    }
}

module.exports = {
    connect
};
