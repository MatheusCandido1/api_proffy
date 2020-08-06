import express from 'express';

const app = express();

app.get('/users', (request, response) => {
    const users = [
        { name: 'Matheus', age: 22 },
        { name: 'Vini', age: 22},
    ];

    return response.json(users);   
})

app.listen(3333);

