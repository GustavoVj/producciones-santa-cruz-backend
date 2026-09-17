import { Router } from "express";
import { ProduccionController } from "../controllers/ProduccionController";

const router = Router();
const produccionController = new ProduccionController();

// Definimos que al hacer un POST a la ruta, se ejecute el método del controlador
router.post("/:id/finalizar", (req, res) => produccionController.finalizar(req, res));

export default router;