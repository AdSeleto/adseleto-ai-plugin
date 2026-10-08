# Avaliações

Cenários que medem se a skill faz diferença. Cada arquivo descreve um pedido real e o comportamento esperado.

Não há runner embutido: a avaliação é feita rodando o pedido com a skill carregada e conferindo contra `expected_behavior`. Para ter a linha de base, rode o mesmo pedido **sem** a skill e compare.

```bash
# com a skill
claude --plugin-dir ./ -p "<query do eval>"

# sem a skill (linha de base)
claude -p "<query do eval>"
```

Cada cenário existe porque corresponde a uma falha que o schema sozinho não evita. Se um deles passar igual com e sem a skill, ou a skill não está agregando naquele ponto, ou o cenário está mal escrito.

| Arquivo | O que mede |
|---|---|
| `01-descoberta.json` | Não inventar ID; descobrir empresa e site antes de consultar |
| `02-moedas-por-rede.json` | Não somar receita de redes com moedas diferentes |
| `03-ajuste-de-piso.json` | Ler as regras, mostrar a prévia e esperar o sim antes de confirmar |
| `04-wrapper-com-teste-ab.json` | Checar teste A/B ativo antes de editar o wrapper |
| `05-queda-de-receita.json` | Diagnosticar por dia e por dimensão, com filtros válidos |
