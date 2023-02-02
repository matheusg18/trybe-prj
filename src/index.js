#!/usr/bin/env node

const readline = require('readline-sync');
const colors = require('colors');
const shell = require('shelljs');
const open = require('open');
const fs = require('fs');
const getParams = require('./getParams');

const storagePath = `${__dirname}/storage.json`;

/* Verifica se o arquivo de armazenamento existe */
let storage = {};
if (fs.existsSync(storagePath)) {
  storage = require(storagePath);
}

/* Criação e ajuste das variáveis */
const params = getParams();

let name = readline.question('Digite seu nome e sobrenome:\n-> '.green).toLowerCase().trim().replace(/ /g, '-');
let repoLink = readline.question('\nQual o link SSH do projeto?\n-> '.green);

const repoUrlPrefix = 'git@github.com:tryber/';
const repoUrlSufix = '.git';
const repoName = repoLink.replace(repoUrlPrefix, '').replace(repoUrlSufix, '');

const turmaRegex = /(sd-[0-9]{3})(-[a-z]-)/i;
const projectName = repoName.replace(turmaRegex, '').replace('project-', '');
let branchName = `${name}-${projectName}`;

/* Verifica se o parâmetro --default foi usado */
if (params.default) {
  const useDefaults = readline.question(
    '\nO parâmetro --default fará com que as informações fornecidas sejam utilizadas nas próximas vezes que executar o comando, deseja continuar? y/n\n-> '.green
  );

  /* Armazene as informações para uso futuro */
  if (useDefaults.toLowerCase() === 'y') {
    storage.name = name;
    storage.branchName = branchName;
    storage.repoLink = repoLink;
    fs.writeFileSync(storagePath, JSON.stringify(storage));
  }
} else if (storage.name && storage.branchName && storage.repoLink) {
  /* Se as informações já estiverem armazenadas, use-as como padrão */
  name = storage.name;
  branchName = storage.branchName;
  repoLink = storage.repoLink;
}

/* Verificação de nome de branch */
const acceptBranchName = readline.question(`Confirma o nome da branch? (${branchName})\ny/n\n-> `.green
);

if (acceptBranchName.toLowerCase() !== 'y') {
branchName = readline.question(
'\nQual o nome da branch que você deseja usar?\n-> '.green
);
}

/* Função para criar o título do Pull Request */
const getPrTitle = () => {
  const capitalizedName = name
    .split(' ')
    .map((namePiece) => namePiece.charAt(0).toLocaleUpperCase() + namePiece.substring(1))
    .join(' ');

  const capitalizedProjectName = projectName
    .split('-')
    .map((namePiece) => namePiece.charAt(0).toLocaleUpperCase() + namePiece.substring(1))
    .join(' ');

  return `[${capitalizedName}] ${capitalizedProjectName}`;
};

console.log(`\nCriando branch "${branchName}" a partir do branch "main"...\n`.yellow);

/* Comandos bash */
shell.exec(`git clone ${repoLink} ${params.clonePath ? params.clonePath : ''}`);

// Adiciona uma mudança para o git add
fs.writeFileSync(`./${params.clonePath ? params.clonePath : repoName}/.gitignore`, '\n', { flag: 'a' });

shell.cd(`${params.clonePath ? params.clonePath : repoName}`);
shell.exec('npm install');
shell.exec(`git checkout -b ${branchName}`);
shell.exec('git add .gitignore');
shell.exec(`git commit -am "${getPrTitle()}"`);
shell.exec(`git push -u origin ${branchName}`);

if (params.code) {
  shell.exec('code .');
  console.log(`\nAbrindo o Visual Studio Code...\n`.yellow);
}

console.log(`\nA branch "${branchName}" foi criada e você já está nela!\n`.green);

console.log(`Tudo pronto, boa codificação ${name.split(" ")[0].charAt(0).toUpperCase() + name.split(" ")[0].slice(1)}!`.green);

if (params.pr) {
  const prLink = `https://github.com/tryber/${repoName}/pull/new/${branchName}`;
  console.log(`\nAbrindo o link do Pull Request...\n`.yellow);
  open(prLink);
}

