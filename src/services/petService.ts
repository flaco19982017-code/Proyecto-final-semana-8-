import { getDB } from '../database/database';
import { CarReport } from '../types/pet';

export const carService = {
  addCarReport: async (car: CarReport): Promise<void> => {
    const db = await getDB();

    await db.runAsync(
      `INSERT INTO reportes_carros 
      (
        placa, marca, modelo, color, anio, propietario, telefono,
        ubicacion, tipoReporte, estado, foto, fecha, observaciones
      ) 
      VALUES 
      (
        $placa, $marca, $modelo, $color, $anio, $propietario, $telefono,
        $ubicacion, $tipoReporte, $estado, $foto, $fecha, $observaciones
      )`,
      {
        $placa: car.placa || '',
        $marca: car.marca || '',
        $modelo: car.modelo || '',
        $color: car.color || '',
        $anio: car.anio || '',
        $propietario: car.propietario || '',
        $telefono: car.telefono || '',
        $ubicacion: car.ubicacion || '',
        $tipoReporte: car.tipoReporte || 'Reporte general',
        $estado: car.estado || 'Pendiente',
        $foto: car.foto || 'sin_foto',
        $fecha: car.fecha || new Date().toISOString().split('T')[0],
        $observaciones: car.observaciones || '',
      }
    );
  },

  getCarReports: async (): Promise<CarReport[]> => {
    try {
      const db = await getDB();

      const result = await db.getAllAsync(
        'SELECT * FROM reportes_carros ORDER BY id DESC'
      ) as any[];

      return result.map(row => ({
        id: row.id,
        placa: row.placa,
        marca: row.marca,
        modelo: row.modelo,
        color: row.color,
        anio: row.anio,
        propietario: row.propietario,
        telefono: row.telefono,
        ubicacion: row.ubicacion,
        tipoReporte: row.tipoReporte,
        estado: row.estado,
        foto: row.foto,
        fecha: row.fecha,
        observaciones: row.observaciones,
      }));
    } catch (error) {
      console.error("Error obteniendo reportes de carros:", error);
      return [];
    }
  },

  updateCarStatus: async (
    id: number,
    nuevoEstado: string,
    observaciones: string
  ): Promise<void> => {
    if (!id) throw new Error("ID inválido");

    const db = await getDB();

    await db.runAsync(
      `UPDATE reportes_carros 
       SET estado = $estado, observaciones = $observaciones 
       WHERE id = $id`,
      {
        $estado: nuevoEstado,
        $observaciones: observaciones,
        $id: id,
      }
    );
  },

  deleteCarReport: async (id: number): Promise<void> => {
    if (!id) throw new Error("ID inválido");

    const db = await getDB();

    await db.runAsync(
      'DELETE FROM reportes_carros WHERE id = $id',
      {
        $id: id,
      }
    );
  },
};