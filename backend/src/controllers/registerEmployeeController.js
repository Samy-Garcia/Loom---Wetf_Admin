import nodemailer from "nodemailer"; //envía correos electrónicos
import crypto from "crypto"; //genera tokens aleatorios
import jsonwebtoken from "jsonwebtoken"; //genera tokens JWT para autenticación
import bcryptjs from "bcryptjs"; //hashea contraseñas
import cloudinary from "cloudinary"; //configuración de Cloudinary para subir imágenes


import HTMLRegisterEmail from "../utils/sendMaildRegisterClient.js"; //plantilla HTML para el correo de registro

import  config  from "../../config.js"; //importa configuración del proyecto, como la clave secreta para JWT

import employeeModel from "../models/employee.js"; //modelo de cliente para interactuar con la base de datos

const registerEmployeeController = {};

registerEmployeeController.register = async (req, res) => {
    try {
        //solicitar datos

             console.log("BODY RECIBIDO:", req.body);


        const { 
            name,
            email,
            password,
            address,
            phone,
            salary
                } = req.body;

        //validar si ya existe
        const existingEmployee = await employeeModel.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'El empleado ya existe' });
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
                address,
                phone,
                salary
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
registerEmployeeController.verifyCode = async (req, res) => {
    try {

        //1. Solicitar el código de verificación en el frontend
        const { verificationCodeRequest} = req.body;

        //2. Obtener el token de la cookie
        const token = req.cookies.registrationCookie

        //extraer la información del token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        const { randomCode, name, email, password, address, phone, salary } = decoded;

        //3. Comparar el código de verificación con el código generado
        if (verificationCodeRequest !== randomCode) {
            return res.status(400).json({ message: 'Código de verificación incorrecto' });
        }

        //4. Si el código es correcto, guardar el empleado en la base de datos
        const newEmployee = new employeeModel({
            name,
            email,
            password,
            address,
            phone,
            salary,
            isVerified: true,
        });

        await newEmployee.save();

        //5. Eliminar la cookie de registro
        res.clearCookie("registrationCookie");

        return res.status(200).json({ message: 'Empleado registrado exitosamente' });
        
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// GET /api/registerEmployee - listar todos los empleados (uso administrativo)
registerEmployeeController.getAll = async (req, res) => {
    try {
        const employees = await employeeModel.find().select("-password");
        res.status(200).json(employees);
    } catch (error) {
        console.log("error getAll employees:", error);
        res.status(500).json({ message: "Error al obtener los empleados" });
    }
};

// GET /api/registerEmployee/:id
registerEmployeeController.getById = async (req, res) => {
    try {
        const employee = await employeeModel.findById(req.params.id).select("-password");
        if (!employee) return res.status(404).json({ message: "Empleado no encontrado" });
        res.status(200).json(employee);
    } catch (error) {
        console.log("error getById employee:", error);
        res.status(500).json({ message: "Error al obtener el empleado" });
    }
};

// PUT /api/registerEmployee/:id - actualizar datos del empleado (uso administrativo)
registerEmployeeController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, address, phone, salary, isVerified } = req.body;

        const updated = await employeeModel.findByIdAndUpdate(
            id,
            { name, email, address, phone, salary, isVerified },
            { new: true }
        ).select("-password");

        if (!updated) return res.status(404).json({ message: "Empleado no encontrado" });
        res.status(200).json({ message: "Empleado actualizado", employee: updated });
    } catch (error) {
        console.log("error update employee:", error);
        res.status(500).json({ message: "Error al actualizar el empleado" });
    }
};

// DELETE /api/registerEmployee/:id
registerEmployeeController.delete = async (req, res) => {
    try {
        const deleted = await employeeModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Empleado no encontrado" });
        res.status(200).json({ message: "Empleado eliminado exitosamente" });
    } catch (error) {
        console.log("error delete employee:", error);
        res.status(500).json({ message: "Error al eliminar el empleado" });
    }
};

export default registerEmployeeController;