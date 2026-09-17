import { Request, Response } from "express";
import { ProduccionService } from "../services/ProduccionService";

const produccionService = new ProduccionService();

export class ProduccionController {
    async finalizar(req: Request, res: Response): Promise<Response | void> {
        try {
            // Extraemos el ID de la ruta (ej: /api/produccion/1/finalizar)
            const produccionId = parseInt(req.params.id as string);
            
            if (isNaN(produccionId)) {
                return res.status(400).json({ error: "El ID de producción debe ser un número válido." });
            }

            // Llamamos a nuestro "cerebro" (el servicio)
            const resultado = await produccionService.finalizarProduccion(produccionId);
            
            // Si todo sale bien, devolvemos un estado 200 (OK) y los datos en JSON
            return res.status(200).json(resultado);
            
        } catch (error: any) {
            // Si hay un error (ej. la orden ya estaba finalizada), devolvemos un status 400
            return res.status(400).json({ error: error.message });
        }
    }
}