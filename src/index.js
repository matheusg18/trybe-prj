#!/usr/bin/env node

const readline = require('readline-sync');
const colors = require('colors');
const open = require('open');
const fs = require('fs');
const shell = require('shelljs');
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

if (acceptBranchName === false) {
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
shell.exec(`git clone ${repoLink} ${params.clonePath ? params.clonePath : ''}`);

// Adiciona uma mudança para o git add
fs.writeFileSync(`./${params.clonePath ? params.clonePath : repoName}/.gitignore`, '\n', { flag: 'a' });

shell.cd(`${params.clonePath ? params.clonePath : repoName}`);
shell.exec('npm install');
shell.exec(`git checkout -b ${branchName}`);
shell.exec(`git commit -am "${getPrTitle()}"`);
shell.exec(`git commit -am "${getPrTitle()}"`);
shell.exec(`git push -u origin ${branchName}`);

if (params.code) {
  shell.exec('code .');
}

if (params.pr) {
  const prLink = `https://github.com/tryber/${repoName}/pull/new/${branchName}`;
  open(prLink);
}
