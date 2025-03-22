const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Carregar variáveis de ambiente
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_GROUP_IDS;
const bot = new TelegramBot(telegramToken, { polling: true });

// Função para gerar recomendações aleatórias
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

// Função para enviar o sinal com informações do jogo
async function enviarSinal(jogo, links) {
  // Link fixo da plataforma que será enviado sempre, independentemente do fornecedor
  const linkFinal = 'https://881bet6.com/?id=418518593&currency=BRL&type=2';

  const taxa = Math.floor(Math.random() * 20) + 80; // Taxa entre 80% e 100%
  const mensagem = 
`🎰 *🎯 SINAL AUTOMÁTICO DETECTADO! E essa é quente! 🔥*

🎮 *Jogo:* ${jogo.nome}
🏢 *Fornecedor:* ${jogo.fornecedor} ${jogo.fornecedor === 'pgsoft' ? '🍀' : jogo.fornecedor === 'spribe' ? '🚀' : '🍌'}
📊 *Chance de acerto:* ${taxa}% 😎
💡 *Recomendação:* _${gerarRecomendacao()}_

🚨 *Plataforma com bônus de 15 para NOVOS USUÁRIOS!* E paga *MUITO* 🔥💸

⚡ *Depósito Mínimo: 10 BRL* 💵

🔗 *[Jogar Agora!](https://881bet6.com/?id=418518593&currency=BRL&type=2)*

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
🙅‍♂️Os ganhos não são garantidos e vale lembrar: o jogo traz vício e pode levar à falência e perda de bens.* ⚠️`;

  try {
    // Enviar foto do jogo com a mensagem
    await bot.sendPhoto(chatId, jogo.imagem, { caption: mensagem, parse_mode: 'Markdown' });

    // Enviar múltiplos links, se houver
    if (links && links.length > 0) {
      const linksMessage = links.map(link => `🔗 *[Clique aqui para acessar](${link})*`).join('\n');
      await bot.sendMessage(chatId, linksMessage, { parse_mode: 'Markdown' });
    }

  } catch (error) {
    console.error('Erro ao enviar sinal:', error);
  }
}

// Função para gerar sinais automáticos
function gerarSinaisAutomaticos() {
  try {
    const jogosColetados = JSON.parse(fs.readFileSync('jogos_coletados.json', 'utf8'));

    // Escolhe 1 jogo aleatório para cada execução (ou envie todos se quiser)
    const jogoAleatorio = jogosColetados[Math.floor(Math.random() * jogosColetados.length)];

    // Links adicionais que podem ser enviados junto com a mensagem
    const linksAdicionais = [
      'https://link1.com',
      'https://link2.com',
      'https://link3.com'
    ];

    enviarSinal(jogoAleatorio, linksAdicionais);
  } catch (error) {
    console.error('Erro ao ler ou processar os jogos:', error);
  }
}

// Envia sinal a cada 15 minutos
setInterval(gerarSinaisAutomaticos, 1 * 60 * 1000);

// Também pode rodar manualmente se quiser:
gerarSinaisAutomaticos();
