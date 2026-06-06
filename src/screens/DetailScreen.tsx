import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../navigation/typesNavigation';
import { carService } from '../services/petService';
import { appStyles } from '../styles/appStyles';

type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>;

type Props = {
  route: DetailRouteProp;
  navigation: StackNavigationProp<RootStackParamList, 'Detail'>;
};

export default function DetailScreen({ route, navigation }: Props) {
  const { car } = route.params;

  const [estadoActual, setEstadoActual] = useState(car.estado);
  const [observaciones, setObservaciones] = useState(car.observaciones || '');

  const handleActualizarEstado = async (nuevoEstado: string) => {
    if (observaciones.trim().length < 5) {
      Alert.alert(
        'Información requerida',
        'Ingrese una observación sobre el cambio de estado.'
      );
      return;
    }

    try {
      await carService.updateCarStatus(car.id!, nuevoEstado, observaciones);
      setEstadoActual(nuevoEstado);

      Alert.alert('Actualizado', `Reporte marcado como: ${nuevoEstado}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado.');
    }
  };

  const handleEliminar = async () => {
    Alert.alert(
      'Eliminar reporte',
      '¿Seguro que desea eliminar este reporte de carro?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await carService.deleteCarReport(car.id!);
              Alert.alert('Eliminado', 'El reporte ha sido borrado.');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el reporte.');
            }
          },
        },
      ]
    );
  };

  const getEstadoColor = () => {
    switch (estadoActual) {
      case 'Pendiente':
        return '#A44A3F'; // rojo ladrillo
      case 'En revisión':
        return '#6B705C'; // verde oliva
      case 'En reparación':
        return '#C27C3A'; // naranja arcilla
      case 'Solucionado':
        return '#6B705C'; // verde oliva
      case 'Archivado':
        return '#8B5E3C'; // café madera
      default:
        return '#5C4033'; // café oscuro
    }
  };

  return (
    <ScrollView
      style={[appStyles.container, { backgroundColor: '#F5E8D0' }]}
      keyboardShouldPersistTaps="handled"
    >
      <View
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
      >
        {car.foto && car.foto !== 'sin_foto' ? (
          <Image
            source={{ uri: car.foto }}
            style={{
              width: '100%',
              height: 250,
              borderRadius: 10,
              marginBottom: 15,
              borderWidth: 2,
              borderColor: '#D9B08C',
            }}
          />
        ) : null}

        <Text
          style={[
            appStyles.title,
            {
              color: '#5C4033',
              fontSize: 22,
              textAlign: 'center',
            },
          ]}
        >
          {car.placa} - {car.marca} {car.modelo}
        </Text>

        <Text style={[appStyles.textSecondary, { color: '#6B4F3A' }]}>
          🎨 Color: {car.color}
        </Text>

        <Text style={[appStyles.textSecondary, { color: '#6B4F3A' }]}>
          📅 Año: {car.anio}
        </Text>

        <Text style={[appStyles.textSecondary, { color: '#6B4F3A' }]}>
          👤 Propietario: {car.propietario}
        </Text>

        <Text style={[appStyles.textSecondary, { color: '#6B4F3A' }]}>
          📞 Teléfono: {car.telefono}
        </Text>

        <Text style={[appStyles.textSecondary, { color: '#6B4F3A' }]}>
          📍 Ubicación: {car.ubicacion}
        </Text>

        <Text style={[appStyles.textSecondary, { color: '#6B4F3A' }]}>
          🧾 Tipo de reporte: {car.tipoReporte}
        </Text>

        <Text style={[appStyles.textSecondary, { color: '#6B4F3A' }]}>
          📆 Fecha: {car.fecha}
        </Text>

        <View
          style={{
            marginTop: 15,
            alignSelf: 'flex-start',
            backgroundColor: getEstadoColor(),
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              color: '#FFF8E7',
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            Estado actual: {estadoActual}
          </Text>
        </View>

        {observaciones ? (
          <Text
            style={[
              appStyles.textSecondary,
              {
                fontStyle: 'italic',
                marginTop: 12,
                color: '#5C4033',
                backgroundColor: '#F5E8D0',
                padding: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#D9B08C',
              },
            ]}
          >
            📝 Observaciones: {observaciones}
          </Text>
        ) : null}
      </View>

      <View style={{ marginTop: 10, marginBottom: 40 }}>
        <Text
          style={[
            appStyles.textSecondary,
            {
              marginBottom: 10,
              textAlign: 'center',
              color: '#5C4033',
              fontWeight: 'bold',
              fontSize: 16,
            },
          ]}
        >
          Cambiar estado del reporte
        </Text>

        <Text
          style={[
            appStyles.textSecondary,
            {
              marginBottom: 5,
              color: '#6B4F3A',
            },
          ]}
        >
          Información de seguimiento:
        </Text>

        <TextInput
          style={[
            appStyles.input,
            {
              height: 80,
              textAlignVertical: 'top',
              backgroundColor: '#FFF8E7',
              borderColor: '#D9B08C',
              color: '#5C4033',
            },
          ]}
          placeholder="Ej: Vehículo revisado, pendiente de repuestos..."
          placeholderTextColor="#8B5E3C"
          multiline
          value={observaciones}
          onChangeText={setObservaciones}
        />

        {estadoActual === 'Pendiente' && (
          <>
            <TouchableOpacity
              style={[
                appStyles.buttonPrimary,
                {
                  backgroundColor: '#6B705C',
                  borderWidth: 1,
                  borderColor: '#4A4F3A',
                },
              ]}
              onPress={() => handleActualizarEstado('En revisión')}
            >
              <Text style={[appStyles.buttonText, { color: '#FFF8E7' }]}>
                🔍 Marcar como En revisión
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                appStyles.buttonPrimary,
                {
                  backgroundColor: '#C27C3A',
                  borderWidth: 1,
                  borderColor: '#8B5E3C',
                },
              ]}
              onPress={() => handleActualizarEstado('En reparación')}
            >
              <Text style={[appStyles.buttonText, { color: '#FFF8E7' }]}>
                🛠️ Marcar como En reparación
              </Text>
            </TouchableOpacity>
          </>
        )}

        {(estadoActual === 'En revisión' || estadoActual === 'En reparación') && (
          <TouchableOpacity
            style={[
              appStyles.buttonSuccess,
              {
                backgroundColor: '#6B705C',
                borderWidth: 1,
                borderColor: '#4A4F3A',
              },
            ]}
            onPress={() => handleActualizarEstado('Solucionado')}
          >
            <Text style={[appStyles.buttonText, { color: '#FFF8E7' }]}>
              ✅ Marcar como Solucionado
            </Text>
          </TouchableOpacity>
        )}

        {estadoActual !== 'Archivado' && (
          <TouchableOpacity
            style={[
              appStyles.buttonPrimary,
              {
                backgroundColor: '#8B5E3C',
                borderWidth: 1,
                borderColor: '#5C4033',
              },
            ]}
            onPress={() => handleActualizarEstado('Archivado')}
          >
            <Text style={[appStyles.buttonText, { color: '#FFF8E7' }]}>
              📁 Archivar Reporte
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            appStyles.buttonDanger,
            {
              marginTop: 30,
              backgroundColor: '#A44A3F',
              borderWidth: 1,
              borderColor: '#5C4033',
            },
          ]}
          onPress={handleEliminar}
        >
          <Text style={[appStyles.buttonText, { color: '#FFF8E7' }]}>
            🗑️ Eliminar Reporte
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}