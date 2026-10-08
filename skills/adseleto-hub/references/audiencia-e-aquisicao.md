# Audiência e aquisição

## `analisar_audiencia`

Analytics do Hub. `visao` escolhe:

| visao | O que traz |
|---|---|
| `visao_geral` | Sessões, usuários e pageviews (padrão) |
| `desempenho` | Série no tempo |
| `dispositivos` | Quebra por dispositivo |
| `eventos` | Eventos registrados |
| `conteudo` | Páginas mais vistas |
| `jornada` | Funil de navegação |

Filtros: `dispositivos` (ex.: `mobile`, `desktop`, `tablet`) e `paises` (códigos como `BR`, `US`). Aceita `site_ids: ["*"]`.

## `analisar_aquisicao`: de onde vem o tráfego

| visao | Fonte | O que traz |
|---|---|---|
| `utm_origem`, `utm_midia`, `utm_campanha` | Analytics | Sessões por UTM |
| `pago_resumo` | Google Ads e Facebook Ads | Investimento e retorno consolidados |
| `pago_por_dimensao` | Idem | Abre por `dimensao`: `source`, `network`, `campaign`, `domain`, `placement`, `ad_group` ou `creative` |
| `pago_cruzamento` | Idem | Tabela cruzada por `domain`, `placement`, `ad_group` ou `creative` |
| `pago_serie` | Idem | Série diária de uma campanha: exige `campaign_id` e `campaign_source` |

- `plataformas` restringe a `google_ads` e/ou `facebook_ads`.
- `comparar_com`: `previous_day`, `previous_period` ou `none`.
- `moeda` converte valores (ex.: `USD`, `BRL`). Diga na resposta em que moeda está.

## `listar_campanhas`

Campanhas de Google Ads e Facebook Ads **de uma rede** no período, com investimento, receita e ROI, mais o resumo consolidado.

- O recorte é empresa + `network_code` + período (campanha é da rede, não do site). `network_code` vem de `contexto_da_conta`.
- Ordena por `roi` por padrão; `ordenar_por` e `direcao` mudam isso.
- `status` filtra (ex.: `ENABLED`, `PAUSED`, separados por vírgula). `moeda` padrão: USD.
- Paginada (`page`).

## Ler com honestidade

- **ROI depende de receita atribuída.** Se a cobertura de atribuição do site for baixa (`explorar_site` com `recorte: cobertura`), o ROI por campanha pode ficar subestimado. Diga isso quando a cobertura estiver baixa.
- **Sessão não é pageview.** Não divida receita por sessão e chame de RPM: RPM é por mil pageviews.
- **Moeda:** investimento de mídia e receita de rede podem estar em moedas diferentes. Converta só com a taxa que veio na resposta ou com `moeda` explícita.
