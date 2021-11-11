const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const { connect, fix } = require('./db/mongo');
const { getCollege, getCollegesByName, getColleges, getCollegesByState, getCollegesByCourse, fetchDashboardStats } = require('./db/colleges');
const { getStudent, getStudents } = require('./db/students');

const app = express();

dotenv.config();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

// basic error handling
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// connect to db
connect();

app.get('/', async (req, res) => {
    res.send(await getColleges());
});

app.get('/colleges/search/:query', async(req, res) => {
    res.send(await getCollegesByName(req.params));
});

app.get('/colleges/course/:course', async (req, res) => {
    res.send(await getCollegesByCourse(req.params));
});

app.get('/colleges/state/:state', async (req, res) => {
    res.send(await getCollegesByState(req.params));
});

app.get('/college/:id', async (req, res) => {
    res.send(await getCollege(req.params));
});

app.get('/students', async (req, res) => {
    res.send(await getStudents());
});

app.get('/student/:id', async (req, res) => {
    res.send(await getStudent(req.params));
});

app.get('/stats', async (req, res) => {
    res.send(await fetchDashboardStats());
});

app.listen(process.env.PORT || 30001, async () => {
    console.log('listening on port 3001');
});
