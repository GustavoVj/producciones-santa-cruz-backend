import { useState, useEffect } from 'react';
import { api } from '../services/api';

// Interfaz para tipar las órdenes que vienen del backend
interface Produccion {
    ProduccionID: number;
    PlanoID: number;
    CantidadProducir: number;
    Estado: string;
}

interface Activo {
    ActivoID: number;
    CodigoSerie: string;
    FechaRegistro: string;
    Estado: string;
}

interface ResultadoProduccion {
    mensaje: string;
    cantidadGenerada: number;
    activos: Activo[];
}

export const ProduccionPanel = () => {
    const [pendientes, setPendientes] = useState<Produccion[]>([]);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [resultado, setResultado] = useState<ResultadoProduccion | null>(null);
    const [error, setError] = useState<string | null>(null);

    // useEffect se ejecuta una sola vez al cargar el componente
    useEffect(() => {
        cargarPendientes();
    }, []);

    const cargarPendientes = async () => {
        try {
            const response = await api.get('/pendientes');
            setPendientes(response.data);
        } catch (err) {
            setError('No se pudo cargar la lista de órdenes pendientes.');
        }
    };

    // Ahora recibe el ID dinámicamente desde el botón de la tabla
    const handleFinalizarProduccion = async (produccionId: number) => {
        setLoadingId(produccionId);
        setError(null);
        setResultado(null);

        try {
            const response = await api.post(`/${produccionId}/finalizar`);
            setResultado(response.data);
            
            // Si la transacción fue exitosa, filtramos la orden para que desaparezca de la tabla
            setPendientes((actuales) => 
                actuales.filter((orden) => orden.ProduccionID !== produccionId)
            );
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al conectar con el servidor');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Panel de Producción</h1>
                <p className="text-gray-600 mb-6">Órdenes de Trabajo en Proceso</p>

                {/* Tabla de Órdenes Pendientes */}
                <div className="overflow-x-auto mb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 border-b border-gray-300">
                                <th className="p-3">Orden ID</th>
                                <th className="p-3">Plano / Modelo</th>
                                <th className="p-3">Cantidad</th>
                                <th className="p-3 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendientes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No hay órdenes de producción pendientes en este momento.
                                    </td>
                                </tr>
                            ) : (
                                pendientes.map((orden) => (
                                    <tr key={orden.ProduccionID} className="hover:bg-gray-50 border-b border-gray-200">
                                        <td className="p-3 font-semibold">#{orden.ProduccionID}</td>
                                        <td className="p-3 text-gray-600">Modelo {orden.PlanoID}</td>
                                        <td className="p-3">{orden.CantidadProducir} uds.</td>
                                        <td className="p-3 text-right">
                                            <button 
                                                onClick={() => handleFinalizarProduccion(orden.ProduccionID)}
                                                disabled={loadingId === orden.ProduccionID}
                                                className={`px-4 py-1.5 rounded font-semibold text-white transition-colors text-sm
                                                    ${loadingId === orden.ProduccionID ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                            >
                                                {loadingId === orden.ProduccionID ? 'Procesando...' : 'Finalizar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-300">
                        {error}
                    </div>
                )}

                {/* Tabla de Activos Generados */}
                {resultado && (
                    <div className="mt-4">
                        <div className="p-4 bg-green-100 text-green-800 rounded-md mb-4 border border-green-300">
                            <strong>¡Transacción Exitosa!</strong> {resultado.mensaje} ({resultado.cantidadGenerada} activos)
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-700">
                                        <th className="p-3 border-b border-gray-300">Código de Serie</th>
                                        <th className="p-3 border-b border-gray-300">Estado</th>
                                        <th className="p-3 border-b border-gray-300">Fecha de Registro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultado.activos.map((activo) => (
                                        <tr key={activo.ActivoID} className="hover:bg-gray-50 border-b border-gray-200">
                                            <td className="p-3 font-mono text-sm">{activo.CodigoSerie}</td>
                                            <td className="p-3">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                                    {activo.Estado}
                                                </span>
                                            </td>
                                            <td className="p-3 text-sm text-gray-600">
                                                {new Date(activo.FechaRegistro).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};