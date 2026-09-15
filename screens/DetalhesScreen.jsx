import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { traduzirSinopse, traduzirGeneros, traduzirStatus, traduzirPais } from "../services/api";

export default function DetalhesScreen({ route }) {
  const { serie } = route.params;
  const [sinopse, setSinopse] = useState("");
  const [generos, setGeneros] = useState("");
  const [status, setStatus] = useState("");
  const [pais, setPais] = useState("");
  const [traduzindo, setTraduzindo] = useState(true);

  useEffect(() => {
    traduzirInformacoes();
  }, []);

  async function traduzirInformacoes() {
    try {
      setTraduzindo(true);
      const nomePais =
        serie.network?.country?.name ||
        serie.webChannel?.country?.name ||
        "";

      const resultadoSinopse =
        serie.summary
          ? await traduzirSinopse(
              serie.summary
            )
          : "Sinopse não disponível.";

      const resultadoGeneros =
        await traduzirGeneros(
          serie.genres
        );

      const resultadoStatus =
        await traduzirStatus(
          serie.status
        );

      const resultadoPais =
        await traduzirPais(
          nomePais
        );

      setSinopse(resultadoSinopse);
      setGeneros(resultadoGeneros);
      setStatus(resultadoStatus);
      setPais(resultadoPais);
    } catch (erro) {
      console.log(
        "Erro ao traduzir informações:",
        erro
      );

      setSinopse(
        "Não foi possível traduzir a sinopse."
      );

      setGeneros(
        serie.genres &&
        serie.genres.length > 0
          ? serie.genres.join(", ")
          : "Não informado"
      );

      setStatus(
        serie.status || "Não informado"
      );

      setPais(
        serie.network?.country?.name ||
        serie.webChannel?.country?.name ||
        "Não informado"
      );
    } finally {
      setTraduzindo(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {serie.image ? (
        <Image
          source={{
            uri: serie.image.original,
          }}
          style={styles.imagem}
        />
      ) : (
        <View style={styles.imagemSemFoto}>
          <Text style={styles.semFoto}>
            Sem imagem
          </Text>
        </View>
      )}

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>
          {serie.name}
        </Text>
        <Text style={styles.informacao}>
          ⭐ Nota:{" "}
          {serie.rating?.average
            ? serie.rating.average
            : "Sem nota"}
        </Text>

        {traduzindo ? (
          <View style={styles.carregando}>
            <ActivityIndicator
              size="small"
              color="#e50914"
            />
            <Text style={styles.textoCarregando}>
              Traduzindo informações...
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.informacao}>
              🎭 Gêneros: {generos}
            </Text>
            <Text style={styles.informacao}>
              📺 Status: {status}
            </Text>
            <Text style={styles.informacao}>
              📅 Estreia:{" "}
              {serie.premiered ||
                "Não informado"}
            </Text>
            <Text style={styles.informacao}>
              🌎 País: {pais}
            </Text>
          </>
        )}

        <Text style={styles.tituloSinopse}>
          Sinopse
        </Text>

        {traduzindo ? (
          <View style={styles.carregando}>
            <ActivityIndicator
              size="small"
              color="#e50914"
            />
            <Text style={styles.textoCarregando}>
              Traduzindo sinopse...
            </Text>
          </View>
        ) : (
          <Text style={styles.sinopse}>
            {sinopse}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },

  imagem: {
    width: "100%",
    height: 500,
    resizeMode: "cover",
  },

  imagemSemFoto: {
    width: "100%",
    height: 300,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
  },

  semFoto: {
    color: "#aaaaaa",
    fontSize: 18,
  },

  conteudo: {
    padding: 20,
  },

  titulo: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  informacao: {
    color: "#dddddd",
    fontSize: 17,
    marginBottom: 12,
  },

  tituloSinopse: {
    color: "#ffffff",
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },

  sinopse: {
    color: "#cccccc",
    fontSize: 16,
    lineHeight: 25,
    paddingBottom: 30,
  },

  carregando: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
  },

  textoCarregando: {
    color: "#cccccc",
    fontSize: 16,
    marginLeft: 10,
  },
});