import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Produccion } from "./Produccion";

@Entity("activo_inventario")
export class ActivoInventario {
    @PrimaryGeneratedColumn()
    ActivoID!: number;

    @Column({ type: "int" })
    ModeloID!: number; // FK temporal

    @Column({ type: "varchar", length: 100, unique: true })
    CodigoSerie!: string;

    @Column({ type: "date" })
    FechaRegistro!: Date;

    @Column({ type: "varchar", length: 50, default: "Disponible" })
    Estado!: string;

    // Relación N:1 -> Muchos activos pertenecen a una orden de producción
    @ManyToOne(() => Produccion, (produccion) => produccion.activos)
    @JoinColumn({ name: "ProduccionID" })
    produccion!: Produccion;
}