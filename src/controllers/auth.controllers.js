import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import createAccessToken from "../libs/createToken.js";
import jwt  from "jsonwebtoken";
import dotenv from "dotenv"

//Helpers
import { sendEmail } from "../helpers/resendEmail.js";

dotenv.config();

export const register = async (req, res) => {
    const {userfirstname, userlastname, email, password, isVerify, userPlan} = req.body;
    try {
        const userFound = await User.findOne({email})
        if (userFound) return res.status(400).json(({message:"Usuario ya existe, Inicia Sesion"}))
        const passwordEncryp = await bcrypt.hash(password, 10)
        const newUser = new User ({
            userfirstname: userfirstname,
            userlastname: userlastname,
            email:email,
            password: passwordEncryp,
            isVerify: isVerify,
            userPlan: userPlan
        })
        const userSaved = await newUser.save();
        const token = await createAccessToken({id: userSaved._id});
        const verificationLink = `http://localhost:5173/toverifyemail/${userSaved._id}`;
        const emailContent =`Verifica tu Email haciendo click <a href="${verificationLink}">aquí</a>`;
        sendEmail(email, `Verificar Email Echosurvey`, emailContent);
        // res.cookie("token", token, {
        //     sameSite: 'none',
        //     secure: true,
        //     httpOnly: false
        // });
        res.json(userSaved)
    } catch (error) {
        console.log(error);
        res.status(500).json("error")
    }
}
export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const userFound = await User.findOne({email})
        if (!userFound) return res.status(400).json(({message:"Usuario o email incorrectos"}))
        const isMatch = await bcrypt.compare(password, userFound.password)
        if (!isMatch) return res.status(400).json({message:"Usuario o email incorrectos"})
        if (!userFound.isVerify) return res.status(400).json(({message:"Email no verificado"}))
        const token = await createAccessToken({id: userFound._id});
        res.cookie("token", token, {
            sameSite: 'none',
            secure: true,
            httpOnly: false,
            domain: '.netlify.app'
        });
        const response = {
            token: token,
            user: userFound
        };
        res.json(response)
    } catch (error) {
        console.log(error);
        res.status(500).json("error")
    }
}

export const logout = async (req, res) => {
    res.cookie("token", '');
    res.json("Usuario deslogueado correctamente");
}

export const verifyTokenToFront = async (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({message: "No auth"})

    try {
        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) return res.status(401).json({message: "No auth"});
            const userFound = await User.findById(user.id)
            if (!userFound) return res.status(401).json({message: "No auth"});
            return res.json(userFound)
        })
    } catch (error) {
        
    }
}

export const getUserToVerify = async (req, res) => {
    const idUser = req.params.id;
    
    try {
        const userFound = await User.findById(idUser);
        res.json(userFound.userfirstname)
    } catch (error) {
        console.log(error);
    }
}

export const verifyUser = async (req, res) => {
    const idUser = req.params.id;
    try {
        const isVerify = await User.findById(idUser);
        if(isVerify.isVerify) {
            return res.status(404).json({ message: "Usuario ya verificado" });
        }
        const userFound = await User.findByIdAndUpdate(
            idUser,
            { $set: { isVerify: true } },
            { new: true } // Esto devuelve el documento modificado
        );

        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({ message: "Usuario verificado correctamente" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const sendEmailToRecovery = async (req, res) => {
    const {email} = req.body;
    try {
        const userFound = await User.findOne({email});
        console.log(userFound);
        const verificationLink = `http://localhost:5173/recoverypasswordPage/${userFound._id}`;
        const emailContent =`Recupera tu contraseña hacienco click <a href="${verificationLink}">aquí</a>`;
        sendEmail(email, `Recuperar contraseña Echosurvey`, emailContent);
        res.status(200).json({ message: "Mail Enviado" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const modifyPasswordUser = async (req, res) => {
    const idUser = req.params.id;
    const { password } = req.body;
    
    try {
        // Buscar al usuario por su ID
        const user = await User.findById(idUser);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Encriptar la nueva contraseña
        const newPasswordEncrypted = await bcrypt.hash(password, 10);

        // Actualizar la contraseña del usuario
        user.password = newPasswordEncrypted;
        await user.save();

        res.status(200).json({ message: "Contraseña modificada exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
