import nodemailer from "nodemailer"; //envía correos electrónicos
import crypto from "crypto"; //genera tokens aleatorios
import jsonwebtoken from "jsonwebtoken"; //genera tokens JWT para autenticación
import bcryptjs from "bcryptjs"; //hashea contraseñas
import cloudinary from "cloudinary"; //configuración de Cloudinary para subir imágenes


import HTMLRegisterEmail from "../utils/sendMaildRegisterClient.js"; //plantilla HTML para el correo de registro

import  config  from "../../config.js"; //importa configuración del proyecto, como la clave secreta para JWT

import clientModel from "../models/client.js"; //modelo de cliente para interactuar con la base de datos

const registerClientController = {};

registerClientController.register = async (req, res) => {
    try {
        //solicitar datos
        const { 
            name,
            lastName,
            email,
            password,
            birthdate,
            isVerified,
            phone,
            address,
            loginAttempts,
            timeOut
                } = req.body;

        //validar si ya existe
        const existingClient = await clientModel.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ message: 'El cliente ya existe' });
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
                lastName,
                email,
                password: passwordHashed,
                birthdate,
                isVerified,
                phone,
                address,
                loginAttempts,
                timeOut
            },
            //secret key
            config.JWT.secret,
            //tiempo de expiracion del token
            { expiresIn: "15m" }
        );

        //guardar el token en una cookie
        res.cookie("registrationCookie", token, {maxAge: 15 * 60 * 1000});

        //enviar el correo con el codigo de verificacion
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password
            }
        });

        //mail options ¿quien lo recibe y como?
        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Código de verificación",
            text: "El vence en 15 minutos",
            html: HTMLRegisterEmail(randomCode)
        };

         //3. Enviar el correo
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ message: 'Error sending email' });
            }                return res.status(200).json({ message: 'Email sent successfully' });
        });


    } catch (error) {
        console.log("error"+ error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//verificar el codigo de verificacion
registerClientController.verifyCode = async (req, res) => {
    try {

        //1. Solicitar el código de verificación en el frontend
        const { verificationCodeRequest} = req.body;

        //2. Obtener el token de la cookie
        const token = req.cookies.registrationCookie

        //extraer la información del token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        const { randomCode, name, lastName, email, password, birthdate, isVerified, phone, address, loginAttempts, timeOut } = decoded;

        //3. Comparar el código de verificación con el código generado
        if (verificationCodeRequest !== randomCode) {
            return res.status(400).json({ message: 'Código de verificación incorrecto' });
        }

        //4. Si el código es correcto, guardar el cliente en la base de datos
        const newClient = new clientModel({
            name,
            lastName,
            email,
            password,
            birthdate,
            phone,
            address,
            isVerified: true,
            image: req.file,
            public_id: req.file.filename,
        });

        await newClient.save();

        //5. Eliminar la cookie de registro
        res.clearCookie("registrationCookie");

        return res.status(200).json({ message: 'Cliente registrado exitosamente' });
        
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// GET /api/registerClient - listar todos los clientes (uso administrativo)
registerClientController.getAll = async (req, res) => {
    try {
        const clients = await clientModel.find().select("-password");
        res.status(200).json(clients);
    } catch (error) {
        console.log("error getAll clients:", error);
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
};

// GET /api/registerClient/:id
registerClientController.getById = async (req, res) => {
    try {
        const client = await clientModel.findById(req.params.id).select("-password");
        if (!client) return res.status(404).json({ message: "Cliente no encontrado" });
        res.status(200).json(client);
    } catch (error) {
        console.log("error getById client:", error);
        res.status(500).json({ message: "Error al obtener el cliente" });
    }
};

// PUT /api/registerClient/:id - actualizar datos del cliente (uso administrativo)
registerClientController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, lastName, email, phone, address, isActive, isVerified } = req.body;

        const updated = await clientModel.findByIdAndUpdate(
            id,
            { name, lastName, email, phone, address, isActive, isVerified },
            { new: true }
        ).select("-password");

        if (!updated) return res.status(404).json({ message: "Cliente no encontrado" });
        res.status(200).json({ message: "Cliente actualizado", client: updated });
    } catch (error) {
        console.log("error update client:", error);
        res.status(500).json({ message: "Error al actualizar el cliente" });
    }
};

// DELETE /api/registerClient/:id
registerClientController.delete = async (req, res) => {
    try {
        const deleted = await clientModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Cliente no encontrado" });
        res.status(200).json({ message: "Cliente eliminado exitosamente" });
    } catch (error) {
        console.log("error delete client:", error);
        res.status(500).json({ message: "Error al eliminar el cliente" });
    }
};

export default registerClientController;