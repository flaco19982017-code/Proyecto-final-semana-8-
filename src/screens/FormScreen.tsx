import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../navigation/typesNavigation";
import { carService } from "../services/petService";
import { geminiCarService } from "../services/geminiCarService";
import { appStyles } from "../styles/appStyles";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Form">;
};

export default function FormScreen({ navigation }: Props) {
  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [anio, setAnio] = useState("");
  const [propietario, setPropietario] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tipoReporte, setTipoReporte] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  const [loadingAi, setLoadingAi] = useState(false);
  const [saving, setSaving] = useState(false);

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permiso.status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita acceso a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    if (!result.canceled) {
      setFotoUri(result.assets[0].uri);
      console.log("Imagen seleccionada:", result.assets[0].uri);
    }
  };

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();

    if (permiso.status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita acceso a la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    if (!result.canceled) {
      setFotoUri(result.assets[0].uri);
      console.log("Foto tomada:", result.assets[0].uri);
    }
  };

  const guardarImagenPermanente = async (
    uri: string | null,
  ): Promise<string> => {
    if (!uri) {
      return "sin_foto";
    }

    try {
      const carpeta = `${FileSystem.documentDirectory}carros/`;
      const infoCarpeta = await FileSystem.getInfoAsync(carpeta);

      if (!infoCarpeta.exists) {
        await FileSystem.makeDirectoryAsync(carpeta, {
          intermediates: true,
        });
      }

      const nombreArchivo = `carro_${Date.now()}.jpg`;
      const nuevaRuta = `${carpeta}${nombreArchivo}`;

      await FileSystem.copyAsync({
        from: uri,
        to: nuevaRuta,
      });

      console.log("Imagen guardada permanentemente:", nuevaRuta);

      return nuevaRuta;
    } catch (error) {
      console.log("Error guardando imagen:", error);
      return uri;
    }
  };

  const handleAutoAnalyze = async () => {
    if (!fotoUri) {
      Alert.alert("Atención", "Primero toma o selecciona una foto del carro.");
      return;
    }

    setLoadingAi(true);

    try {
      const result = await geminiCarService.analyzeCarImage(fotoUri);

      console.log("Resultado IA en FormScreen:", result);

      setMarca(result.marca || "");
      setModelo(result.modelo || "");
      setColor(result.color || "");
      setAnio(result.anio || "");
      setTipoReporte(result.tipoReporte || "Reporte general");
      setObservaciones(result.observaciones || "");

      Alert.alert(
        "Resultado IA",
        `Marca: ${result.marca || "No detectada"}\n` +
          `Modelo: ${result.modelo || "No detectado"}\n` +
          `Color: ${result.color || "No detectado"}\n` +
          `Año: ${result.anio || "No detectado"}`,
      );
    } catch (error) {
      console.log("Error en FormScreen:", error);
      Alert.alert("Error", "No se pudo analizar la imagen con IA.");
    } finally {
      setLoadingAi(false);
    }
  };

  const limpiarFormulario = () => {
    setPlaca("");
    setMarca("");
    setModelo("");
    setColor("");
    setAnio("");
    setPropietario("");
    setTelefono("");
    setUbicacion("");
    setTipoReporte("");
    setObservaciones("");
    setFotoUri(null);
  };

  const handleSave = async () => {
    if (
      placa.trim().length < 3 ||
      marca.trim().length < 2 ||
      modelo.trim().length < 2 ||
      ubicacion.trim().length < 5
    ) {
      Alert.alert(
        "Datos incompletos",
        "Ingrese al menos placa, marca, modelo y ubicación detallada.",
      );
      return;
    }

    setSaving(true);

    try {
      const fechaActual = new Date().toISOString().split("T")[0];
      const fotoGuardada = await guardarImagenPermanente(fotoUri);

      console.log("Foto que se guardará:", fotoGuardada);

      await carService.addCarReport({
        placa: placa.toUpperCase(),
        marca,
        modelo,
        color,
        anio,
        propietario,
        telefono,
        ubicacion,
        tipoReporte: tipoReporte || "Reporte general",
        estado: "Pendiente",
        foto: fotoGuardada,
        fecha: fechaActual,
        observaciones,
      });

      Alert.alert("Guardado", "Reporte de carro registrado correctamente.");
      limpiarFormulario();
      navigation.goBack();
    } catch (error: any) {
      console.error("Error al guardar:", error);
      Alert.alert(
        "Error",
        `No se pudo guardar el reporte: ${
          error.message || "Error desconocido"
        }`,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F5E8D0" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={[appStyles.container, { backgroundColor: "#F5E8D0" }]}
          contentContainerStyle={{ paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={[
              appStyles.title,
              {
                color: "#5C4033",
                textAlign: "center",
                fontSize: 24,
              },
            ]}
          >
            Registro de Reporte de Carro
          </Text>

          <View style={{ alignItems: "center", marginBottom: 15 }}>
            {fotoUri ? (
              <Image
                source={{ uri: fotoUri }}
                style={{
                  width: "100%",
                  height: 210,
                  borderRadius: 12,
                  marginBottom: 10,
                  borderWidth: 2,
                  borderColor: "#D9B08C",
                }}
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  height: 160,
                  backgroundColor: "#FFF8E7",
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                  borderWidth: 2,
                  borderColor: "#D9B08C",
                  borderStyle: "dashed",
                }}
              >
                <Text style={{ color: "#8B5E3C", fontWeight: "bold" }}>
                  Sin fotografía del carro
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                appStyles.buttonPrimary,
                {
                  width: "100%",
                  backgroundColor: "#8B5E3C",
                  borderWidth: 1,
                  borderColor: "#5C4033",
                },
              ]}
              onPress={tomarFoto}
              disabled={loadingAi || saving}
            >
              <Text style={[appStyles.buttonText, { color: "#FFF8E7" }]}>
                📷 Tomar Foto
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                appStyles.buttonPrimary,
                {
                  width: "100%",
                  backgroundColor: "#6B705C",
                  borderWidth: 1,
                  borderColor: "#4A4F3A",
                  opacity: loadingAi ? 0.6 : 1,
                },
              ]}
              onPress={handleAutoAnalyze}
              disabled={loadingAi || saving}
            >
              {loadingAi ? (
                <ActivityIndicator color="#FFF8E7" />
              ) : (
                <Text style={[appStyles.buttonText, { color: "#FFF8E7" }]}>
                  🤖 Analizar foto con IA
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TextInput
            style={[
              appStyles.input,
              {
                backgroundColor: "#FFF8E7",
                borderColor: "#D9B08C",
                color: "#5C4033",
              },
            ]}
            placeholder="Placa del carro"
            placeholderTextColor="#8B5E3C"
            value={placa}
            onChangeText={setPlaca}
            autoCapitalize="characters"
          />

          <TextInput
            style={[
              appStyles.input,
              {
                backgroundColor: "#FFF8E7",
                borderColor: "#D9B08C",
                color: "#5C4033",
              },
            ]}
            placeholder="Marca"
            placeholderTextColor="#8B5E3C"
            value={marca}
            onChangeText={setMarca}
          />

          <TextInput
            style={[
              appStyles.input,
              {
                backgroundColor: "#FFF8E7",
                borderColor: "#D9B08C",
                color: "#5C4033",
              },
            ]}
            placeholder="Modelo"
            placeholderTextColor="#8B5E3C"
            value={modelo}
            onChangeText={setModelo}
          />

          <TextInput
            style={[
              appStyles.input,
              {
                backgroundColor: "#FFF8E7",
                borderColor: "#D9B08C",
                color: "#5C4033",
              },
            ]}
            placeholder="Color"
            placeholderTextColor="#8B5E3C"
            value={color}
            onChangeText={setColor}
          />

          <TextInput
            style={[
              appStyles.input,
              {
                backgroundColor: "#FFF8E7",
                borderColor: "#D9B08C",
                color: "#5C4033",
              },
            ]}
            placeholder="Año"
            placeholderTextColor="#8B5E3C"
            value={anio}
            onChangeText={setAnio}
            keyboardType="numeric"
          />

          <TextInput
            style={[
              appStyles.input,
              {
                backgroundColor: "#FFF8E7",
                borderColor: "#D9B08C",
                color: "#5C4033",
              },
            ]}
            placeholder="Nombre del propietario"
            placeholderTextColor="#8B5E3C"
            value={propietario}
            onChangeText={setPropietario}
          />

          <TextInput
            style={[
              appStyles.input,
              {
                backgroundColor: "#FFF8E7",
                borderColor: "#D9B08C",
                color: "#5C4033",
              },
            ]}
            placeholder="Teléfono"
            placeholderTextColor="#8B5E3C"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <TextInput
            style={[
              appStyles.input,
              {
                backgroundColor: "#FFF8E7",
                borderColor: "#D9B08C",
                color: "#5C4033",
              },
            ]}
            placeholder="Ubicación del reporte"
            placeholderTextColor="#8B5E3C"
            value={ubicacion}
            onChangeText={setUbicacion}
          />

          <TextInput
            style={[
              appStyles.input,
              {
                backgroundColor: "#FFF8E7",
                borderColor: "#D9B08C",
                color: "#5C4033",
              },
            ]}
            placeholder="Tipo de reporte: mantenimiento, accidente, daño, revisión..."
            placeholderTextColor="#8B5E3C"
            value={tipoReporte}
            onChangeText={setTipoReporte}
          />

          <TextInput
            style={[
              appStyles.input,
              {
                height: 90,
                textAlignVertical: "top",
                backgroundColor: "#FFF8E7",
                borderColor: "#D9B08C",
                color: "#5C4033",
              },
            ]}
            placeholder="Observaciones del reporte"
            placeholderTextColor="#8B5E3C"
            value={observaciones}
            onChangeText={setObservaciones}
            multiline
          />

          <TouchableOpacity
            style={[
              appStyles.buttonSuccess,
              {
                marginBottom: 40,
                backgroundColor: "#6B705C",
                borderWidth: 1,
                borderColor: "#4A4F3A",
                opacity: saving || loadingAi ? 0.6 : 1,
              },
            ]}
            onPress={handleSave}
            disabled={saving || loadingAi}
          >
            {saving ? (
              <ActivityIndicator color="#FFF8E7" />
            ) : (
              <Text style={[appStyles.buttonText, { color: "#FFF8E7" }]}>
                Guardar Reporte
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
