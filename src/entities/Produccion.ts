import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ActivoInventario } from "./ActivoInventario";

@Entity("produccion")
export class Produccion {
    @PrimaryGeneratedColumn()
    ProduccionID!: number;

    @Column({ type: "int" })
    PlanoID!: number; // FK temporal

    @Column({ type: "int" })
    SupervisorID!: number; // FK temporal

    @Column({ type: "date" })
    FechaInicio!: Date;

    @Column({ type: "date", nullable: true })
    FechaFin!: Date;

    @Column({ type: "int" })
    CantidadProducir!: number;

    @Column({ type: "varchar", length: 50, default: "En Proceso" })
    Estado!: string;

    // Relación 1:N -> Una producción tiene muchos activos generados
    @OneToMany(() => ActivoInventario, (activo) => activo.produccion)
    activos!: ActivoInventario[];
}