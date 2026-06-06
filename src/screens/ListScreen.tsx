import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../navigation/typesNavigation';
import { carService } from '../services/petService';

import { CarReport } from '../types/pet';
import { appStyles } from '../styles/appStyles';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'List'>;
};

export default function ListScreen({ navigation }: Props) {
  const [cars, setCars] = useState<CarReport[]>([]);

  const loadData = async () => {
    const data = await carService.getCarReports();
    setCars(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    loadData();

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[appStyles.container, { backgroundColor: '#F5E8D0' }]}>
      <TouchableOpacity
        style={[
          appStyles.buttonPrimary,
          {
            backgroundColor: '#8B5E3C',
            borderWidth: 1,
            borderColor: '#5C4033',
          },
        ]}
        onPress={() => navigation.navigate('Form')}
      >
        <Text style={[appStyles.buttonText, { color: '#FFF8E7' }]}>
          + Registrar Nuevo Carro
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          appStyles.buttonPrimary,
          {
            backgroundColor: '#6B705C',
            marginTop: 0,
            borderWidth: 1,
            borderColor: '#4A4F3A',
          },
        ]}
        onPress={() => navigation.navigate('Stats')}
      >
        <Text style={[appStyles.buttonText, { color: '#FFF8E7' }]}>
          📊 Ver Estadísticas
        </Text>
      </TouchableOpacity>

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              appStyles.card,
              {
                backgroundColor: '#FFF8E7',
                borderColor: '#D9B08C',
                borderWidth: 1,
                borderLeftWidth: 5,
                borderLeftColor: '#8B5E3C',
              },
            ]}
            onPress={() => navigation.navigate('Detail', { car: item })}
          >
            {item.foto && item.foto !== 'sin_foto' ? (
              <Image
                source={{ uri: item.foto }}
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  marginBottom: 10,
                  borderWidth: 2,
                  borderColor: '#D9B08C',
                }}
              />
            ) : null}

            <Text
              style={[
                appStyles.textPrimary,
                {
                  color: '#5C4033',
                  fontSize: 17,
                },
              ]}
            >
              🚗 {item.placa} - {item.marca} {item.modelo}
            </Text>

            <Text style={[appStyles.textSecondary, { color: '#6B4F3A' }]}>
              📍 Ubicación: {item.ubicacion}
            </Text>

            <Text style={[appStyles.textSecondary, { color: '#6B4F3A' }]}>
              🧾 Tipo: {item.tipoReporte}
            </Text>

            <Text style={[appStyles.textSecondary, { color: '#6B4F3A' }]}>
              📅 Fecha: {item.fecha}
            </Text>

            <View
              style={{
                marginTop: 10,
                alignSelf: 'flex-start',
                backgroundColor:
                  item.estado === 'Pendiente'
                    ? '#A44A3F'
                    : item.estado === 'En reparación'
                    ? '#C27C3A'
                    : item.estado === 'Solucionado'
                    ? '#6B705C'
                    : '#8B5E3C',
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 20,
              }}
            >
              <Text
                style={[
                  appStyles.statusBadge,
                  {
                    color: '#FFF8E7',
                    fontWeight: 'bold',
                  },
                ]}
              >
                Estado: {item.estado}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text
            style={[
              appStyles.emptyText,
              {
                color: '#5C4033',
                marginTop: 40,
                fontWeight: 'bold',
              },
            ]}
          >
            No hay reportes de carros registrados.
          </Text>
        }
      />
    </View>
  );
}