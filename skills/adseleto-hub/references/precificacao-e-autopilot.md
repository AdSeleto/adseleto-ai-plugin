# Precificação e autopilot

## Ler antes de mexer

`consultar_precificacao` mostra o que está na tela Precificação & Autopilot:

| visao | O que traz |
|---|---|
| `regras` | Cada regra com piso, estado do autopilot e métricas do período (padrão) |
| `fallback` | As regras de fallback |
| `historico` | Quem mudou o quê e quando nas regras (`pricing_rule_id` restringe a uma) |
| `historico_fallback` | O mesmo para fallback |

Filtros: `url`, `ad_unit`, `channel`, `country` e `rule_status`. Paginada (`page`, `per_page` até 100; veja `has_more`). **É daqui que saem os IDs de regra** para as tools de escrita.

## Qual tool de escrita usar

| Pedido | Tool |
|---|---|
| Mudar o piso de regras existentes (um valor por regra) | `ajustar_regra_de_preco` com `pisos: [{pricing_rule_id, price_rule}]` |
| Aplicar o mesmo valor em várias regras | `ajustar_regra_de_preco` com `pricing_rule_ids` + `campos` |
| Ligar, desligar ou ajustar o autopilot de UMA regra | `configurar_autopilot` |
| Criar regra nova (ou atualizar por url + ad unit + canal) | `criar_regra_de_preco` com `modo: regra` |
| Criar um padrão de preço para regras novas | `criar_regra_de_preco` com `modo: padrao` |
| Mudar o piso do fallback | `ajustar_fallback` (`consultar_precificacao` com `visao: fallback` dá os IDs) |

Todas rodam em duas etapas: prévia com `token_confirmacao`, depois `confirmar: true` com o token. Veja os guardrails na SKILL.md.

## Campos e unidades

- `price_rule`: piso, na moeda da rede.
- `desired_match_rate`: **0 a 100**.
- `autopilot_aggression`: 0 a 4.
- `autopilot_frequency`: horas, um de 1, 2, 4, 6, 8 ou 12.
- `autopilot_max_price_rule`: teto do autopilot, inteiro.
- `autopilot_weekdays`: dias da semana, 0 = domingo até 6 = sábado.
- `configurar_autopilot`: mande só o que muda.

## `criar_regra_de_preco`

- `modo: regra` (padrão): cada item de `regras` tem `url` (caminho da página, ex. `/noticias/x`), `slot_id` (ad unit), `utm_source` (canal) e `price_rule`; opcionais `utm_campaign`, `country` e `child`. Até 500 por chamada.
- Regra com a mesma url, ad unit e canal de uma existente é **atualizada**; as demais são criadas. A prévia separa as duas.
- **`price_rule` precisa ser um dos buckets de preço da rede.** A prévia recusa o que não for.
- `modo: padrao`: piso base (`base_price_rule`), `desired_match_rate` e `autopilot` por `ad_unit` e `channel` (vazio = todos). `sincronizar: true` aplica às regras novas logo depois.
- As regras entram no arquivo do site na hora; a gravação no banco roda em segundo plano, então `consultar_precificacao` pode demorar a mostrar.

## Fluxo: "sobe o piso das regras do /noticias para 0,40"

1. `consultar_precificacao` com `url: /noticias` (e período recente) para listar as regras e os pisos atuais.
2. `ajustar_regra_de_preco` sem `confirmar`, com `pisos` para cada regra. Mostre a prévia: quantas regras, piso atual e novo, receita recente delas.
3. Com o sim, chame de novo com os mesmos argumentos, `confirmar: true` e o token.
4. Confirme com `consultar_precificacao` que os pisos mudaram.

Piso alto demais derruba o match rate e a receita. Se o aumento for grande (mais de 30%, ou muitas regras), diga isso na prévia.
