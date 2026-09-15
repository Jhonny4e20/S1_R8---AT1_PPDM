import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from "react-native";
import { buscarSeries, pesquisarSeries } from "../services/api";

export default function SeriesScreen({ navigation }) {
  const [series, setSeries] = useState([]);
  const [textoBusca, setTextoBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [pesquisando, setPesquisando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarSeries();
  }, []);

  async function carregarSeries() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await buscarSeries();

      setSeries(dados);
    } catch (erro) {
      console.log(erro);

      setErro(
        "Não foi possível carregar as séries."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function pesquisar() {
    if (!textoBusca.trim()) {
      carregarSeries();
      return;
    }

    try {
      setPesquisando(true);
      setErro("");

      const resultados =
        await pesquisarSeries(textoBusca);

      setSeries(resultados);
    } catch (erro) {
      console.log(erro);

      setErro(
        "Não foi possível realizar a pesquisa."
      );
    } finally {
      setPesquisando(false);
    }
  }

  function limparPesquisa() {
    setTextoBusca("");
    carregarSeries();
  }

  function abrirDetalhes(serie) {
    navigation.navigate("Detalhes", {
      serie: serie,
    });
  }

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator
          size="large"
          color="#e50914"
        />
        <Text style={styles.textoCarregando}>
          Carregando séries...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Séries
      </Text>
      <View style={styles.areaBusca}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome de uma série..."
          placeholderTextColor="#888888"
          value={textoBusca}
          onChangeText={setTextoBusca}
          onSubmitEditing={pesquisar}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.botaoPesquisar}
          onPress={pesquisar}
        >
          <Text style={styles.iconeBusca}>
            🔎
          </Text>
        </TouchableOpacity>
      </View>

      {textoBusca.length > 0 && (
        <TouchableOpacity
          style={styles.botaoLimpar}
          onPress={limparPesquisa}
        >
          <Text style={styles.textoLimpar}>
            Mostrar todas as séries
          </Text>
        </TouchableOpacity>
      )}

      {pesquisando ? (
        <View style={styles.carregandoPesquisa}>
          <ActivityIndicator
            size="small"
            color="#e50914"
          />
          <Text style={styles.textoPesquisa}>
            Pesquisando...
          </Text>
        </View>
      ) : series.length === 0 ? (
        <View style={styles.semResultados}>
          <Text style={styles.iconeSemResultado}>
            🔎
          </Text>
          <Text style={styles.textoSemResultado}>
            Nenhuma série encontrada.
          </Text>
          <Text style={styles.subTextoSemResultado}>
            Tente pesquisar por outro nome.
          </Text>

        </View>
      ) : (
        <FlatList
          data={series}
          keyExtractor={(item) =>
            item.id.toString()
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (

            <TouchableOpacity
              style={styles.card}
              onPress={() => abrirDetalhes(item)}
            >

              {item.image ? (
                <Image
                  source={{
                    uri: item.image.medium,
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

              <View style={styles.informacoes}>
                <Text
                  style={styles.nome}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
                <Text style={styles.nota}>
                  ⭐{" "}
                  {item.rating?.average
                    ? item.rating.average
                    : "Sem nota"}
                </Text>
                <Text style={styles.genero}>
                  🎭{" "}
                  {item.genres &&
                  item.genres.length > 0
                    ? item.genres
                        .slice(0, 2)
                        .join(", ")
                    : "Não informado"}
                </Text>
                <Text style={styles.status}>
                  📺{" "}
                  {item.status ||
                    "Não informado"}
                </Text>

                {item.premiered && (
                  <Text style={styles.estreia}>
                    📅 {item.premiered}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    padding: 15,
  },

  titulo: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },

  areaBusca: {
    flexDirection: "row",
    marginBottom: 10,
  },

  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#1c1c1c",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#ffffff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333333",
  },

  botaoPesquisar: {
    width: 50,
    height: 50,
    backgroundColor: "#e50914",
    borderRadius: 10,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  iconeBusca: {
    fontSize: 22,
  },

  botaoLimpar: {
    marginBottom: 10,
  },

  textoLimpar: {
    color: "#e50914",
    fontSize: 15,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#1c1c1c",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    flexDirection: "row",
  },

  imagem: {
    width: 100,
    height: 145,
    borderRadius: 8,
  },

  imagemSemFoto: {
    width: 100,
    height: 145,
    borderRadius: 8,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
  },

  semFoto: {
    color: "#aaaaaa",
    textAlign: "center",
  },

  informacoes: {
    flex: 1,
    padding: 10,
  },

  nome: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 10,
  },

  nota: {
    color: "#ffd700",
    fontSize: 16,
    marginBottom: 8,
  },

  genero: {
    color: "#cccccc",
    fontSize: 15,
    marginBottom: 8,
  },

  status: {
    color: "#cccccc",
    fontSize: 15,
    marginBottom: 8,
  },

  estreia: {
    color: "#cccccc",
    fontSize: 14,
  },

  carregando: {
    flex: 1,
    backgroundColor: "#101010",
    justifyContent: "center",
    alignItems: "center",
  },

  textoCarregando: {
    color: "#ffffff",
    marginTop: 15,
    fontSize: 16,
  },

  carregandoPesquisa: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  textoPesquisa: {
    color: "#ffffff",
    marginLeft: 10,
    fontSize: 16,
  },

  semResultados: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },

  iconeSemResultado: {
    fontSize: 50,
    marginBottom: 15,
  },

  textoSemResultado: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  subTextoSemResultado: {
    color: "#999999",
    fontSize: 15,
    marginTop: 8,
  },

  textoErro: {
    color: "#ffffff",
    fontSize: 17,
    textAlign: "center",
  },
});