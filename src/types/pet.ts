export interface CarReport {
  id?: number;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  anio: string;
  propietario: string;
  telefono: string;
  ubicacion: string;
  tipoReporte: string;
  estado: string;
  foto: string;
  fecha: string;
  observaciones?: string;
}