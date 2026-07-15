import crypto from "crypto"; //genera tokens aleatorios
import jsonwebtoken from "jsonwebtoken"; //genera tokens JWT para autenticación
import bcryptjs from "bcryptjs"; //hashea contraseñas

import HTMLRegisterEmail from "../utils/sendMaildRegisterAdmin.js"; //plantilla HTML para el correo de registro
import { sendMail } from "../utils/mailer.js"; //envío de correos reutilizable

import config from "../../config.js"; //importa configuración del proyecto, como la clave secreta para JWT

import adminModel from "../models/admin.js"; //modelo de cliente para interactuar con la base de datos

const registerAdminController = {};

registerAdminController.register = async (req, res) => {
    try {
        //solicitar datos
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Nombre, correo y contraseña son obligatorios" });
        }

        //validar si ya existe
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "El administrador ya existe" });
        }

        //encriptar contraseña
        const passwordHashed = await bcryptjs.hash(password, 10);

        //generar un codigo aleatorio
        const randomCode = crypto.randomBytes(3).toString("hex");

        //guardar todo en un token
        const token = jsonwebtoken.sign(
            {
                randomCode,
                name,
                email,
                password: passwordHashed,
            },
            //secret key
            config.JWT.secret,
            //tiempo de expiracion del token
            { expiresIn: "15m" }
        );

        //guardar el token en una cookie
        res.cookie("registrationCookie", token, { maxAge: 15 * 60 * 1000 });

        //enviar el correo con el codigo de verificacion
        try {
            await sendMail({
                to: email,
                subject: "Tu código de verificación - LØØM & WEFT",
                text: `Tu código de verificación es ${randomCode}. Vence en 15 minutos.`,
                html: HTMLRegisterEmail(randomCode),
            });
        } catch (mailError) {
            // El correo falló, pero ya guardamos la cookie con el token.
            // Avisamos claramente en consola cuál fue el motivo real de Gmail.
            console.error("Error enviando el correo de verificación:", mailError.message);
            return res.status(502).json({
                message: "No se pudo enviar el correo de verificación. Intenta de nuevo en unos minutos.",
            });
        }

        return res.status(200).json({ message: "Correo de verificación enviado" });
    } catch (error) {
        console.error("Error en registerAdminController.register:", error);
        res.status(500).json({ message: "Error interno al registrar" });
    }
};

//verificar el codigo de verificacion
registerAdminController.verifyCode = async (req, res) => {
    try {
        //1. Solicitar el código de verificación en el frontend
        const { verificationCodeRequest } = req.body;

        if (!verificationCodeRequest) {
            return res.status(400).json({ message: "Ingresa el código de verificación" });
        }

        //2. Obtener el token de la cookie
        const token = req.cookies.registrationCookie;
        if (!token) {
            return res.status(400).json({
                message: "El código expiró o no hay un registro en curso. Vuelve a registrarte.",
            });
        }

        //extraer la información del token
        let decoded;
        try {
            decoded = jsonwebtoken.verify(token, config.JWT.secret);
        } catch (jwtError) {
            return res.status(400).json({
                message: "El código expiró. Vuelve a registrarte para recibir uno nuevo.",
            });
        }

        const { randomCode, name, email, password } = decoded;

        //3. Comparar el código de verificación con el código generado
        if (verificationCodeRequest.trim().toLowerCase() !== randomCode) {
            return res.status(400).json({ message: "Código de verificación incorrecto" });
        }

        //4. Si el código es correcto, guardar el administrador en la base de datos
        const newAdmin = new adminModel({
            name,
            email,
            password,
            isVerified: true,
        });

        await newAdmin.save();

        //5. Eliminar la cookie de registro
        res.clearCookie("registrationCookie");

        return res.status(200).json({ message: "Administrador registrado exitosamente" });
    } catch (error) {
        console.error("Error en registerAdminController.verifyCode:", error);
        res.status(500).json({ message: "Error interno al verificar el código" });
    }
};

export default registerAdminController;
