import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../../config.js";

import adminModel from "../models/admin.js";

const loginAdminController = {};

loginAdminController.login = async (req, res) => {
    try {
        //solicitar datos
        const { email, password } = req.body;

        //validar si el cliente existe
        const AdminFound = await adminModel.findOne({ email });
        if (!AdminFound) {
            return res.status(400).json({ message: 'El cliente no existe' });
        }

         //Vereficamos que la cuenta no este bloqueada
        if ( AdminFound.timeOut && AdminFound.timeOut > Date.now()) {
            return res.status(403).json({message: "Account is blocked. Try again later."});
        }

        //validar contraseña
        const isMatch = await bcrypt.compare(password, AdminFound.password);
        if (!isMatch) {
            //Si la contraseña es incorrecta, incrementamos los intentos de inicio de sesión
            AdminFound.loginAttempts = (AdminFound.loginAttempts || 0) + 1;

            if (AdminFound.loginAttempts >= 5) {
                AdminFound.timeOut = Date.now() + 5 * 60 * 1000; // Bloquea la cuenta por 5 minutos

                await AdminFound.save();
                return res.status(403).json({message: "Account is blocked due to multiple failed login attempts. Try again later."});
            }

            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        //resetear intentos de inicio de sesión y tiempo de bloqueo
        AdminFound.loginAttempts = 0;
        AdminFound.timeOut = null;

        //generar token
        const token = jsonwebtoken.sign(
        //que vamos a guardar en el token
        { id: AdminFound._id, userType: "admin" },
        //secret key
        config.JWT.secret,
        //tiempo de expiracion del token
        { expiresIn: "30d" }
        );

        //guardar el token en una cookie
        res.cookie("authCookie", token, {maxAge: 30 * 24 * 60 * 60 * 1000});

        await AdminFound.save();

        return res.status(200).json({message: "Login successful"});

            
    } catch (error) {
        console.log("error"+ error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default loginAdminController;