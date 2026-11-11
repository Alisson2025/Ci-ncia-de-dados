# DataLab — Meu Painel de Dados

Projeto educacional de análise exploratória de dados com HTML, CSS e JavaScript. Pode ser publicado gratuitamente no GitHub Pages.

## O que o site faz

- Importa arquivos CSV exportados do Google Planilhas.
- Identifica colunas numéricas.
- Calcula quantidade de respostas, média, mediana e desvio padrão.
- Exibe um histograma e um gráfico de frequências.
- Calcula mínimo, máximo e quartis.
- Identifica possíveis outliers pelo método do intervalo interquartil (IQR).
- Mostra uma prévia das primeiras linhas da planilha.
- Gera uma interpretação automática simples da variável selecionada.

## Arquivos do projeto

- `index.html`: estrutura do site.
- `style.css`: aparência e responsividade.
- `script.js`: leitura do CSV, cálculos e gráficos.
- `dados_exemplo.csv`: arquivo demonstrativo para testar a aplicação.

## Como testar no computador

1. Baixe todos os arquivos.
2. Abra `index.html` no navegador.
3. Clique em **Usar dados de exemplo** ou importe um arquivo CSV.
4. Escolha a variável no seletor para atualizar os indicadores e gráficos.

O site usa bibliotecas externas por CDN (PapaParse e Chart.js), portanto precisa de conexão com a internet para carregar essas bibliotecas.

## Como publicar no GitHub Pages

1. Entre em https://github.com e faça login.
2. Clique em **New repository**.
3. Dê o nome `meu-painel-de-dados`.
4. Marque **Public** e crie o repositório.
5. No repositório, clique em **Add file → Upload files**.
6. Envie `index.html`, `style.css`, `script.js` e `dados_exemplo.csv` (ou envie todos os arquivos extraídos).
7. Clique em **Commit changes**.
8. Abra **Settings → Pages**.
9. Em **Build and deployment**, selecione **Deploy from a branch**.
10. Em Branch, escolha `main` e a pasta `/ (root)`. Clique em **Save**.
11. Aguarde alguns instantes e atualize a página. O GitHub mostrará o endereço publicado, geralmente:
   `https://SEU-USUARIO.github.io/meu-painel-de-dados/`

## Como preparar o CSV

- Na planilha do Google, use **Arquivo → Compartilhar → Publicar na Web**.
- Selecione a aba de respostas e o formato CSV.
- Baixe/exporte o CSV ou use o arquivo CSV no computador e carregue pelo botão do site.
- As colunas que serão analisadas precisam conter números. Colunas de texto, como carimbo de data/hora, não entram nos indicadores numéricos.

## Observações didáticas

- A análise é feita no navegador do usuário; o arquivo não é enviado a um servidor por este projeto.
- O método IQR sinaliza possíveis valores extremos, mas não prova que sejam erros.
- O desvio padrão apresentado é amostral.
- O histograma divide a faixa de valores em intervalos; o gráfico de frequências mostra os valores individuais mais comuns.
- A interpretação automática é um apoio inicial. Os estudantes devem observar os gráficos e elaborar suas próprias conclusões.

## Tecnologias

HTML5 · CSS3 · JavaScript · PapaParse · Chart.js · GitHub Pages
