import dotenv from "dotenv";

//Ejecutamos la libreria dotenv
dotenv.config();

export const config = {
    JWT: {
        secret: process.env.JWT_SECRET_KEY
    },
    email: {
        user_email: process.env.USER_EMAIL,
        user_password: process.env.USER_PASSWORD
    },
    cloudinary: {
        cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
    },
};

// Aviso claro en consola si falta alguna variable critica.
// Sin JWT_SECRET_KEY, el login y el registro fallan con "Internal server error"
// porque jsonwebtoken.sign() no puede firmar el token.
const requiredVars = {
    JWT_SECRET_KEY: config.JWT.secret,
    USER_EMAIL: config.email.user_email,
    USER_PASSWORD: config.email.user_password,
};

const missing = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

if (missing.length > 0) {
    console.warn(
        "\nFaltan variables de entorno en tu archivo .env: " + missing.join(", ") +
        "\nCopia backend/.env.example como backend/.env y completalo." +
        "\nSin JWT_SECRET_KEY, el login y el registro fallaran con 'Internal server error'.\n"
    );
}

export default config;