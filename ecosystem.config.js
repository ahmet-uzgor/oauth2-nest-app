module.exports = {
  apps: [
    {
      name: 'microlearning-api-local',
      script: "start.sh",
      env: {
        "NODE_ENV": "local",
      },
    },
    {
      name: 'microlearning-api-test',
      script: "start.sh",
      env: {
        "NODE_ENV": "test",
      },
    }
  ],
};
