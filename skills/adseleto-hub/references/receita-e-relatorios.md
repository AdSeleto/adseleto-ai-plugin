# Receita e relatórios

## De onde vem cada número

| Pergunta | Tool |
|---|---|
| Quanto faturei no período? | `obter_receita` |
| Quais sites mais e menos faturaram? Quem caiu mais? | `ranking_de_sites` |
| Por que o site X caiu (ou subiu)? | `explorar_site` |
| Quais ad units, URLs e origens existem no site? | `listar_valores_de_dimensao` |
| Quais relatórios eu tenho salvos? | `listar_relatorios` |
| Roda o relatório Y | `rodar_relatorio` |
| Manda o relatório para uma planilha | `exportar_relatorio` |

## `obter_receita`

- `site_ids` aceita uma lista de IDs ou `["*"]` (todos os sites que a pessoa vê na empresa).
- `agrupar_por`: `dia` (padrão), `semana`, `mes` ou `ano`.
- `separar_por_site: true` abre a série por site.
- `metricas`: até 4 entre `revenue`, `impressions`, `ecpm`, `ad_requests`, `clicks`, `ctr`, `rpc`, `match_rate`, `fillrate` e `viewability`. Padrão: receita, impressões e eCPM.
- O resultado vem **separado por rede GAM, cada uma na sua moeda**.

Comparar períodos: duas chamadas com janelas do mesmo tamanho. Semana contra semana anterior funciona melhor que "últimos 7 dias contra os 7 anteriores" quando o tráfego varia por dia da semana.

## `ranking_de_sites`

- `metrica` (padrão `revenue`), `ordem` (`desc` traz os maiores, `asc` os menores) e `limite` (1 a 100, padrão 10, por rede).
- Já traz o valor do período anterior de mesmo tamanho e a variação.
- `ordenar_por_variacao: true` ordena pela variação percentual: com `ordem: asc` responde "quem mais caiu".

## `explorar_site`: diagnóstico de um site

`recorte` escolhe a visão:

| recorte | Para quê |
|---|---|
| `resumo` | Indicadores do período (padrão) |
| `diario` | Série dia a dia: ache o dia em que mudou |
| `tabela` | Linhas por URL e origem, paginadas (`page`, `per_page` até 100, `ordenar_por`, `direcao`, `busca`) |
| `top_urls` | URLs que mais faturaram |
| `cobertura` | Quanto da receita está atribuída a URL e origem |

Filtros: `ad_unit`, `url`, `source` (só vale junto com `url`) e `tipo_trafego` (`organic` ou `arbitrage`). `incluir_subdominios: true` soma os subdomínios.

**Pegue os valores de filtro em `listar_valores_de_dimensao`** (`dimensao`: `ad_unit`, `url`, `source` ou `tipo_trafego`, com `busca` opcional). Valor que não existe devolve vazio, e vazio não é queda.

### Fluxo: "por que a receita do site caiu?"

1. `explorar_site` com `recorte: diario` num período que pegue antes e depois da queda.
2. Achado o dia, compare `resumo` antes e depois: caiu impressão (tráfego, ad request) ou caiu eCPM (preço, demanda)?
3. Abra por dimensão: `tabela` ou filtros por `ad_unit`, `tipo_trafego` e origem, para ver se a queda está concentrada.
4. Se nada explica, `verificar_saude_do_site` (ads.txt, wrapper, erros de JavaScript) e `consultar_wrapper` com `visao: historico` (houve publicação no dia?).

## Relatórios

1. `listar_relatorios` devolve os relatórios salvos (com `report_id`) e os modelos (com `template_id`). Use `busca` pelo nome e `tipo` (`simple` ou `advanced`).
2. `rodar_relatorio` executa um **modelo** (`template_id`) para sites e período. Traz **100 linhas por página**: siga `page` enquanto `has_more` for true. Filtros: `channel`, `url`, `ad_unit` e `filtros_coluna` (`field`, `operator`, `value`, até 32). `comparar_periodo: true` traz o período anterior equivalente.
3. `exportar_relatorio` exporta um **relatório salvo** (`report_id`):
   - `formato: csv` devolve o conteúdo na conversa, até 200 linhas.
   - `formato: google_sheets` **cria uma planilha na conta Google** que a pessoa conectou no Hub e devolve o link. Exige `integration_id` dessa conta. Avise antes de criar.
   - Se a planilha ainda estiver sendo gerada, a resposta traz um `job_id`: chame de novo passando `job_id` para saber o status.
