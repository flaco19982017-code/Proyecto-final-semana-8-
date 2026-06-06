import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../navigation/typesNavigation';
import { carService } from '../services/petService';
import { appStyles } from '../styles/appStyles';
import { CarReport } from '../types/pet';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Stats'>;
};

export default function StatsScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [allCars, setAllCars] = useState<CarReport[]>([]);
  const [filtroActivo, setFiltroActivo] = useState<string | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    revision: 0,
    reparacion: 0,
    solucionados: 0,
    archivados: 0,
  });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadStats = async () => {
        setLoading(true);

        const data = await carService.getCarReports();

        if (isActive) {
          setAllCars(data);

          setStats({
            total: data.length,
            pendientes: data.filter(c => c.estado === 'Pendiente').length,
            revision: data.filter(c => c.estado === 'En revisión').length,
            reparacion: data.filter(c => c.estado === 'En reparación').length,
            solucionados: data.filter(c => c.estado === 'Solucionado').length,
            archivados: data.filter(c => c.estado === 'Archivado').length,
          });

          setLoading(false);
        }
      };

      loadStats();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const carrosFiltrados = filtroActivo
    ? allCars.filter(car => car.estado === filtroActivo)
    : [];

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: '#F5E8D0',
        }}
      >
        <ActivityIndicator size="large" color="#8B5E3C" />
      </View>
    );
  }

  return (
    <ScrollView style={[appStyles.container, { backgroundColor: '#F5E8D0' }]}>
      <Text
        style={[
          appStyles.title,
          {
            fontSize: 24,
            color: '#5C4033',
            textAlign: 'center',
          },
        ]}
      >
        Estadísticas de Reportes
      </Text>

      <View
        style={[
          appStyles.card,
          {
            backgroundColor: '#5C4033',
            alignItems: 'center',
            borderColor: '#8B5E3C',
            borderWidth: 1,
          },
        ]}
      >
        <Text style={{ color: '#FFF8E7', fontSize: 16, fontWeight: 'bold' }}>
          Total de Reportes
        </Text>

        <Text style={{ color: '#FFF8E7', fontSize: 38, fontWeight: 'bold' }}>
          {stats.total}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          style={[
            appStyles.card,
            {
              width: '48%',
              borderTopWidth: 4,
              borderTopColor: '#A44A3F',
              backgroundColor: '#FFF8E7',
              borderColor: '#D9B08C',
            },
          ]}
          onPress={() => setFiltroActivo('Pendiente')}
        >
          <Text style={[appStyles.textSecondary, { color: '#5C4033' }]}>
            Pendientes
          </Text>

          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#A44A3F' }}>
            {stats.pendientes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            appStyles.card,
            {
              width: '48%',
              borderTopWidth: 4,
              borderTopColor: '#6B705C',
              backgroundColor: '#FFF8E7',
              borderColor: '#D9B08C',
            },
          ]}
          onPress={() => setFiltroActivo('En revisión')}
        >
          <Text style={[appStyles.textSecondary, { color: '#5C4033' }]}>
            En revisión
          </Text>

          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#6B705C' }}>
            {stats.revision}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            appStyles.card,
            {
              width: '48%',
              borderTopWidth: 4,
              borderTopColor: '#C27C3A',
              backgroundColor: '#FFF8E7',
              borderColor: '#D9B08C',
            },
          ]}
          onPress={() => setFiltroActivo('En reparación')}
        >
          <Text style={[appStyles.textSecondary, { color: '#5C4033' }]}>
            En reparación
          </Text>

          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#C27C3A' }}>
            {stats.reparacion}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            appStyles.card,
            {
              width: '48%',
              borderTopWidth: 4,
              borderTopColor: '#6B705C',
              backgroundColor: '#FFF8E7',
              borderColor: '#D9B08C',
            },
          ]}
          onPress={() => setFiltroActivo('Solucionado')}
        >
          <Text style={[appStyles.textSecondary, { color: '#5C4033' }]}>
            Solucionados
          </Text>

          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#6B705C' }}>
            {stats.solucionados}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            appStyles.card,
            {
              width: '100%',
              borderTopWidth: 4,
              borderTopColor: '#8B5E3C',
              backgroundColor: '#FFF8E7',
              borderColor: '#D9B08C',
            },
          ]}
          onPress={() => setFiltroActivo('Archivado')}
        >
          <Text style={[appStyles.textSecondary, { color: '#5C4033' }]}>
            Archivados
          </Text>

          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#8B5E3C' }}>
            {stats.archivados}
          </Text>
        </TouchableOpacity>
      </View>

      {filtroActivo && (
        <View style={{ marginTop: 20, paddingBottom: 40 }}>
          <Text
            style={[
              appStyles.title,
              {
                fontSize: 18,
                marginBottom: 15,
                color: '#5C4033',
              },
            ]}
          >
            Listado: {filtroActivo} ({carrosFiltrados.length})
          </Text>

          {carrosFiltrados.length === 0 ? (
            <Text
              style={[
                appStyles.emptyText,
                {
                  color: '#5C4033',
                  fontWeight: 'bold',
                },
              ]}
            >
              No hay reportes en este estado.
            </Text>
          ) : (
            carrosFiltrados.map(car => (
              <TouchableOpacity
                key={car.id}
                style={[
                  appStyles.card,
                  {
                    borderLeftWidth: 5,
                    borderLeftColor: '#8B5E3C',
                    backgroundColor: '#FFF8E7',
                    borderColor: '#D9B08C',
                  },
                ]}
                onPress={() => navigation.navigate('Detail', { car })}
              >
                <Text
                  style={[
                    appStyles.textPrimary,
                    {
                      color: '#5C4033',
                      fontSize: 16,
                    },
                  ]}
                >
                  {car.placa} - {car.marca} {car.modelo}
                </Text>

                <Text style={[appStyles.textSecondary, { color: '#6B4F3A' }]}>
                  📍 {car.ubicacion}
                </Text>

                <Text style={[appStyles.textSecondary, { color: '#6B4F3A' }]}>
                  🧾 {car.tipoReporte}
                </Text>

                <Text style={[appStyles.textSecondary, { color: '#6B4F3A' }]}>
                  📅 {car.fecha}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}