const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Asegúrate de ajustar la ruta al archivo del modelo

// Asegúrate de usar tu URI de conexión correcta
mongoose.connect('mongodb://localhost:27017/mi_redsocial', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión a la base de datos establecida con éxito.');
}).catch(err => {
    console.error('Error al conectar a la base de datos:', err);
});

const users = [
    { name: 'Alice', surname: 'Smith', bio: 'Desarrolladora de software.', nick: 'aliceDev', email: 'alice@example.com', password: 'pass1234' },
    { name: 'Bob', surname: 'Brown', bio: 'Experto en redes.', nick: 'bobbNet', email: 'bob@example.com', password: 'pass5678' },
    { name: 'Carol', surname: 'Johnson', bio: 'Analista de datos.', nick: 'carolData', email: 'carol@example.com', password: 'pass91011' },
    { name: 'Dave', surname: 'Wilson', bio: 'Gerente de proyecto.', nick: 'davePM', email: 'dave@example.com', password: 'pass1213' },
    { name: 'Eve', surname: 'Davis', bio: 'Experta en seguridad informática.', nick: 'eveSec', email: 'eve@example.com', password: 'pass1415' }
];

const ejecutar = async () => {
    try {
        for (let user of users) {
            user.password = await bcrypt.hash(user.password, 12); // Encriptación de la contraseña
        }
        await User.insertMany(users);
        console.log('Usuarios insertados correctamente');
    } catch (err) {
        console.error('Error al insertar usuarios:', err);
    } finally {
        mongoose.connection.close(); // Cierra la conexión en todos los casos
    }
};

ejecutar();
