import { AppDataSource } from "../config/data-source";
import { Produccion } from "../entities/Produccion";
import { ActivoInventario } from "../entities/ActivoInventario";

export class ProduccionService {
    
    async finalizarProduccion(produccionId: number) {
        // 1. Iniciamos el QueryRunner para manejar la transacción
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 2. Buscamos la orden de producción dentro de la transacción
            const produccion = await queryRunner.manager.findOne(Produccion, {
                where: { ProduccionID: produccionId }
            });

            if (!produccion) {
                throw new Error("Orden de producción no encontrada.");
            }

            if (produccion.Estado === "Finalizada") {
                throw new Error("La orden de producción ya ha sido finalizada anteriormente.");
            }

            const activosGenerados: ActivoInventario[] = [];

            // 3. Iteramos para generar 'N' activos basándonos en la Cantidad a Producir
            for (let i = 1; i <= produccion.CantidadProducir; i++) {
                const nuevoActivo = new ActivoInventario();
                nuevoActivo.ModeloID = produccion.PlanoID; // Temporalmente usamos el PlanoID o un modelo por defecto
                nuevoActivo.FechaRegistro = new Date();
                nuevoActivo.Estado = "Disponible"; // Estado estricto para el inventario
                nuevoActivo.produccion = produccion;
                
                // Generamos un código de serie único (Ej: PROD-1-ACT-1, PROD-1-ACT-2)
                nuevoActivo.CodigoSerie = `PROD-${produccion.ProduccionID}-ACT-${i}-${Date.now().toString().slice(-4)}`;
                
                activosGenerados.push(nuevoActivo);
            }

            // 4. Guardamos todos los activos en bloque (bulk insert)
            await queryRunner.manager.save(ActivoInventario, activosGenerados);

            // 5. Actualizamos el estado y la fecha de fin de la Producción
            produccion.Estado = "Finalizada";
            produccion.FechaFin = new Date();
            await queryRunner.manager.save(Produccion, produccion);

            // 6. Si todo salió perfecto, confirmamos la transacción (Commit)
            await queryRunner.commitTransaction();
            
            return {
                mensaje: "Producción finalizada exitosamente.",
                cantidadGenerada: produccion.CantidadProducir,
                activos: activosGenerados
            };

        } catch (error) {
            // 7. Si algo falla (ej. código duplicado), deshacemos todo (Rollback)
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // 8. Liberamos la conexión a la base de datos
            await queryRunner.release();
        }
    }
}