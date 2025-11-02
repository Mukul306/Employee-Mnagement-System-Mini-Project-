const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/employeesys', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ✅ Define Schema
const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    position: String,
    ctc: Number,
});

// ✅ Create Model
const Employee = mongoose.model('Employee', employeeSchema);

// ✅ Routes

// Create
app.post('/create', async (req, res) => {
    try {
        const { name, email, age, position, ctc } = req.body;
        const newEmployee = new Employee({ name, email, age, position, ctc });
        await newEmployee.save();
        console.log('✅ Employee added successfully');
        res.send('Employee created successfully');
    } catch (err) {
        console.error('❌ Error adding employee:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Read
app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        console.error('❌ Error fetching employees:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Update
app.put('/update', async (req, res) => {
    try {
        const { id, ctc } = req.body;
        const result = await Employee.findByIdAndUpdate(id, { ctc }, { new: true });
        res.json(result);
    } catch (err) {
        console.error('❌ Error updating employee:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Delete
app.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Employee.findByIdAndDelete(id);
        res.json(result);
    } catch (err) {
        console.error('❌ Error deleting employee:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3001, () => {
    console.log('🚀 Server is running on port 3001');
});
