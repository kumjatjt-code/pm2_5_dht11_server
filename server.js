const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let sensorHistory = [];

app.post('/api/pm25', (req, res) => {
    const pm25_ug = parseFloat(req.body.pm25_ug);
    const pm25_percent = parseFloat(req.body.pm25_percent);
    const temp = parseFloat(req.body.temp);
    const hum = parseFloat(req.body.hum);

    const newData = {
        time: new Date().toLocaleTimeString('th-TH'),
        pm25_ug: isNaN(pm25_ug) ? 0 : pm25_ug,
        pm25_percent: isNaN(pm25_percent) ? 0 : pm25_percent,
        temp: isNaN(temp) ? 0 : temp,
        hum: isNaN(hum) ? 0 : hum
    };

    sensorHistory.push(newData);
    if (sensorHistory.length > 50) sensorHistory.shift();

    console.log(`[${newData.time}] PM2.5: ${newData.pm25_ug} ug/m³ | Temp: ${newData.temp}°C | Hum: ${newData.hum}%`);
    res.status(200).send('Success');
});

app.get('/api/pm25/history', (req, res) => {
    res.json(sensorHistory);
});

app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Server started on port ${PORT}`);
    console.log(`Dashboard: http://localhost:${PORT}`);
    console.log(`=================================`);
});