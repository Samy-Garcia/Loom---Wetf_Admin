import nodemailer from "nodemailer";
import config from "../../config.js";

// Un solo transporter reutilizable para todo el backend,
// en vez de crear uno nuevo cada vez que se manda un correo.
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
    },
});

// Verificamos la conexion con Gmail apenas arranca el servidor.
// Asi, si las credenciales estan mal, lo ves en la consola de una vez
// en vez de descubrirlo hasta que alguien intente registrarse.
if (config.email.user_email && config.email.user_password) {
    transporter.verify((error) => {
        if (error) {
            console.error("\nNo se pudo conectar con Gmail para enviar correos.");
            console.error("Motivo:", error.message);
            console.error(
                "Revisa USER_EMAIL y USER_PASSWORD en tu .env. USER_PASSWORD debe ser " +
                "una 'contrasena de aplicacion' generada en https://myaccount.google.com/apppasswords " +
                "(no la contrasena normal de la cuenta), y la cuenta debe tener la verificacion " +
                "en dos pasos activada.\n"
            );
        } else {
            console.log("Conexion con Gmail lista para enviar correos.");
        }
    });
}

/**
 * Envia un correo. Lanza el error hacia arriba si falla,
 * para que quien lo llame decida como responder al cliente.
 */
export const sendMail = async ({ to, subject, text, html }) => {
    return transporter.sendMail({
        from: `"LØØM & WEFT" <${config.email.user_email}>`,
        to,
        subject,
        text,
        html,
    });
};

export default transporter;
