#!/usr/bin/env node

const readline = require('readline-sync');
require('colors');
const { execSync } = require('child_process');
const open = require('open');
const fs = require('fs');
const getParams = require('./getParams');

/* Criação e ajuste das variáveis */
const params = getParams();

const name = readline.question('Digite seu nome e sobrenome:\n-> '.green).trim();
const repoLink = readline.question('\nQual o link SSH do projeto?\n-> '.green);

const repoUrlPrefix = 'git@github.com:tryber/';
const repoUrlSufix = '.git';
const repoName = repoLink.replace(repoUrlPrefix, '').replace(repoUrlSufix, '');

const turmaRegex = /(sd-[0-9]{3})(-[a-z]-)/i;
const projectName = repoName.replace(turmaRegex, '').replace('project-', '');
let branchName = `${name.toLowerCase().replace(' ', '-')}-${projectName}`;

const acceptBranchName = readline.keyInYN(
  '\nO nome da branch será: '.green + branchName.green.underline + ', ok?'.green
);

if (!acceptBranchName) {
  branchName = readline.question('\nDigite o nome da branch: '.green);
}

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

/* Comandos bash */
execSync(`git clone ${repoLink} ${params.clonePath ? params.clonePath : ''}`, { stdio: 'inherit' });

// Adiciona uma mudança para o git add
fs.writeFileSync(`./${params.clonePath ? params.clonePath : repoName}/.gitignore`, '\n', { flag: 'a' });

execSync(
  `cd ${params.clonePath ? params.clonePath : repoName} && npm install && git checkout -b ${branchName} && git commit -am "${getPrTitle()}" && git push -u origin ${branchName} ${params.code ? '&& code .' : ''}`,
  { stdio: 'inherit' }
);

if (params.pr) {
  const prLink = `https://github.com/tryber/${repoName}/pull/new/${branchName}`;
  open(prLink);
}
