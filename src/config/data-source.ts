import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "", // Déjalo vacío si usas XAMPP por defecto
    database: "producciones_scz", // Asegúrate de crear esta base de datos en phpMyAdmin
    synchronize: true, // Esto creará las tablas automáticamente en base a tus entidades (ideal para desarrollo)
    logging: true, // Te permitirá ver las consultas SQL en la consola
    entities: [], // Aquí conectaremos ActivoInventario y Produccion más adelante
    migrations: [],
    subscribers: [],
});