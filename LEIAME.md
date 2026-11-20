# Painel administrativo · San Marino

Painel em HTML/CSS/JavaScript puro (módulos ES, sem etapa de build), com Supabase como banco e login.
Publica em qualquer hospedagem estática (GitHub Pages incluído).

## Arquitetura de pastas

```
admin/
├── index.html                 Casca da aplicação: sidebar, header e área da tela (#view)
├── css/
│   ├── tokens.css             Cores, fontes e medidas (único lugar para mudar o visual)
│   ├── layout.css             Estrutura: sidebar, topbar, grade, responsividade
│   └── components.css         Botões, cartões, KPIs, gráfico, listas, login, avisos
└── js/
    ├── app.js                 Inicialização: sessão, login, sidebar, header, roteador
    ├── config.js              Endereço e chave pública do Supabase
    ├── supabase.js            Cliente único do Supabase
    ├── auth.js                Login, sessão, perfil e imobiliária do usuário
    ├── permissions.js         Lista de módulos e quem acessa cada um (perfis)
    ├── router.js              Rotas por #/modulo, bloqueio por perfil, carregamento sob demanda
    ├── ui/                    Peças visuais reutilizáveis: sidebar, header, ícones, avisos
    ├── utils/                 dom.js (escape de HTML), format.js (moeda, datas)
    └── modules/               Um módulo por pasta
        ├── dashboard/         dashboard.view.js (tela) · dashboard.service.js (dados) · chart.js
        └── placeholder.view.js  Tela "em construção" dos módulos ainda não feitos
```

## Como um módulo funciona

Cada módulo é uma pasta em `js/modules/<nome>/` com dois tipos de arquivo:

- `*.service.js`: fala com o banco (Supabase). Não mexe na tela.
- `*.view.js`: exporta `mount(elemento, contexto)`, desenha a tela e, se precisar, devolve uma função de limpeza.

Para criar um módulo novo: criar a pasta, registrá-lo em `permissions.js` (nome, ícone, perfis) e em `router.js` (linha em `VIEWS`).

## Regras que valem para todo o código

- Todo dado vindo do banco passa por `esc()` antes de ir para o HTML.
- A segurança real está no banco (RLS por imobiliária e por perfil). A tela só esconde o que o usuário não deve ver; quem decide é o banco.
- A chave do `config.js` é pública por natureza e pode ficar no navegador.

## Perfis

| Banco       | Aparece como    | Acessa                                        |
|-------------|-----------------|-----------------------------------------------|
| `chefe`     | Administrador   | Todos os módulos                              |
| `secretaria`| Gerente         | Tudo, exceto Usuários                         |
| `corretor`  | Corretor        | Dashboard, Imóveis, CRM e Agenda              |

O mapeamento "secretaria = Gerente" é provisório e será revisado na etapa de Usuários.

## Como publicar

1. Envie a pasta `admin` inteira para a raiz do repositório.
2. Abra `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/admin/`.
3. O painel antigo (`admin.html`) continua funcionando até a gestão de imóveis nova ficar pronta.

## Etapas

1. Estrutura base e Dashboard (esta entrega)
2. Gestão de imóveis
3. CRM e leads (Kanban)
4. Agenda de visitas
5. Contratos e financeiro
6. Usuários e permissões, relatórios e desempenho da equipe
