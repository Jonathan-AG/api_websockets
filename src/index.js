import express from 'express';

const app = express();

//LOG Versiones
app.get('/', (req, res) => {
    res.send("V001 - D02062022");
})

app.listen(3000);