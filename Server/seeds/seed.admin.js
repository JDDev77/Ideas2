const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Asegúrate de que la ruta al modelo es correcta
const imagePath = "../public/img/user.png"; // Asegúrate de que esta ruta sea accesible desde donde se llama

mongoose.connect('mongodb://localhost:27017/mi_redsocial', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected');
    ejecutar(imagePath); // Pasamos la ruta de la imagen como argumento
})
.catch(err => console.log(err));

const ejecutar = async (imagePath) => {
    try {
        const hashedPassword = await bcrypt.hash("securePassword", 12); // Encriptación de la contraseña

        const adminExists = await User.findOne({ email: "admin@example.com" });
        if (adminExists) {
            console.log('Admin user already exists');
            return;
        }

        await User.create({
            name: "Admin",
            surname: "User",
            bio: "Admin bio",
            nick: "AdminNick",
            email: "admin@example.com",
            password: hashedPassword,
            role: "role_admin",
            image: imagePath // Usamos la ruta de la imagen pasada como argumento
        });
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.disconnect();
    }
};

ejecutar()