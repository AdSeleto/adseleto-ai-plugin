# Sites e saúde técnica

## Ler

| Pergunta | Tool |
|---|---|
| Quais sites a empresa tem? | `listar_sites` (`busca` por nome ou domínio, `network_code`, `ativo`; paginada) |
| Ficha de um site | `detalhar_site`: rede, domínio, moeda, estado, aprovação no GAM e, se passou pelo onboarding do Hub, o estado do onboarding, do wrapper e do ads.txt com as ad units |
| O site está saudável? | `verificar_saude_do_site`: resumo e histórico das verificações de ads.txt e do wrapper (tela Troubleshooting) e os erros de JavaScript do período |

Use `verificar_saude_do_site` quando a receita cair sem motivo aparente e antes de publicar mudança no wrapper.

## Cadastrar site novo: `cadastrar_site`

Duas ações, nesta ordem:

1. `acao: iniciar` cria o site com `domain` (ex.: `meusite.com.br`) e `network_code` da empresa. Opcional: `copy_from_site_id` copia o wrapper de outro site da mesma rede, e `logo_url`.
2. `acao: registrar_ad_units` cria as ad units **no Google Ad Manager** da rede para o `site_id` criado (`ad_units`: `name`, `adUnitCode`, `adUnitSizes`). Roda em segundo plano: acompanhe com `detalhar_site`.

Só funciona se a empresa tiver o onboarding de sites liberado pela AdSeleto. Se for recusado por isso, diga que é preciso pedir à AdSeleto.

## Alterar site: `atualizar_site`

Só o que o Hub deixa o publisher editar:

- `price_rule_type`: `source` ou `campaign` (como as regras de preço são organizadas).
- `logo_url` (`null` remove o logo).

Nome, URL e ativação são feitos pela AdSeleto.
