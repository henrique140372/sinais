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
function gerarHorarios() {
  const horarios = [];
  for (let i = 0; i < 5; i++) { // Gera 5 horários aleatórios
    const hora = Math.floor(Math.random() * (22 - 10 + 1)) + 10; // Horas entre 10h e 22h
    const minuto = Math.floor(Math.random() * 60); // Minutos aleatórios
    const horario = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
    horarios.push(horario);
  }
  return horarios.join(' | ');
}

// Função para enviar o sinal com informações do jogo
async function enviarSinal(jogo) {
  // Link fixo da plataforma principal
  const linkFinal = 'https://881bet6.com/?id=418518593&currency=BRL&type=2';
  
  // Outros links de plataformas que você deseja incluir
  const outrosLinks = [
    'https://www.707bet16.com/?id=296771300&currency=BRL&type=2',
    'https://vera.bet.br?ref=c963b06331d8',
    'https://4444win11.com/?id=930165648&currency=BRL&type=2',
  ];

  const taxa = Math.floor(Math.random() * 20) + 80; // Taxa entre 80% e 100%
  const horarios = gerarHorarios(); // Gerar horários aleatórios

  // Construir a mensagem incluindo múltiplos links de plataformas
  const mensagem = 
`🎰 *🎯 SINAL AUTOMÁTICO DETECTADO! E essa é quente! 🔥*

🎮 *Jogo:* ${jogo.nome}
🏢 *Fornecedor:* ${jogo.fornecedor} ${jogo.fornecedor === 'pgsoft' ? '🍀' : jogo.fornecedor === 'spribe' ? '🚀' : '🍌'}
📊 *Chance de acerto:* ${taxa}% 😎
💡 *Recomendação:* _${gerarRecomendacao()}_

🚨 *Plataforma com bônus de 15 para NOVOS USUÁRIOS!* E paga *MUITO* 🔥💸

⚡ *Depósito Mínimo: 10 BRL* 💵

🔗 *[Jogar Agora!](https://881bet6.com/?id=418518593&currency=BRL&type=2)*

🔗 *Outras Plataformas:* 
[Plataforma 1](https://www.707bet16.com/?id=296771300&currency=BRL&type=2)
[Plataforma 2](https://vera.bet.br?ref=c963b06331d8)
[Plataforma 3](https://4444win11.com/?id=930165648&currency=BRL&type=2)

⚠️ *Aposte com consciência!*

⏰ *Horários pagos hoje:*
${horarios}

✨ *Não deixe passar essa oportunidade! O lucro está a um clique de distância!* ✨

🔄 *Macete para ganhar:*
1. **Se estiver no Slot 5x Turbo**, jogue até desativar o turbo (cuidado com a banca!).
2. **Desative o Turbo 5x e jogue de forma calma até aparecer a carta**. 🃏
3. **Banca baixa? Jogue com calma!** Não deixe a ganância te levar.
4. **Repita o processo** até sair a cartinha e o prêmio! 💰

🎯 *Lembre-se: jogo tem riscos e pode trazer vício e perdas de bens. Não jogue o que não pode perder. Proibido para menores de 18 anos. Jogo de azar não tem garantia de ganhos.* 🎯`;

  try {
    // Envia a foto do jogo com a mensagem
    await bot.sendPhoto(chatId, jogo.imagem, { caption: mensagem, parse_mode: 'Markdown' });
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
    enviarSinal(jogoAleatorio);
  } catch (error) {
    console.error('Erro ao ler ou processar os jogos:', error);
  }
}

// Envia sinal a cada 15 minutos (1 minuto no exemplo)
setInterval(gerarSinaisAutomaticos, 1 * 60 * 1000);

// Também pode rodar manualmente se quiser:
gerarSinaisAutomaticos();
