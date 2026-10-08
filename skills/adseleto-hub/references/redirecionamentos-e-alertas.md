# Redirecionamentos e alertas

## Redirecionamentos de link

Ler: `listar_redirecionamentos`.

| visao | O que traz |
|---|---|
| `redirecionamentos` | Os links da empresa (padrão) |
| `dominios` | Os domínios de redirect (o `redirect_domain_id` para criar) |
| `destinos` | Destinos e pesos de um redirect (exige `redirect_id`) |

Alterar: `gerenciar_redirecionamento`.

| acao | Precisa de |
|---|---|
| `criar` | `dados`: `name`, `slug`, `redirect_domain_id`, `pass_utm_params` |
| `alterar` | `redirect_id` + `dados` |
| `remover` | `redirect_id`. **Link removido para de funcionar para quem clicar** |
| `alternar` | `redirect_id` (liga ou desliga) |
| `adicionar_destino` | `redirect_id` + `dados`: `url`, `weight` |
| `alterar_destino`, `remover_destino`, `alternar_destino` | `destination_id` |
| `distribuir` | `redirect_id` + `pesos`: `[{destination_id, weight}]` |

Antes de `distribuir`, mostre a distribuição atual e a nova lado a lado.

## Alertas de métrica

Ler: `listar_alertas` (`visao: alertas` lista os alertas; `visao: opcoes` traz as métricas e os canais válidos para criar um).

Alterar: `configurar_alerta`.

- `acao: criar`: `metric` (`match_rate`, `fillrate`, `ecpm`, `ctr`, `impressions`, `clicks`, `revenue` ou `viewability`), `condition` (`above` ou `below`), `threshold_value`, `channels` (`hub` e/ou `discord`). Opcionais: `site_ids`, `network_ids`, `ad_units`, `silence_minutes` (mínimo 60) e `name`.
- `acao: editar`: `alert_id` + os campos que mudam.
- `acao: ligar` e `acao: desligar`: `alert_id`.

O alerta é sempre de uma empresa só. Alerta que abrange outras empresas não é editável por aqui: oriente a editar pelo Hub.

**Canal `discord` envia os disparos para o `discord_webhook_url` informado**, fora do Hub. Peça a URL à pessoa e nunca invente; diga na prévia para onde os alertas vão.
