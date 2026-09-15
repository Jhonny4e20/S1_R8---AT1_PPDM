import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icone}>
        📺
      </Text>
      <Text style={styles.titulo}>
        TVShowApp
      </Text>
      <Text style={styles.descricao}>
        Encontre informações sobre suas séries
        favoritas!!
      </Text>
      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("Series")}
      >
        <Text style={styles.textoBotao}>
          Ver Séries
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  icone: {
    fontSize: 70,
    marginBottom: 10,
  },

  titulo: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
  },

  descricao: {
    color: "#cccccc",
    fontSize: 17,
    textAlign: "center",
    lineHeight: 25,
    marginBottom: 40,
  },

  botao: {
    backgroundColor: "#e50914",
    paddingVertical: 15,
    paddingHorizontal: 45,
    borderRadius: 10,
  },

  textoBotao: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});