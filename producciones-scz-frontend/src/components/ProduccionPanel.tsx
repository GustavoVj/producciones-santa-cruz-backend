import { useState } from 'react';
import { api } from '../services/api';

// Definimos la estructura de lo que nos devuelve el backend
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
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState<ResultadoProduccion | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Simulamos que estamos viendo la orden #1
    const produccionId = 5; 

    const handleFinalizarProduccion = async () => {
        setLoading(true);
        setError(null);
        setResultado(null);

        try {
            // Hacemos el POST a nuestra ruta de Express
            const response = await api.post(`/${produccionId}/finalizar`);
            setResultado(response.data);
        } catch (err: any) {
            // Capturamos el error si la orden ya está finalizada o no existe
            setError(err.response?.data?.error || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Panel de Producción</h1>
                <p className="text-gray-600 mb-6">Orden de Trabajo #{produccionId}</p>

                {/* Botón de Acción */}
                <button 
                    onClick={handleFinalizarProduccion}
                    disabled={loading}
                    className={`px-6 py-2 rounded font-semibold text-white transition-colors
                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Procesando...' : 'Finalizar Producción'}
                </button>

                {/* Mensaje de Error */}
                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-300">
                        {error}
                    </div>
                )}

                {/* Tabla de Resultados (Activos Generados) */}
                {resultado && (
                    <div className="mt-8">
                        <div className="p-4 bg-green-100 text-green-800 rounded-md mb-4 border border-green-300">
                            <strong>¡Éxito!</strong> {resultado.mensaje} ({resultado.cantidadGenerada} activos)
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