# AdSeleto Hub — Copilot para o Claude

Plugin oficial da **AdSeleto** para o Claude. Conecta o Claude à sua conta do [Hub AdSeleto](https://adseleto.com) e ensina ele a operar a plataforma: receita, ranking de sites, Site Explorer, relatórios, audiência, aquisição, precificação, autopilot, wrapper, testes A/B, redirecionamentos e alertas.

**O conector vem junto.** Instalar o plugin já configura o acesso: no primeiro uso, o login do Hub abre sozinho.

## Instalar

No Claude Code:

```bash
/plugin marketplace add AdSeleto/adseleto-ai-plugin
/plugin install adseleto-hub@adseleto-ai
```

No claude.ai e no Claude Desktop, instale pelo diretório de plugins ou conecte o conector **AdSeleto Hub**. Se ele ainda não estiver listado para você, adicione um conector personalizado com o endereço `https://mcp.adseleto.com/v1`.

Na primeira pergunta, o Claude abre o login do Hub. Você entra com a sua conta e clica em Autorizar.

## O que dá pra pedir

Em português, do jeito que você falaria com alguém do time:

**Consultar**
- "Quanto faturei ontem em todos os sites?"
- "Top 10 sites da semana e quais caíram mais."
- "Qual o eCPM do site X nos últimos 30 dias, dia a dia?"
- "Roda o meu relatório de canais do mês passado."

**Diagnosticar**
- "Por que a receita do site X caiu no dia 3?"
- "O ads.txt e o wrapper do site X estão ok?"
- "De onde veio o tráfego do site X essa semana?"

**Ajustar**
- "Sobe o piso das regras do /noticias para 0,40."
- "Liga o autopilot da regra Y com match rate de 70."
- "Volta o wrapper do site X para a versão de ontem."
- "Cria um alerta se o fill rate cair abaixo de 60%."

## Seu acesso é o seu

A autenticação é por OAuth 2.1, com o login do próprio Hub. O plugin não recebe nem guarda sua senha, e nenhuma chave precisa ser configurada.

O Claude enxerga exatamente o que você enxerga no Hub: as empresas e os sites em que você tem acesso, com o mesmo papel. Quem só visualiza numa empresa consegue consultar, mas não alterar. Se uma empresa ou um site não aparecer, é permissão, não falha da ferramenta.

O acesso vale por 1 hora e se renova sozinho por até 30 dias. Para revogar, use a tela **HUB na IA** no Hub. Trocar a senha do Hub revoga todas as conexões na hora.

## O que ele confirma antes de fazer

Consultar é livre. **Toda alteração passa por prévia e confirmação**, e o próprio servidor do Hub obriga isso: a primeira chamada só devolve a prévia (antes e depois) e um código de uso único. A alteração só acontece se você confirmar, com os mesmos dados da prévia, em até 10 minutos.

**Ele mostra a prévia e pede seu "sim" antes de:**

- mudar piso, match rate ou autopilot de regras de preço
- criar regra ou padrão de preço
- mudar piso de regras de fallback
- publicar alteração no wrapper do site ou voltar uma versão
- criar ramificação do wrapper
- criar, pausar, concluir, descartar ou aplicar o vencedor de um teste A/B
- cadastrar site novo ou registrar ad units
- alterar dados do site
- criar, alterar ou remover redirecionamentos e destinos
- criar, editar, ligar ou desligar alertas
- exportar relatório para o Google Sheets (cria uma planilha na sua conta Google)

As alterações feitas pelo Claude entram no histórico de auditoria do Hub, marcadas como vindas da IA.

## O que o plugin acessa e envia

- **Um único servidor:** `https://mcp.adseleto.com/v1`, da AdSeleto. O plugin não se conecta a nenhum outro endereço.
- **O que vai para o servidor:** só os dados de cada pedido, ou seja, os IDs de empresa e de site, as datas, os filtros e os valores da alteração. A conversa, seus arquivos locais e a memória do Claude não são enviados.
- **O que volta:** os dados da sua conta no Hub que você já vê na tela.
- **O que o servidor registra:** para cada chamada, a ferramenta, o usuário, o resultado, o tempo de resposta, os nomes dos campos enviados (não os valores), a empresa e o site. Alterações também vão para o histórico de auditoria do Hub.
- **Efeitos fora do Hub, só quando você pede e confirma:**
  - exportar para o Google Sheets cria uma planilha na conta Google que você conectou no Hub;
  - alerta com canal Discord envia os disparos para o webhook que você informar;
  - cadastrar site registra as ad units no Google Ad Manager da sua rede.
- **Nada roda na sua máquina:** o plugin não tem hooks, scripts executados pelo Claude nem comandos locais, e não lê variáveis de ambiente. O `scripts/check-coverage.mjs` é só para quem mantém o plugin.

## Limites

- Período de até 366 dias por consulta.
- Listas grandes vêm cortadas em 200 itens, com aviso.
- Receita sempre na moeda de cada rede GAM.
- Datas no fuso do Hub (America/Sao_Paulo).

## Requisitos

- Claude Code, claude.ai ou Claude Desktop
- Uma conta no Hub AdSeleto com acesso a pelo menos uma empresa

## Estrutura

```
.claude-plugin/
  marketplace.json      catálogo
  plugin.json           manifesto
.mcp.json               conector AdSeleto Hub
skills/adseleto-hub/
  SKILL.md              descoberta, armadilhas, guardrails
  references/           detalhe por frente, carregado sob demanda
    receita-e-relatorios.md · audiencia-e-aquisicao.md
    precificacao-e-autopilot.md · wrapper-e-testes-ab.md
    sites-e-saude.md · redirecionamentos-e-alertas.md
evals/                  cenários de avaliação da skill
tools/manifest.txt      tools do conector
scripts/                checagem de cobertura
```

## Contribuindo

Ao alterar o plugin, **suba a `version` no `.claude-plugin/plugin.json`**: sem isso, quem já instalou não recebe a atualização.

### Quando o conector ganhar tools novas

`tools/manifest.txt` lista as tools do conector. O script `scripts/check-coverage.mjs` compara a documentação com ele nos dois sentidos: tool do manifesto que ninguém documentou, e nome citado que não existe (um erro de digitação faz o Claude tentar chamar uma tool inexistente, e nada avisa).

O endpoint exige login, então não dá para listar as tools automaticamente. Com o conector ligado no Claude Code, peça a lista de tools, atualize o manifesto (um nome por linha) e documente o que entrou:

```bash
node scripts/check-coverage.mjs
```

Antes de abrir PR:

```bash
claude plugin validate ./
```

## Licença

MIT
