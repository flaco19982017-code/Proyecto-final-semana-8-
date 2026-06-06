import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let isInitializing = false;

export const getDB = async () => {
  if (dbInstance) return dbInstance;

  while (isInitializing) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (!dbInstance) {
    isInitializing = true;
    try {
      dbInstance = await SQLite.openDatabaseAsync('reportes_carros_v1.db');
    } finally {
      isInitializing = false;
    }
  }

  return dbInstance;
};

export const initDatabase = async () => {
  try {
    const db = await getDB();

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reportes_carros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        placa TEXT,
        marca TEXT,
        modelo TEXT,
        color TEXT,
        anio TEXT,
        propietario TEXT,
        telefono TEXT,
        ubicacion TEXT,
        tipoReporte TEXT,
        estado TEXT,
        foto TEXT,
        fecha TEXT,
        observaciones TEXT
      );
    `);

    console.log("Base de datos de reportes de carros creada correctamente");
  } catch (error) {
    console.error("Error al crear DB:", error);
  }
};