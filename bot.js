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
async function enviarPlataformas() {
  try {
    const dados = JSON.parse(fs.readFileSync('plataforma.json', 'utf8'));
    const plataformas = dados.plataformas;

    plataformas.forEach(async (plataforma) => {
      const mensagemPlataforma = `🚀 *Plataforma:* ${plataforma.nome}
🌐 *Link:* [${plataforma.nome}](${plataforma.url})

📢 *Descrição:* ${plataforma.descricao}
💰 *Depósito Mínimo:* ${plataforma.deposito_minimo}
💸 *Saques Mínimo:* ${plataforma.saques_minimo}
💥 *Taxa de Saque:* ${plataforma.taxa_saque}
📈 *Lucros Diários:* ${plataforma.lucros_diarios}

🎁 *Bônus:*
${plataforma.bônus.map(bonus => `- ${bonus.nome}: ${bonus.detalhes}`).join('\n')}

🔄 *Indicação:*
${plataforma.indicacao.map(ind => `- ${ind.nivel}: ${ind.percentual}`).join('\n')}

🔗 *Cadastro:* [Clique aqui para se cadastrar](${plataforma.link_cadastro})

📷 *Imagem:* ${plataforma.imagem}`;

      const botoesPlataforma = [
        [
          { text: 'Ir para a plataforma', url: plataforma.url },
          { text: 'Cadastro', url: plataforma.link_cadastro }
        ]
      ];

      try {
        // Envia a plataforma com o link, descrição e bônus, incluindo a imagem
        await bot.sendPhoto(chatId, plataforma.imagem, {
          caption: mensagemPlataforma,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: botoesPlataforma
          }
        });
      } catch (error) {
        console.error('Erro ao enviar plataforma:', error);
      }
    });
  } catch (error) {
    console.error('Erro ao ler plataforma.json:', error);
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

// Envia sinais e plataformas a cada 15 minutos (1 minuto no exemplo)
setInterval(() => {
  gerarSinaisAutomaticos();
  enviarPlataformas();
}, 1 * 60 * 1000);

// Também pode rodar manualmente se quiser:
gerarSinaisAutomaticos();
enviarPlataformas();

// Definir a rota para o servidor Express
app.listen(port, () => {
  console.log(`Bot ouvindo na porta ${port}`);
});
