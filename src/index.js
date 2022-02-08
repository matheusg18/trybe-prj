#!/usr/bin/env node

const readline = require('readline-sync');
const colors = require('colors');
const { execSync } = require('child_process');
const open = require('open');
const fs = require('fs');

const name = readline.question('Digite seu nome e sobrenome:\n-> '.green).trim();
const repoLink = readline.question('\nQual o link SSH do projeto?\n-> '.green);

const repoUrlPrefix = 'git@github.com:tryber/';
const repoUrlSufix = '.git';
const repoName = repoLink.replace(repoUrlPrefix, '').replace(repoUrlSufix, '');

const turmaRegex = /(sd-[0-9]{3})(-[a-z]-)/i;
const projectName = repoName.replace(turmaRegex, '');
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

execSync(`git clone ${repoLink}`, { stdio: 'inherit' });

// Adiciona uma mudança para o git add
fs.writeFileSync(`./${repoName}/.gitignore`, '\n', { flag: 'a' });

execSync(
  `cd ${repoName} && npm install && git checkout -b ${branchName} && git commit -am "${getPrTitle()}" && git push -u origin ${branchName}`,
  { stdio: 'inherit' }
);

const prLink = `https://github.com/tryber/${repoName}/pull/new/${branchName}`;
open(prLink);
