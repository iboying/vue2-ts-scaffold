/* eslint-disable */
const fs = require('fs');
const EasyDeploy = require('@iboying/easy-deploy');
const chalk = require('chalk');

const localPath = 'dist/';
const TARGET = process.env.npm_lifecycle_event;
const targetOptionsMap = {
  publish: [
    {
      tag: '正式版',
      username: 'web',
      host: '127.0.0.1',
      port: 80,
      localPath,
      remotePath: '/project/path',
    },
  ],
  deploy: [
    {
      tag: '测试版',
      username: 'web',
      host: '127.0.0.1',
      port: 80,
      localPath,
      remotePath: '/project/path',
    },
  ],
};
const targets = targetOptionsMap[TARGET] || [];

async function saveLatestCommitId() {
  const commitId = await EasyDeploy.shell('git rev-parse head');
  fs.writeFileSync(`${localPath}version.json`, commitId, {
    encoding: 'utf-8',
  });
}

async function deployToTargets(option) {
  try {
    const instance = new EasyDeploy(option);
    console.log(chalk.cyan(`开始部署 ${option.tag}`));
    await instance.sync('-avI');
    console.log(chalk.green(`部署 ${option.tag} 成功`));
  } catch (err) {
    console.log(chalk.red(`部署 ${option.tag} 失败`));
    throw err;
  }
}

(async () => {
  await saveLatestCommitId();
  for await (const option of targets) {
    deployToTargets(option);
  }
})();
