#!/usr/bin/env node

const readline = require('readline-sync');
const { execSync } = require('child_process');
const open = require('open');
const fs = require('fs');

const name = readline.question('Digite seu nome e sobrenome?');
const link = readline.question('Qual o link SSH do projeto?');
const prefix = 'git@github.com:tryber/';
const sufix = '.git';
const repoName = link.replace(prefix, '').replace(sufix, '');
const rgx = /(sd-[0-9]{3})(-[a-z]-)/i;
const projectName = repoName.replace(rgx, '');
const branchName = `${name.toLowerCase().replace(' ', '-')}-${projectName}`;

execSync(`git clone ${link}`, { stdio: 'inherit' });
execSync(
  `cd ${repoName} && npm install && git checkout -b ${branchName} && git add . && git commit -m "commit inicial" -m "teste do script"`,
  { stdio: 'inherit' }
);

console.log(process.argv);
fs.writeFileSync(`./${repoName}/.gitignore`, '\n', { flag: 'a' });

//  && git push -u origin ${branchName}a
// const prLink = `https://github.com/tryber/${repoName}/pull/new/${branchName}`;
// open(prLink);
