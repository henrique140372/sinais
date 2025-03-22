const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_GROUP_IDS;
const bot = new TelegramBot(telegramToken);

// Função para gerar uma recomendação aleatória
function gerarRecomendacao() {
  const frases = [
    '⚡ *Aproveite agora e entre forte!* 💥',
    '🔥 *Sinal quente!* Próxima rodada recomendada! 🔥',
    '💰 *Entrada garantida nas próximas jogadas!* 🤑',
    '🎯 *Prepare-se, momento perfeito para apostar!* 🚀',
    '🎉 *Não perca essa chance! Aposta certeira à vista!* 🎯',
    '⚡ *Bora bombar com essa jogada, é hora de ganhar!* ⚡',
  ];
  return frases[Math.floor(Math.random() * frases.length)];
}

// Função para gerar a mensagem com base no jogo
function gerarMensagem(jogo) {
  // Links fixos da plataforma (agora podemos adicionar múltiplos links)
  const linksPlataformas = [
    'https://881bet6.com/?id=418518593&currency=BRL&type=2',
    'https://vera.bet.br?ref=c963b06331d8',
    'https://www.707bet19.com/?id=296771300&currency=BRL&type=2',
  ];
  const linkFinal = linksPlataformas[Math.floor(Math.random() * linksPlataformas.length)]; // Escolhe um link aleatório

  // Gera uma taxa aleatória entre 80% e 100%
  const taxa = Math.floor(Math.random() * 20) + 80;

  // Personaliza a mensagem com base no fornecedor do jogo
  let recomendacao;
  if (jogo.fornecedor === 'pgsoft') {
    recomendacao = '🎉 *O fornecedor PGSoft está bombando!* 🍀';
  } else if (jogo.fornecedor === 'spribe') {
    recomendacao = '🚀 *Spribe está acelerando a jogada!* 🔥';
  } else {
    recomendacao = '🍌 *Fornecedor genérico, mas bom para uma aposta tranquila!* 🎯';
  }

  const mensagem = `
🎰 *🎯 SINAL AUTOMÁTICO DETECTADO! E essa é quente! 🔥*

🎮 *Jogo:* ${jogo.nome}
🏢 *Fornecedor:* ${jogo.fornecedor} ${jogo.fornecedor === 'pgsoft' ? '🍀' : jogo.fornecedor === 'spribe' ? '🚀' : '🍌'}
📊 *Chance de acerto:* ${taxa}% 😎
💡 *Recomendação:* _${gerarRecomendacao()}_ 

🚨 *Plataforma com bônus de 15 para NOVOS USUÁRIOS!* E paga *MUITO* 🔥💸

⚡ *Depósito Mínimo: 10 BRL* 💵

🔗 *[Jogar Agora!](${linkFinal})*

⚠️ *Aposte com consciência!*

⏰ *Horários pagos hoje:*
14:25 | 16:50 | 19:40 | 22:10

✨ *Não deixe passar essa oportunidade! O lucro está a um clique de distância!* ✨

🔄 *Macete para ganhar:*
1. **Se estiver no Slot 5x Turbo**, jogue até desativar o turbo (cuidado com a banca!).
2. **Desative o Turbo 5x e jogue de forma calma até aparecer a carta**. 🃏
3. **Banca baixa? Jogue com calma!** Não deixe a ganância te levar.
4. **Repita o processo** até sair a cartinha e o prêmio! 💰

🎯 *Lembre-se: jogue na calma, sem pressa! A paciência vai trazer o prêmio!* 🎯

⚠️ *Proibido para menores de 18 anos. Não jogue se for fazer falta.🚫
🙅‍♂️Os ganhos não são garantidos e vale lembrar: o jogo traz vício e pode levar à falência e perda de bens.* ⚠️
`;

  return mensagem;
}

// Função para enviar sinal com informações do jogo
async function enviarSinal(jogo) {
  const mensagem = gerarMensagem(jogo);

  // Envia a foto do jogo com a mensagem
  await bot.sendPhoto(chatId, jogo.imagem, { caption: mensagem, parse_mode: 'Markdown' });
}

// Função para gerar sinais automáticos
function gerarSinaisAutomaticos() {
  // Lê os jogos coletados do arquivo JSON
  const jogosColetados = JSON.parse(fs.readFileSync('jogos_coletados.json', 'utf8'));

  // Escolhe 1 jogo aleatório para cada execução (ou envia todos se preferir)
  const jogoAleatorio = jogosColetados[Math.floor(Math.random() * jogosColetados.length)];
  enviarSinal(jogoAleatorio);
}

// Envia sinal a cada 15 minutos
setInterval(gerarSinaisAutomaticos, 15 * 60 * 1000);

// Também pode rodar manualmente se desejar
gerarSinaisAutomaticos();
