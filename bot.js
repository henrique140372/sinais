const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const express = require('express');
require('dotenv').config();  // Adicionando suporte para variáveis de ambiente

// Carregar variáveis de ambiente
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_GROUP_IDS;
const bot = new TelegramBot(telegramToken, { polling: true });

// Criando servidor express para escutar em uma porta
const app = express();
const port = process.env.PORT || 1000;  // Configura a porta para 1000 ou variável do Render

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
  const taxa = Math.floor(Math.random() * 20) + 80; // Taxa entre 80% e 100%
  const horarios = gerarHorarios(); // Gerar horários aleatórios

  // Construir a mensagem com os dados do jogo
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
${horarios}

✨ *Não deixe passar essa oportunidade! O lucro está a um clique de distância!* ✨

🔄 *Macete para ganhar:*
1. **Se estiver no Slot 5x Turbo**, jogue até desativar o turbo (cuidado com a banca!).
2. **Desative o Turbo 5x e jogue de forma calma até aparecer a carta**. 🃏
3. **Banca baixa? Jogue com calma!** Não deixe a ganância te levar.
4. **Repita o processo** até sair a cartinha e o prêmio! 💰

🎯 *Lembre-se: jogo tem riscos e pode trazer vício e perdas de bens. Não jogue o que não pode perder. Proibido para menores de 18 anos. Jogo de azar não tem garantia de ganhos.* 🎯`;

  // Botões fixos de plataformas
  const botoes = [
    [
      { text: 'Plataforma 1', url: 'https://www.707bet16.com/?id=296771300&currency=BRL&type=2' },
      { text: 'Plataforma 2', url: 'https://vera.bet.br?ref=c963b06331d8' },
    ],
    [
      { text: 'Plataforma 3', url: 'https://4444win11.com/?id=930165648&currency=BRL&type=2' },
      { text: 'Plataforma 4', url: 'https://www.73bet26.com/?id=125201387&currency=BRL&type=2' },
    ],
    [
      { text: 'Lançamento bonus de 15', url: 'https://bet7477.com/?param=2-PQCKCBON' },
      { text: 'Uuzzo bonus de 15', url: 'https://uuzzo33.org/?id=520255229&currency=BRL&type=2' },
    ]
  ];

  try {
    // Envia a foto do jogo com a mensagem e os botões de inline
    await bot.sendPhoto(chatId, jogo.imagem, {
      caption: mensagem,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: botoes
      }
    });
  } catch (error) {
    console.error('Erro ao enviar sinal:', error);
  }
}

// Função para enviar os dados do plataforma.json
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const enviarInformacoes = async () => {
  try {
    if (!fs.existsSync('plataforma.json')) {
      console.error('Arquivo plataforma.json não encontrado.');
      return;
    }

    const dados = JSON.parse(fs.readFileSync('plataforma.json', 'utf8'));
    const aplicativos = dados.aplicativos;
    const lancamentos = dados.lancamentos;

    // Enviando aplicativos
    for (const aplicativo of aplicativos) {
      const mensagemAplicativo = `📱 *${aplicativo.nome}*
🌐 *Link:* [Baixar](${aplicativo.url})
💰 *Bônus:* ${aplicativo.bonus}
📝 *Descrição:* ${aplicativo.descricao}`;

      try {
        await bot.sendPhoto(chatId, aplicativo.imagem, {
          caption: mensagemAplicativo,
          parse_mode: 'Markdown',
        });
        await sleep(2000);
      } catch (error) {
        console.error(`Erro ao enviar o app ${aplicativo.nome}:`, error);
      }
    }

    // Enviando cada lançamento
    for (const lancamento of lancamentos) {
      const mensagemLancamento = `🎉 *${lancamento.bonus_cadastro}*
🔄 *Rollover:* ${lancamento.rolove_25x}
🎰 *Slots:* ${lancamento.somente_slots_pg_soft}
💵 *Saque Free:* ${lancamento.saca_free}
📉 *Depósito/Saque mínimo:* ${lancamento.deposito_saque_minimo}
🔗 *Link:* [Acesse aqui](${lancamento.link})`;

      try {
        await bot.sendPhoto(chatId, lancamento.imagem, {
          caption: mensagemLancamento,
          parse_mode: 'Markdown',
        });
        await sleep(2000);
      } catch (error) {
        console.error(`Erro ao enviar lançamento ${lancamento.bonus_cadastro}:`, error);
      }
    }

    console.log('✅ Todos os aplicativos e lançamentos foram enviados!');

  } catch (error) {
    console.error('Erro geral no envio:', error);
  }
};

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

// Envia sinais e informações a cada 15 minutos (1 minuto no exemplo)
setInterval(() => {
  gerarSinaisAutomaticos();
  enviarInformacoes(); // Corrigido para chamar enviarInformacoes
}, 1 * 60 * 1000);

// Também pode rodar manualmente se quiser:
gerarSinaisAutomaticos();
enviarInformacoes(); // Corrigido para chamar enviarInformacoes

// Rota principal para verificar se o bot está rodando
app.get('/', (req, res) => {
  res.send('Bot está rodando.');
});

// Mantém o serviço "acordado" no Render
setInterval(() => {
  require('https').get(process.env.RENDER_EXTERNAL_URL);
}, 1 * 60 * 1000); // Pinga a cada 10 minutos (ajustei para 10 minutos)

// Inicia o servidor
app.listen(port, () => {
  console.log(`Bot ouvindo na porta ${port}`);
});
