// Importar dependencias y modulos
const bcrypt = require("bcrypt");
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

// Importar modelos
const User = require("../models/user");
const Follow = require("../models/follow");
const Publication = require("../models/publication");

// Importar servicios
const jwt = require("../services/jwt");
const followService = require("../services/followService");
const validate = require("../helpers/validate");
const wrapAsync = require("../helpers/functions")

// Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/user.js",
        usuario: req.user
    });
}

// Regristro de usuarios
const register = (req, res) => {
    // Recoger datos de la peticion
    let params = req.body;

    // Comprobar que me llegan bien (+ validacion)
    if (!params.name || !params.email || !params.password || !params.nick) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    // Validación avanzada
    try{
        validate(params);
    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "Valición no superada",
        });
    }
    
    // Control usuarios duplicados
    User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { nick: params.nick.toLowerCase() }
        ]
    }).exec(async (error, users) => {

        if (error) return res.status(500).json({ status: "error", message: "Error en la consulta de usuarios" });

        if (users && users.length >= 1) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            });
        }

        // Cifrar la contraseña
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        // Crear objeto de usuario
        let user_to_save = new User(params);

        // Guardar usuario en la bbdd
        user_to_save.save((error, userStored) => {
            if (error || !userStored) return res.status(500).send({ status: "error", "message": "Error al guardar el ususario" });

            // añadido
            userStored.toObject();
            delete userStored.password;
            delete userStored.role;

            // Devolver resultado
            return res.status(200).json({
                status: "success",
                message: "Usuario registrado correctamente",
                user: userStored
            });

        });
    });
}

const login = (req, res) => {
    // Recoger parametros body
    let params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    // Buscar en la bbdd si existe
    User.findOne({ email: params.email })
        //.select({ "password": 0 })
        .exec((error, user) => {

            if (error || !user) return res.status(404).send({ status: "error", message: "No existe el usuario" });

            // Comprobar su contraseña
            const pwd = bcrypt.compareSync(params.password, user.password);

            if (!pwd) {
                return res.status(400).send({
                    status: "error",
                    message: "No te has identificado correctamente"
                })
            }

            // Conseguir Token
            const token = jwt.createToken(user);

            // Devolver Datos del usuario
            return res.status(200).send({
                status: "success",
                message: "Te has identificado correctamente",
                user: {
                    id: user._id,
                    name: user.name,
                    nick: user.nick,
                    role: user.role
                },
                token
            });
        });
}

const profile = (req, res) => {
    const id = req.params.id;

    User.findById(id)
        .select('-password') // Solo excluye la contraseña
        .exec((error, userProfile) => {
            if (error || !userProfile) {
                return res.status(404).send({
                    status: "error",
                    message: "El usuario no existe o hay un error"
                });
            }

            const followInfoPromise = followService.followThisUser(req.user.id, id);

            followInfoPromise.then(followInfo => {
                // Devolver el resultado con la propiedad 'role' incluida
                return res.status(200).send({
                    status: "success",
                    user: userProfile, // 'userProfile' ahora incluirá el 'role'
                    following: followInfo.following,
                    follower: followInfo.follower
                });
            }).catch(err => {
                return res.status(500).send({
                    status: "error",
                    message: "Error al obtener información de seguimiento",
                    error: err
                });
            });
        });
}


const list = (req, res) => {
    // Controlar en que pagina estamos
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    page = parseInt(page);

    // Consulta con mongoose paginate
    let itemsPerPage = 5;

    User.find().select("-password -email -role -__v").sort('_id').paginate(page, itemsPerPage, async (error, users, total) => {

        if (error || !users) {
            return res.status(404).send({
                status: "error",
                message: "No hay usuarios disponibles",
                error
            });
        }

        // Sacar un array de ids de los usuarios que me siguen y los que sigo como Juan
        let followUserIds = await followService.followUserIds(req.user.id);

        // Devolver el resultado (posteriormente info follow)
        return res.status(200).send({
            status: "success",
            users,
            page,
            itemsPerPage,
            total,
            pages: Math.ceil(total / itemsPerPage),
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers
        });
    });

}

const update = (req, res) => {
    // Recoger info del usuario a actualizar
    let userIdentity = req.user;
    let userToUpdate = req.body;

    // Eliminar campos sobrantes
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    // Comprobar si el usuario ya existe
    User.find({
        $or: [
            { email: userToUpdate.email.toLowerCase() },
            { nick: userToUpdate.nick.toLowerCase() }
        ]
    }).exec(async (error, users) => {

        if (error) return res.status(500).json({ status: "error", message: "Error en la consulta de usuarios" });

        let userIsset = false;
        users.forEach(user => {
            if (user && user._id != userIdentity.id) userIsset = true;
        });

        if (userIsset) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            });
        }

        // Cifrar la contraseña
        if (userToUpdate.password) {
            let pwd = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = pwd;

            //añadido
        }else{
            delete userToUpdate.password;
        }

        // Buscar y actualizar 
        try {
            let userUpdated = await User.findByIdAndUpdate({ _id: userIdentity.id }, userToUpdate, { new: true });

            if (!userUpdated) {
                return res.status(400).json({ status: "error", message: "Error al actualizar" });
            }

            // Devolver respuesta
            return res.status(200).send({
                status: "success",
                message: "Metodo de actualizar usuario",
                user: userUpdated
            });

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Error al actualizar",
            });
        }

    });
}

const upload = (req, res) => {

    // Recoger el fichero de imagen y comprobar que existe
    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: "Petición no incluye la imagen"
        });
    }

    // Conseguir el nombre del archivo
    let image = req.file.originalname;

    // Sacar la extension del archivo
    const imageSplit = image.split("\.");
    const extension = imageSplit[1];

    // Comprobar extension
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {

        // Borrar archivo subido
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);

        // Devolver respuesta negativa
        return res.status(400).send({
            status: "error",
            message: "Extensión del fichero invalida"
        });
    }

    // Si si es correcta, guardar imagen en bbdd
    User.findOneAndUpdate({ _id: req.user.id }, { image: req.file.filename }, { new: true }, (error, userUpdated) => {
        if (error || !userUpdated) {
            return res.status(500).send({
                status: "error",
                message: "Error en la subida del avatar"
            })
        }

        // Devolver respuesta
        return res.status(200).send({
            status: "success",
            user: userUpdated,
            file: req.file,
        });
    });

}

const avatar = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/avatars/" + file;

    // Comprobar que existe
    fs.stat(filePath, (error, exists) => {

        if (!exists) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            });
        }

        // Devolver un file
        return res.sendFile(path.resolve(filePath));
    });

}

// añadido
const counters = async (req, res) => {

    let userId = req.user.id;

    if (req.params.id) {
        userId = req.params.id;
    }

    try {
        const following = await Follow.count({ "user": userId });

        const followed = await Follow.count({ "followed": userId });

        const publications = await Publication.count({ "user": userId });

        return res.status(200).send({
            userId,
            following: following,
            followed: followed,
            publications: publications
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error en los contadores",
            error
        });
    }
}

//funciones para backoffice
//Listar todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = wrapAsync(async (req, res, next) => {
    const newUser = new User({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10) // Encripta la contraseña antes de guardarla
    });
    await newUser.save();
    res.status(201).json({ message: "Usuario creado con éxito", user: newUser });
  });
  
  const deleteUser = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const userDeleted = await User.findByIdAndDelete(id);
    if (!userDeleted) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado con éxito" });
  });
  
  const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password'); // Excluye la contraseña en la respuesta
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el usuario", error: error });
    }
  };
  
  const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = {
        ...req.body,
      };
  
      // Si se proporciona una nueva contraseña, encriptarla
      if (req.body.password) {
        updates.password = bcrypt.hashSync(req.body.password, 10);
      }
  
      const userUpdated = await User.findByIdAndUpdate(id, updates, { new: true });
      if (!userUpdated) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json({ message: "Usuario actualizado con éxito", user: userUpdated });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el usuario", error: error });
    }
  };
  
// Exportar acciones
module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list,
    update,
    upload,
    avatar,
    counters,
    updateUser,
    getUserById,
    deleteUser,
    createUser,
    getAllUsers
}