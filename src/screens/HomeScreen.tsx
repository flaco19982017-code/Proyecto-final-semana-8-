import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../navigation/typesNavigation';
import { carService } from '../services/petService';

import { appStyles } from '../styles/appStyles';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    revision: 0,
    reparacion: 0,
    solucionados: 0,
  });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadStats = async () => {
        setLoading(true);

        const data = await carService.getCarReports();

        if (isActive) {
          setStats({
            total: data.length,
            pendientes: data.filter(c => c.estado === 'Pendiente').length,
            revision: data.filter(c => c.estado === 'En revisión').length,
            reparacion: data.filter(c => c.estado === 'En reparación').length,
            solucionados: data.filter(c => c.estado === 'Solucionado').length,
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

  return (
    <ScrollView style={[appStyles.container, { backgroundColor: '#F5E8D0' }]}>
      <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 25 }}>
        <Image
          source={{
            uri: 'https://www.suzuki.com.pe/media/34zmwssu/modelos-de-carros-y-camionetas-suzuki-para-familias-2.webp',
          }}
          style={{
            width: 155,
            height: 155,
            borderRadius: 80,
            marginBottom: 15,
            borderWidth: 4,
            borderColor: '#8B5E3C',
          }}
        />

        <Text
          style={[
            appStyles.title,
            {
              textAlign: 'center',
              fontSize: 26,
              color: '#5C4033',
            },
          ]}
        >
          Sistema de Registro de Carros
        </Text>

        <Text
          style={[
            appStyles.textSecondary,
            {
              textAlign: 'center',
              paddingHorizontal: 10,
              marginTop: 8,
              lineHeight: 22,
              fontSize: 15,
              color: '#6B4F3A',
            },
          ]}
        >
          Aplicación móvil para registrar carros de tu mecanica.
        </Text>
      </View>

      <TouchableOpacity
        style={[
          appStyles.buttonPrimary,
          {
            backgroundColor: '#8B5E3C',
            paddingVertical: 18,
            marginBottom: 35,
            elevation: 4,
            borderWidth: 1,
            borderColor: '#5C4033',
          },
        ]}
        onPress={() => navigation.navigate('List')}
      >
        <Text style={[appStyles.buttonText, { fontSize: 18, color: '#FFF8E7' }]}>
          🚗 Registro de nuevo vehículo
        </Text>
      </TouchableOpacity>

      <View style={{ paddingBottom: 30 }}>
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
          Resumen Actual
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#8B5E3C" />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={[
                appStyles.card,
                {
                  width: '100%',
                  backgroundColor: '#5C4033',
                  alignItems: 'center',
                  borderColor: '#8B5E3C',
                },
              ]}
            >
              <Text style={{ color: '#FFF8E7', fontSize: 16, fontWeight: 'bold' }}>
                Total de Reportes
              </Text>

              <Text style={{ color: '#FFF8E7', fontSize: 36, fontWeight: 'bold' }}>
                {stats.total}
              </Text>
            </View>

            <View
              style={[
                appStyles.card,
                {
                  width: '48%',
                  borderTopWidth: 4,
                  borderTopColor: '#A44A3F',
                  padding: 12,
                  backgroundColor: '#FFF8E7',
                },
              ]}
            >
              <Text style={[appStyles.textSecondary, { color: '#5C4033' }]}>
                Pendientes
              </Text>

              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#A44A3F' }}>
                {stats.pendientes}
              </Text>
            </View>

            <View
              style={[
                appStyles.card,
                {
                  width: '48%',
                  borderTopWidth: 4,
                  borderTopColor: '#6B705C',
                  padding: 12,
                  backgroundColor: '#FFF8E7',
                },
              ]}
            >
              <Text style={[appStyles.textSecondary, { color: '#5C4033' }]}>
                En revisión
              </Text>

              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#6B705C' }}>
                {stats.revision}
              </Text>
            </View>

            <View
              style={[
                appStyles.card,
                {
                  width: '48%',
                  borderTopWidth: 4,
                  borderTopColor: '#C27C3A',
                  padding: 12,
                  backgroundColor: '#FFF8E7',
                },
              ]}
            >
              <Text style={[appStyles.textSecondary, { color: '#5C4033' }]}>
                En reparación
              </Text>

              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#C27C3A' }}>
                {stats.reparacion}
              </Text>
            </View>

            <View
              style={[
                appStyles.card,
                {
                  width: '48%',
                  borderTopWidth: 4,
                  borderTopColor: '#6B705C',
                  padding: 12,
                  backgroundColor: '#FFF8E7',
                },
              ]}
            >
              <Text style={[appStyles.textSecondary, { color: '#5C4033' }]}>
                Solucionados
              </Text>

              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#6B705C' }}>
                {stats.solucionados}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}