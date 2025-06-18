let estado = -1; // -1: Página Inicial, 0: Início do Jogo, 1: Plantio, etc.

let milho = {
  plantado: false,
  regado: false,
  crescido: 0, // Controla o crescimento visual
  colhido: false,
  processado: false,
  naCidade: false,
  consumido: false,
  descartado: false,
  reciclado: false
};

let botaoAtual; // Variável para armazenar o botão atualmente exibido

// Texto explicativo para a página inicial
const textoIntroducao = "O Agrinho tem como objetivo mostrar de forma clara e educativa a importância do campo e da agricultura para a vida nas cidades. Através de atividades interativas, os estudantes aprendem sobre temas como sustentabilidade, produção de alimentos e o ciclo agrícola. Um dos principais destaques é o ciclo do milho, que é uma das maiores riquezas do Brasil. Desde o plantio até o consumo, o milho passa por várias etapas que movimentam a economia, geram empregos e ajudam no crescimento do país.";

function setup() {
  createCanvas(600, 400); // Aumentei o tamanho do canvas para melhor visualização
  textAlign(CENTER, CENTER);
}

function draw() {
  background(220);

  // Garante que o botão seja removido a cada frame se não houver um estado que o crie
  if (botaoAtual && !deveExibirBotaoParaEstadoAtual()) {
    removerBotao();
  }

  // Define a cor do texto para verde escuro (RGB: 0, 100, 0)
  fill(0, 100, 0);

  if (estado === -1) { // Página Inicial
    textSize(20);
    // Título da introdução
    text("Bem-vindo ao Ciclo do Milho com Agrinho!", width / 2, height / 4);

    textSize(14);
    // Ajuste aqui para centralizar o texto da introdução
    let textWidth = width * 0.7; // 70% da largura do canvas
    let textX = width / 2; // Centraliza horizontalmente
    let textY = height / 2 - 20; // Posição Y inicial (ajustável)

    // A função 'text' com 4 argumentos espera x, y, largura, altura
    // Para centralizar verticalmente, precisamos estimar a altura do texto
    // e ajustar o Y. 'textAscent()' e 'textDescent()' podem ajudar.
    // Para simplificar, vamos ajustar 'textY' manualmente e garantir que a altura seja suficiente.
    let textHeightEstimate = textAscent() + textDescent() + (textoIntroducao.split('\n').length * textLeading()); // Estimativa básica

    text(textoIntroducao, 80, 150, textWidth, height * 0.4); // Largura 70% do canvas, altura 40%

    criarBotao("Começar Jogo", () => {
      avancarEstado(); // Avança para o estado 0 (Início do Jogo)
      removerBotao();
    });
  } else if (estado === 0) {
    textSize(30);
    text("Ciclo do Milho", width / 2, height / 3);
    textSize(18);
    text("Clique para começar", width / 2, height / 2);
  } else if (estado === 1) {
    // Plantio
    textSize(22);
    text("Plantio", width / 2, 40);
    fill(139, 69, 19); // Terra
    rect(width / 3 - 175, 100, 550, 200);
    fill(0, 100, 0); // Semente
    ellipse(width / 2, 170, 15, 15);

    // Redefine a cor para o texto após desenhar as formas
    fill(0, 100, 0);
    if (!milho.plantado) {
      criarBotao("Plantar Milho", () => {
        milho.plantado = true;
        removerBotao();
        // Não avança o estado aqui, espera a próxima ação (Regar)
      });
    } else if (!milho.regado) { // Adicionado um passo explícito para regar após o plantio
      textSize(16);
      text("Milho plantado! Agora regue-o.", width / 2, 280);
      criarBotao("Regar Milho", () => {
        milho.regado = true;
        removerBotao();
        avancarEstado(); // Avança para o crescimento após regar
      });
    }

  } else if (estado === 2) {
    // Crescimento
    textSize(22);
    text("Crescimento", width / 2, 40);
    fill(139, 69, 19); // Terra
    rect(width / 3 - 175, 100, 550, 200);

    // Animação de crescimento do milho
    if (milho.regado && milho.crescido < 1) {
      milho.crescido += 0.005; // Crescimento gradual e mais lento para visualização
    }

    fill(0, 128, 0); // Planta pequena
    // Base da planta
    rect(width / 2 - 10, 240 - (milho.crescido * 80), 20, 10 + (milho.crescido * 80));

    // Folhas (simples)
    if (milho.crescido > 0.3) {
      triangle(width / 2 - 10, 240 - (milho.crescido * 50), width / 2 - 30, 240 - (milho.crescido * 40), width / 2, 240 - (milho.crescido * 60));
      triangle(width / 2 + 10, 240 - (milho.crescido * 50), width / 2 + 30, 240 - (milho.crescido * 40), width / 2, 240 - (milho.crescido * 60));
    }

    // Redefine a cor para o texto após desenhar as formas
    fill(0, 100, 0);
    if (milho.crescido >= 1 && !milho.colhido) {
      textSize(16);
      text("O milho está pronto para a colheita!", width / 2, 280);
      criarBotao("Colher Milho", () => {
        milho.colhido = true;
        removerBotao();
        avancarEstado();
      });
    }

  } else if (estado === 3) {
    // Colheita
    textSize(22);
    text("Colheita", width / 2, 40);
    fill(255, 255, 0); // Milho
    ellipse(width / 2, height / 2 - 20, 40, 80); // Espiga de milho maior
    fill(0, 150, 0); // Palha
    rect(width / 2 - 25, height / 2 + 20, 50, 20, 5); // Base da espiga

    // Redefine a cor para o texto após desenhar as formas
    fill(0, 100, 0);
    textSize(16);
    text("Milho colhido com sucesso!", width / 2, 280);
    criarBotao("Processar Milho", () => {
      milho.processado = true;
      removerBotao();
      avancarEstado();
    });

  } else if (estado === 4) {
    // Processamento
    textSize(22);
    text("Processamento", width / 2, 40);
    fill(192, 192, 192); // Fábrica
    rect(width / 2 - 150, 80, 300, 150);
    fill(100); // Chaminé
    rect(width / 2 + 100, 30, 30, 50);
    fill(255, 228, 196); // Milho processado (embalagem)
    rect(width / 2 - 40, 200, 80, 60, 5); // Embalagem maior

    // Redefine a cor para o texto após desenhar as formas
    fill(0, 100, 0);
    textSize(16);
    text("Milho processado e embalado!", width / 2, 280);
    criarBotao("Enviar para a Cidade", () => {
      milho.naCidade = true;
      removerBotao();
      avancarEstado();
    });

  } else if (estado === 5) {
    // Cidade
    textSize(22);
    text("Na Cidade", width / 2, 40);
    fill(100); // Prédios
    rect(50, 100, 100, 150);
    rect(180, 80, 120, 170);
    rect(320, 120, 100, 130);
    rect(450, 90, 80, 160);
    fill(255, 255, 0); // Milho na cidade (representado por um carrinho de compras ou produto na prateleira)
    rect(width / 2 - 20, 200, 40, 50, 5); // Produto na prateleira

    // Redefine a cor para o texto após desenhar as formas
    fill(0, 100, 0);
    textSize(16);
    text("Milho disponível na cidade!", width / 2, 280);
    criarBotao("Comprar/Consumir", () => {
      milho.consumido = true;
      removerBotao();
      avancarEstado();
    });

  } else if (estado === 6) {
    // Consumo
    textSize(22);
    text("Consumo", width / 2, 40);
    fill(245, 245, 220); // Mesa
    rect(width / 2 - 150, 100, 300, 150);
    fill(255, 255, 0); // Milho consumido (menor, sobras)
    ellipse(width / 2, 170, 25, 40); // Espiga mordida

    // Redefine a cor para o texto após desenhar as formas
    fill(0, 100, 0);
    textSize(16);
    text("O milho foi consumido!", width / 2, 280);
    criarBotao("Descartar Embalagem", () => {
      milho.descartado = true;
      removerBotao();
      avancarEstado();
    });

  } else if (estado === 7) {
    // Descarte/Reciclagem
    textSize(22);
    text("Descarte/Reciclagem", width / 2, 40);
    fill(105, 105, 105); // Lixeira
    rect(width / 2 - 100, 100, 100, 150, 10);
    fill(0, 128, 0); // Símbolo de reciclagem
    beginShape();
    vertex(width / 2 + 50, 150);
    vertex(width / 2 + 70, 130);
    vertex(width / 2 + 70, 170);
    vertex(width / 2 + 50, 190);
    vertex(width / 2 + 30, 170);
    vertex(width / 2 + 30, 130);
    endShape(CLOSE);

    fill(192, 192, 192); // Embalagem descartada
    rect(width / 2 - 70, 200, 40, 50);

    // Redefine a cor para o texto após desenhar as formas
    fill(0, 100, 0);
    if (!milho.reciclado) {
      textSize(16);
      text("O que fazer com a embalagem?", width / 2, 280);
      criarBotao("Reciclar Embalagem", () => {
        milho.reciclado = true;
        removerBotao();
        avancarEstado(); // Avança após reciclar
      });
    }

  } else if (estado === 8) {
    // Fim
    textSize(30);
    text("Fim do Ciclo!", width / 2, height / 2 - 30);
    textSize(20);
    text("Obrigado por acompanhar o ciclo do milho!", width / 2, height / 2 + 10);
    criarBotao("Reiniciar Ciclo", () => {
      estado = -1; // Volta para a página inicial
      // Reinicia o objeto milho para um novo ciclo
      milho = {
        plantado: false,
        regado: false,
        crescido: 0,
        colhido: false,
        processado: false,
        naCidade: false,
        consumido: false,
        descartado: false,
        reciclado: false
      };
      removerBotao();
    });
  }
}

function mouseClicked() {
  if (estado === 0) { // Agora o clique só avança do estado 0 (Início do Jogo)
    avancarEstado();
  }
  // Os cliques nos botões HTML já são gerenciados por suas próprias funções mousePressed
}

function avancarEstado() {
  estado++;
}

// --- Funções de controle do botão ---

function criarBotao(texto, funcao) {
  // Remove qualquer botão existente antes de criar um novo
  if (botaoAtual) {
    botaoAtual.remove();
  }
  botaoAtual = createButton(texto);
  // Centraliza o botão horizontalmente e o posiciona mais para baixo
  botaoAtual.position(width / 2 - botaoAtual.width / 2, height - 70);
  botaoAtual.mousePressed(funcao);
}

function removerBotao() {
  if (botaoAtual) {
    botaoAtual.remove();
    botaoAtual = null; // Limpa a referência do botão
  }
}

// Adicionado uma função para verificar se um botão deve ser exibido no estado atual
function deveExibirBotaoParaEstadoAtual() {
  if (estado === -1) return true; // Botão na página inicial
  if (estado === 1 && (!milho.plantado || !milho.regado)) return true;
  if (estado === 2 && milho.crescido >= 1 && !milho.colhido) return true;
  if (estado === 3 && !milho.processado) return true;
  if (estado === 4 && !milho.naCidade) return true;
  if (estado === 5 && !milho.consumido) return true;
  if (estado === 6 && !milho.descartado) return true;
  if (estado === 7 && !milho.reciclado) return true;
  if (estado === 8) return true; // Botão de reiniciar
  return false;
}