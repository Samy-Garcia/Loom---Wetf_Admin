import mongoose from "mongoose";

mongoose.connect("mongodb://Samuel:akamegakill@ac-q57xd6f-shard-00-00.7impljn.mongodb.net:27017,ac-q57xd6f-shard-00-01.7impljn.mongodb.net:27017,ac-q57xd6f-shard-00-02.7impljn.mongodb.net:27017/LoomDB?ssl=true&replicaSet=atlas-hfbe06-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ClusterPersonal")

//comprobamos la conexion a la base de datos

//creo una constante que es igual a la conexion

const connection = mongoose.connection;

connection.on("disconnected", () => {
    console.error("Desconectado de MongoDB");
});

connection.once("open", () => {
    console.log("Conectado a MongoDB");
});

connection.on("error", (error) => {
    console.error("Error de conexión a MongoDB:"+ error);
});