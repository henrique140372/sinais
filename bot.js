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

// Função para gerar horários aleatórios
function gerarHorariosAleatorios() {
  const horarios = [];
  const quantidadeHorarios = 6; // Quantidade de horários que vão aparecer
  let horaAtual = 9; // Início às 09h
  for (let i = 0; i < quantidadeHorarios; i++) {
    const minutos = Math.floor(Math.random() * 12) * 5; // minutos múltiplos de 5
    const horaFormatada = `${horaAtual.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    horarios.push(horaFormatada);
    horaAtual += Math.floor(Math.random() * 2) + 2; // Avança entre 2 e 3 horas
    if (horaAtual > 22) break; // Não passar de 22h
  }
  return horarios.join(' | ');
}

// Função para enviar o sinal com informações do jogo
async function enviarSinal(jogo) {
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
${gerarHorariosAleatorios()}

✨ *Não deixe passar essa oportunidade! O lucro está a um clique de distância!* ✨

🔄 *Macete para ganhar:*
1. **Se estiver no Slot 5x Turbo**, jogue até desativar o turbo (cuidado com a banca!).
2. **Desative o Turbo 5x e jogue de forma calma até aparecer a carta**. 🃏
3. **Banca baixa? Jogue com calma!** Não deixe a ganância te levar.
4. **Repita o processo** até sair a cartinha e o prêmio! 💰

🎯 *Lembre-se: jogo na calma, sem pressa! A paciência vai trazer o prêmio!* 🎯
⚠️ *Proibido para menores de 18 anos. Não jogue se for fazer falta.*🚫
🙅‍♂️*Os ganhos não são garantidos e vale lembrar: o jogo traz vício e pode levar à falência e perda de bens.* ⚠️`;

  try {
    await bot.sendPhoto(chatId, jogo.imagem, { caption: mensagem, parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Erro ao enviar sinal:', error);
  }
}

// Função para gerar sinais automáticos
function gerarSinaisAutomaticos() {
  try {
    const jogosColetados = JSON.parse(fs.readFileSync('jogos_coletados.json', 'utf8'));
    const jogoAleatorio = jogosColetados[Math.floor(Math.random() * jogosColetados.length)];
    enviarSinal(jogoAleatorio);
  } catch (error) {
    console.error('Erro ao ler ou processar os jogos:', error);
  }
}

// Envia sinal a cada 15 minutos (ou altere o tempo se quiser)
setInterval(gerarSinaisAutomaticos, 15 * 60 * 1000);

// Também roda imediatamente ao iniciar
gerarSinaisAutomaticos();
