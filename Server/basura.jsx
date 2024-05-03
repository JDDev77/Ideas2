const profile = (req, res) => {
    // Recibir el parametro del id de usuario por la url
    const id = req.params.id;

    // Consulta para sacar los datos del usuario
    //const userProfile = await User.findById(id);

    User.findById(id)
        .select({ password: 0, role: 0 })
        .exec(async (error, userProfile) => {
            if (error || !userProfile) {
                return res.status(404).send({
                    status: "error",
                    message: "El usuario no existe o hay un error"
                });
            }

            // Info de seguimiento
            const followInfo = await followService.followThisUser(req.user.id, id);

            // Devolver el resultado 
            return res.status(200).send({
                status: "success",
                user: userProfile,
                following: followInfo.following,
                follower: followInfo.follower
            });

        });

}