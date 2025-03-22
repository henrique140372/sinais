const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_GROUP_IDS;
const bot = new TelegramBot(telegramToken);

function gerarRecomendacao() {
  const frases = [
    '⚡ Aproveite agora e entre forte!',
    '🔥 Sinal quente! Próxima rodada recomendada!',
    '💰 Entrada garantida nas próximas jogadas!',
    '🎯 Prepare-se, momento perfeito para apostar!',
  ];
  return frases[Math.floor(Math.random() * frases.length)];
}

async function enviarSinal(jogo) {
  const linkFinal = (jogo.fornecedor.toLowerCase() === 'banana games')
    ? 'https://881bet6.com/?id=418518593&currency=BRL&type=2'
    : jogo.link;

  const taxa = Math.floor(Math.random() * 20) + 80; // taxa entre 80% e 100%
  const mensagem = `
🎰 *SINAL AUTOMÁTICO DETECTADO!*

🎮 *Jogo:* ${jogo.nome}
🏢 *Fornecedor:* ${jogo.fornecedor} ${jogo.fornecedor === 'pgsoft' ? '🍀' : jogo.fornecedor === 'spribe' ? '🚀' : '🍌'}
📊 *Chance de acerto:* ${taxa}%
💡 *Recomendação:* _${gerarRecomendacao()}_

🔗 [Jogar Agora](${linkFinal})

⚠️ *Aposte com consciência!*

⏰ Horários pagando hoje:
14:25 | 16:50 | 19:40 | 22:10
`;

  await bot.sendPhoto(chatId, jogo.imagem, { caption: mensagem, parse_mode: 'Markdown' });
}

function gerarSinaisAutomaticos() {
  const jogosColetados = JSON.parse(fs.readFileSync('jogos_coletados.json', 'utf8'));

  // Escolhe 1 jogo aleatório para cada execução (ou envie todos se quiser)
  const jogoAleatorio = jogosColetados[Math.floor(Math.random() * jogosColetados.length)];
  enviarSinal(jogoAleatorio);
}

// Envia sinal a cada 15 minutos:
setInterval(gerarSinaisAutomaticos, 15 * 60 * 1000);

// Também pode rodar manualmente se quiser:
gerarSinaisAutomaticos();
