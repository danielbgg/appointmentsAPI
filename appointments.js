const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const doctorsFilePath = './doctors.json';
const appointmentsFilePath = './appointments.json';

let doctors = [];
let appointments = [];

fs.readFile(doctorsFilePath, (err, data) => {
    if (err) throw err;
    doctors = JSON.parse(data);
});

fs.readFile(appointmentsFilePath, (err, data) => {
    if (err) throw err;
    appointments = JSON.parse(data);
});

// doctors resources

app.get('/doctors', (req, res) => {
    res.send(doctors);
});

app.get('/doctors/:id', (req, res) => {
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    if (!doctor) return res.status(404).send('The doctor with the given ID was not found.');
    res.send(doctor);
});

app.post('/doctors', (req, res) => {
    const doctor = {
        id: doctors.length + 1,
        name: req.body.name,
        age: req.body.age,
        speciality: req.body.speciality,
        availability: req.body.availability,
        email: req.body.email,
        phone: req.body.phone
    };
    doctors.push(doctor);
    fs.writeFile(doctorsFilePath, JSON.stringify(doctors), err => {
        if (err) throw err;
    });
    res.send(doctor);
});

app.put('/doctors/:id', (req, res) => {
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    if (!doctor) return res.status(404).send('The doctor with the given ID was not found.');

    doctor.name = req.body.name;
    doctor.age = req.body.age;
    doctor.speciality = req.body.speciality;
    doctor.availability = req.body.availability;
    doctor.email = req.body.email;
    doctor.phone = req.body.phone;

    fs.writeFile(doctorsFilePath, JSON.stringify(doctors), err => {
        if (err) throw err;
    });

    res.send(doctor);
});

app.delete('/doctors/:id', (req, res) => {
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    if (!doctor) return res.status(404).send('The doctor with the given ID was not found.');

    const index = doctors.indexOf(doctor);
    doctors.splice(index, 1);

    fs.writeFile(doctorsFilePath, JSON.stringify(doctors), err => {
        if (err) throw err;
    });

    res.send(doctor);
});


// appointments resources

app.get('/appointments', (req, res) => {
    res.send(appointments);
});

app.get('/appointments/:id', (req, res) => {
    const appointment = appointments.find(a => a.id === parseInt(req.params.id));
    if (!appointment) return res.status(404).send('The appointment with the given ID was not found.');
    res.send(appointment);
});

app.post('/appointments', (req, res) => {
    const doctor = doctors.find(d => d.id === parseInt(req.body.doctorId));
    if (!doctor) return res.status(400).send('The doctor with the given ID was not found.');

    const appointment = {
        id: appointments.length + 1,
        patientName: req.body.patientName,
        doctorId: req.body.doctorId,
        appointmentTime: req.body.appointmentTime
    };
    appointments.push(appointment);
    fs.writeFile(appointmentsFilePath, JSON.stringify(appointments), err => {
        if (err) throw err;
    });
    res.send(appointment);
});

app.put('/appointments/:id', (req, res) => {
    const appointment = appointments.find(a => a.id === parseInt(req.params.id));
    if (!appointment) return res.status(404).send('The appointment with the given ID was not found.');

    const doctor = doctors.find(d => d.id === parseInt(req.body.doctorId));
    if (!doctor) return res.status(400).send('The doctor with the given ID was not found.');

    appointment.patientName = req.body.patientName;
    appointment.doctorId = req.body.doctorId;
    appointment.appointmentTime = req.body.appointmentTime;

    fs.writeFile(appointmentsFilePath, JSON.stringify(appointments), err => {
        if (err) throw err;
    });

    res.send(appointment);
});

app.delete('/appointments/:id', (req, res) => {
    const appointment = appointments.find(a => a.id === parseInt(req.params.id));
    if (!appointment) return res.status(404).send('The appointment with the given ID was not found.');

    const index = appointments.indexOf(appointment);
    appointments.splice(index, 1);

    fs.writeFile(appointmentsFilePath, JSON.stringify(appointments), err => {
        if (err) throw err;
    });

    res.send(appointment);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));