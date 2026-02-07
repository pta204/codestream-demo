const express = require('express');
const app = express();

const calculateStreamSpeed = (bitrate, resolution) => {
    if (bitrate <= 0 || resolution <= 0) return 0;
    return (bitrate / resolution).toFixed(2);
};

app.get('/', (req, res) => {
    res.send('CodeStream API is Running - Optimized by CI/CD');
});

module.exports = { app, calculateStreamSpeed };