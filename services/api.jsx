const API_URL = "https://api.tvmaze.com";

export async function buscarSeries() {
  try {
    const resposta = await fetch(`${API_URL}/shows`);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar séries");
    }

    const dados = await resposta.json();

    return dados.slice(0, 100);
  } catch (erro) {
    console.log("Erro ao buscar séries:", erro);

    throw erro;
  }
}

export async function pesquisarSeries(nome) {
  try {
    const texto = encodeURIComponent(nome);

    const resposta = await fetch(
      `${API_URL}/search/shows?q=${texto}`
    );

    if (!resposta.ok) {
      throw new Error("Erro ao pesquisar séries");
    }

    const dados = await resposta.json();

    return dados.map((item) => item.show);
  } catch (erro) {
    console.log("Erro ao pesquisar séries:", erro);

    throw erro;
  }
}

function dividirTexto(texto, tamanhoMaximo = 450) {
  const partes = [];

  let inicio = 0;

  while (inicio < texto.length) {
    let fim = inicio + tamanhoMaximo;

    if (fim < texto.length) {
      const ultimoEspaco = texto.lastIndexOf(" ", fim);

      if (ultimoEspaco > inicio) {
        fim = ultimoEspaco;
      }
    }

    partes.push(
      texto.substring(inicio, fim).trim()
    );

    inicio = fim;
  }

  return partes;
}

export async function traduzirTexto(texto) {
  try {
    if (!texto) {
      return "";
    }

    const textoLimpo = texto
      .replace(/<[^>]*>/g, "")
      .trim();

    if (!textoLimpo) {
      return "";
    }

    const partes = dividirTexto(textoLimpo);

    const traducoes = [];

    for (const parte of partes) {
      const textoCodificado =
        encodeURIComponent(parte);

      const resposta = await fetch(
        `https://api.mymemory.translated.net/get?q=${textoCodificado}&langpair=en|pt`
      );

      if (!resposta.ok) {
        throw new Error(
          "Erro ao traduzir informação"
        );
      }

      const dados = await resposta.json();

      if (
        dados.responseData &&
        dados.responseData.translatedText
      ) {
        traducoes.push(
          dados.responseData.translatedText
        );
      } else {
        traducoes.push(parte);
      }
    }

    return traducoes.join(" ");
  } catch (erro) {
    console.log("Erro ao traduzir:", erro);

    return texto
      .replace(/<[^>]*>/g, "")
      .trim();
  }
}

export async function traduzirSinopse(texto) {
  return await traduzirTexto(texto);
}

export async function traduzirGeneros(generos) {
  if (!generos || generos.length === 0) {
    return "Não informado";
  }

  const traducoes = [];

  for (const genero of generos) {
    const traducao = await traduzirTexto(genero);

    traducoes.push(
      traducao || genero
    );
  }

  return traducoes.join(", ");
}

export async function traduzirStatus(status) {
  const statusTraduzidos = {
    Running: "Em andamento",
    Ended: "Encerrada",
    "To Be Determined": "A definir",
    "In Development": "Em desenvolvimento",
  };

  if (statusTraduzidos[status]) {
    return statusTraduzidos[status];
  }

  if (!status) {
    return "Não informado";
  }

  return await traduzirTexto(status);
}

export async function traduzirPais(pais) {
  if (!pais) {
    return "Não informado";
  }

  return await traduzirTexto(pais);
}