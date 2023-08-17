import express  from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from 'cors';

import authRoutes from "./routes/auth.routes.js";
import formRoutes from "./routes/form.routes.js"

const app = express();

app.use(morgan('dev'));
app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Cambia esto por la URL de tu frontend
  credentials: true // Habilita el uso de credenciales (cookies)
}));


app.use('/api', authRoutes);//Rutas de Autenticacion (Registo, login Usuarios)
app.use('/api', formRoutes);//Rutas de Formularios (Registo, login Usuarios)

export default app;