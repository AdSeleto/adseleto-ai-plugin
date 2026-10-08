# Wrapper e testes A/B

## Ler o wrapper

`consultar_wrapper`:

| visao | O que traz |
|---|---|
| `configuracao` | A configuração publicada de uma ramificação (padrão `main`), com plugins e bidders (padrão) |
| `historico` | Publicações anteriores, com o `wrapper_id` de cada versão |
| `ramificacoes` | As ramificações existentes |

`ramificacao` escolhe qual ler. Histórico paginado (`page`, `per_page` até 50).

## `editar_wrapper`: publica em produção

- `alteracoes` é um **JSON Merge Patch** sobre a configuração atual: objeto mescla, `null` remove a chave, **lista substitui inteira**. Para mudar um item de uma lista (ex.: um bidder), mande a lista completa como ela deve ficar.
- A prévia lista os caminhos alterados, valida a configuração e avisa remoções. Mostre isso à pessoa.
- `ramificacao` padrão: `main`, que é o que roda no site.
- **Bloqueado enquanto houver teste A/B ativo no site.**

### Fluxo: "troca o timeout do Prebid para 1500 no site X"

1. `listar_testes_ab` para ver se há teste ativo no site. Se houver, o wrapper está travado: explique e pare.
2. `consultar_wrapper` com `visao: configuracao` para achar onde está o campo e o valor atual.
3. `editar_wrapper` sem `confirmar`, com o patch mínimo. Mostre os caminhos alterados e o valor antes e depois.
4. Com o sim explícito, confirme com o token. Diga que vale para todo o tráfego do site.

## `gerenciar_ramificacao_do_wrapper`

- `acao: criar_ramificacao` cria uma ramificação nova (`nome` com letras, números, ponto, hífen ou sublinhado; não pode ser `main`).
- `acao: voltar_versao` republica uma versão anterior (`wrapper_id` do `historico`) como versão nova da mesma ramificação. A prévia mostra a diferença. Também é recusado com teste A/B ativo.

## Testes A/B

Ler: `listar_testes_ab` (sem `ab_test_id` lista todos; com ele traz o detalhe e as métricas de A e B).

Alterar: `gerenciar_teste_ab`.

| acao | O que faz |
|---|---|
| `criar` | `site_id`, `name`, `url` (caminho testado, ex. `/`), `traffic_percentage` (1 a 99), `default_metric` (`rpm`, `rpms`, `ctr`, `viewability`, `fill_rate` ou `ecpm`), `end_date` futura, `hipotese` e `alteracoes_b` (merge patch sobre o wrapper atual que vira a versão B) |
| `pausar`, `retomar` | Muda o estado |
| `estender` | Nova `end_date` |
| `concluir` | Encerra a coleta |
| `descartar` | Joga o teste fora |
| `aplicar_vencedor` | **Leva a versão B para o wrapper de produção.** Só depois de concluído |

**Enquanto o teste existir, o wrapper do site fica travado** para `editar_wrapper` e voltar versão. Ao criar, diga isso na prévia.

Antes de `aplicar_vencedor`, mostre as métricas de A e B (`listar_testes_ab` com `ab_test_id`) e diga se a diferença é pequena ou o volume baixo.
