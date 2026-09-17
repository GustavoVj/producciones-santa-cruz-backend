import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import produccionRoutes from "./routes/produccionRoutes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON

app.use("/api/produccion", produccionRoutes);

const PORT = process.env.PORT || 3001;

// Inicializar la conexión a MySQL y luego levantar el servidor
AppDataSource.initialize()
    .then(() => {
        console.log("Conexión a MySQL establecida con éxito.");
        
        app.listen(PORT, () => {
            console.log(`Servidor de Producciones SCZ corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.log("Error al conectar con la base de datos:", error));