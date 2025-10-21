# EngageSphere - Test Design Masterclass (Turma 5)

Projeto exemplo com backend em [Node.js](https://nodejs.org/) e frontend em [React](https://react.dev/), incluindo testes automatizados com [Cypress](https://www.cypress.io/).

## 📋 Sobre o Projeto

O EngageSphere é uma aplicação full-stack desenvolvida para fins educacionais, focada em práticas de design e automação de testes.

Leia a [documentação de requisitos](docs/Requirements.md) para entender todas as funcionalidades da aplicação EngageSphere.

## 🛠️ Pré-requisitos

Para executar este projeto, você precisará de:

- [git](https://git-scm.com/downloads) (versão 2.42.1 ou superior)
- [Node.js](https://nodejs.org/en/) (versão v22.19.0 ou superior)
- npm (versão 10.9.3 ou superior)

> **Nota:** Ao instalar o Node.js, o npm é instalado automaticamente.

## 🚀 Instalação e Execução

Leia a [documentação do ambiente de teste](docs/TestEnvironment.md) para instalar e iniciar os servidores backend e frontend.

## 🧪 Testes Automatizados

Este projeto inclui testes automatizados end-to-end utilizando Cypress.

### Instalando o Cypress

```bash
npm install cypress --save-dev
```

### Executando os Testes

**Modo Interativo (Cypress Test Runner):**
```bash
npx cypress open
```

**Modo Headless (linha de comando):**
```bash
npx cypress run
```

**Executar testes específicos:**
```bash
npx cypress run --spec "cypress/e2e/nome-do-teste.cy.js"
```

### Estrutura dos Testes

```
cypress/
├── e2e/              # Testes end-to-end
├── fixtures/         # Dados de teste
├── support/          # Comandos customizados e configurações
└── cypress.config.js # Configuração do Cypress
```

### Casos de Teste

Consulte a [documentação de casos de teste](docs/TestCases.md) para visualizar a lista completa de cenários testados.

## 📚 Documentação Adicional

- [Requisitos da Aplicação](docs/Requirements.md)
- [Ambiente de Teste](docs/TestEnvironment.md)
- [Casos de Teste](docs/TestCases.md)

## 🤝 Contribuindo

Sinta-se à vontade para abrir issues e pull requests para melhorias nos testes ou na aplicação.

## 👨‍💻 Autor Original

Projeto original criado com ❤️ por [Walmyr](https://walmyr.dev).

## 📝 Licença

Este projeto é de código aberto e está disponível para fins educacionais.