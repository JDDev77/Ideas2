const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");
const app = express();
const puerto = 3900;
const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");
const FollowRoutes = require("./routes/follow");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true})); 

app.use("/api/user", UserRoutes);
app.use("/api/publication", PublicationRoutes);
app.use("/api/follow", FollowRoutes);

app.listen(puerto, () => {
    console.log("Servidor de node corriendo en el puerto: ", puerto);
    connection();
});