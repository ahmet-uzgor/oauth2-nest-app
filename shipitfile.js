module.exports = (shipit) => {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    local: {
      branch: 'develop',
      workspace: '/var/www/html/microlearning-backend',
      deployTo: '/var/www/html/microlearning-backend',
      repositoryUrl: 'ssh://git@gitlab.90pixel.net:3795/akademi/microlearning-backend.git',
      servers: 'root@134.209.246.189:22',
      ignores: ['node_modules'],
      keepReleases: 3,
      key: '~/.ssh/id_rsa',
      app: 'local',
      env: 'local',
    },
    // test: {
    //   branch: 'test',
    //   workspace: '/var/www/oys/backend',
    //   deployTo: '/var/www/oys/backend',
    //   repositoryUrl: 'ssh://git@gitlab.90pixel.net:3795/project/oy-nest-api.git',
    //   servers: 'root@93.115.79.40:22',
    //   ignores: ['node_modules'],
    //   keepReleases: 3,
    //   key: '~/.ssh/id_rsa',
    //   app: 'test',
    //   env: 'test',
    // },
  });

  shipit.on('cleaned', () => {
    shipit.start('deploy:app');
  });

  shipit.blTask('deploy:app', async () => {
    await shipit.copyToRemote('app.tar.gz', `${shipit.releasePath}/app.tar.gz`);
    await shipit.remote(
      `cd ${shipit.releasePath} && tar -xzf app.tar.gz && export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh" && nvm use && npm install`,
    );

    try {
      await shipit.remote(`cd ${shipit.releasePath} &&
            export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh" && nvm use && pm2 -s delete microlearning-api-${shipit.config.env}`);
    } catch (err) {
      console.log('err: ', err);
    }

    await shipit.remote(`
      cd ${shipit.releasePath} && 
      export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh" && nvm use &&
      pm2 startOrRestart ecosystem.config.js --only microlearning-api-${shipit.config.env} --env ${shipit.config.env} && pm2 save
    `);
  });
};
