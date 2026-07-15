// Script de diagnostico. Correlo con: node diagnostico-mail.js
// No imprime tu contraseña completa, solo datos utiles para diagnosticar.

import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const email = process.env.USER_EMAIL || "";
const pass = process.env.USER_PASSWORD || "";

console.log("--- Diagnostico ---");
console.log("USER_EMAIL:", JSON.stringify(email));
console.log("USER_EMAIL termina en espacio/salto de linea oculto:", /\s$/.test(email));
console.log("USER_PASSWORD longitud:", pass.length, "caracteres");
console.log("USER_PASSWORD (con espacios) esperado: 19 caracteres (16 + 3 espacios)");
console.log("USER_PASSWORD (sin espacios) esperado: 16 caracteres");
console.log("USER_PASSWORD termina en espacio/salto de linea oculto:", /\s$/.test(pass));
console.log("USER_PASSWORD primeros 2 caracteres:", JSON.stringify(pass.slice(0, 2)));
console.log("USER_PASSWORD últimos 2 caracteres:", JSON.stringify(pass.slice(-2)));
console.log("--------------------\n");

const passSinEspacios = pass.replace(/\s/g, "");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: email.trim(),
        pass: passSinEspacios,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.log("FALLÓ la conexión.");
        console.log("Código:", error.code);
        console.log("Respuesta completa del servidor:", error.response);
    } else {
        console.log("ÉXITO: la conexión con Gmail funcionó.");
    }
    process.exit(0);
});
