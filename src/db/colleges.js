const mongoose = require('mongoose');
const { collegeSchema } = require('./schema/college');

const College = mongoose.model('College', collegeSchema);

async function getColleges() {
    try {
        return await College.find({}).sort({ "name": 1 }).exec();
    } catch(error) {
        throw new Error(error);
    }
}

async function getCollegesByName(params) {
    try {
        const regex = new RegExp(params.query, 'i');
        return await College.find({ name: { $regex: regex }}).exec();
    } catch(error) {
        throw new Error(error);
    }
}

async function getCollegesByState(params) {
    try {
        if (params) {
            return await College.find({ "state": params.state }).sort({ "name": 1 }).exec();
        }
        return "Invalid request!";
    } catch(error) {
        throw new Error(error);
    }
}

async function getCollegesByCourse(params) {
    try {
        if (params) {
            return await College.find({ "courses": { $in: params.course } }).sort({ "name": 1 }).exec();
        }
        return "Invalid request!";
    } catch(error) {
        throw new Error(error);
    }
}

// implemented to use both id and name (search) but using only id as name doesn't have a valid use case
async function getCollege(params) {
    try {
        if (params) {
            let result = {};
            if (mongoose.isValidObjectId(params.id)) {
                const college = await College.findById(params.id).populate('students').exec();
                const related = await College.find({
                    'state': college.state,
                    'courses': { $in: college.courses },
                    '_id' : { $ne: college._id }
                });
                result.college = college;
                result.related = related;
                return result;
            } else {
                const regex = new RegExp(params.id, 'i');
                const college = await College.find({ name: { $regex: regex }}).populate('students').exec();
                const related = await College.find({
                    'state': college.state,
                    'courses': { $in: college.courses },
                    '_id' : { $ne: college._id }
                });
                result.college = college;
                result.related = related;
                return result;
            }
        }
        return 'Invalid request!';
    } catch(error) {
        throw new Error(error);
    }
}

async function fetchDashboardStats() {
    try {
        let data = {};
        // stats by state
        await College.aggregate([
            {
                "$group": { _id: "$state", count: { $sum: 1 } }
            }
        ], function(error, byState) {
            data.byState = byState;
        });
        // stats by courses
        await College.aggregate([
            {
                // need to unwind first since it's a array
                $unwind: "$courses"
            },
            {
                "$group": {
                    _id: "$courses",
                    count: { $sum: 1 }
                }
            }
        ], function(error, byCourse) {
            data.byCourse = byCourse;
        });
        return data;
    } catch(error) {
        throw new Error(error);
    }

}

module.exports = {
    getColleges,
    getCollegesByName,
    getCollege,
    getCollegesByCourse,
    getCollegesByState,
    fetchDashboardStats
};
