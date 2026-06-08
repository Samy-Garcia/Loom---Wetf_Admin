import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../../config.js";

import employeeModel from "../models/employee.js";

const loginEmployeeController = {};

loginEmployeeController.login = async (req, res) => {
    try {
        //solicitar datos
        const { email, password } = req.body;

        //validar si el cliente existe
        const EmployeeFound = await employeeModel.findOne({ email });
        if (!EmployeeFound) {
            return res.status(400).json({ message: 'El empleado no existe' });
        }

         //Vereficamos que la cuenta no este bloqueada
        if ( EmployeeFound.timeOut && EmployeeFound.timeOut > Date.now()) {
            return res.status(403).json({message: "Account is blocked. Try again later."});
        }

        //validar contraseña
        const isMatch = await bcrypt.compare(password, EmployeeFound.password);
        if (!isMatch) {
            //Si la contraseña es incorrecta, incrementamos los intentos de inicio de sesión
            EmployeeFound.loginAttempts = (EmployeeFound.loginAttempts || 0) + 1;

            if (EmployeeFound.loginAttempts >= 5) {
                EmployeeFound.timeOut = Date.now() + 5 * 60 * 1000; // Bloquea la cuenta por 5 minutos

                await EmployeeFound.save();
                return res.status(403).json({message: "Account is blocked due to multiple failed login attempts. Try again later."});
            }

            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        //resetear intentos de inicio de sesión y tiempo de bloqueo
        EmployeeFound.loginAttempts = 0;
        EmployeeFound.timeOut = null;

        //generar token
        const token = jsonwebtoken.sign(
        //que vamos a guardar en el token
        { id: EmployeeFound._id, userType: "employee" },
        //secret key
        config.JWT.secret,
        //tiempo de expiracion del token
        { expiresIn: "30d" }
        );

        //guardar el token en una cookie
        res.cookie("authCookie", token, {maxAge: 30 * 24 * 60 * 60 * 1000});

        await EmployeeFound.save();

        return res.status(200).json({message: "Login successful"});

            
    } catch (error) {
        console.log("error"+ error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default loginEmployeeController;