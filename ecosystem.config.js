module.exports = {
  apps: [
    {
      name: 'guhada-mobile-dev',
      // script: 'server.js',
      // args: '',
      // instances: 1,
      // autorestart: true,
      // watch: false,
      // max_memory_restart: '500M',
      // env: {
      //   NODE_ENV: 'development',
      // },
      // env_production: {
      //   NODE_ENV: 'production',
      // },
      script: 'server.js',
      instances: 0,
      exec_mode: 'cluster', // NOTE: CPU 수만큼 인스턴스를 만들고 클러스터 모드로 프로세스 실행
      wait_ready: true,
      listen_timeout: 50000, // ready까지 기다릴 시간. 이 시간 후 강제로 SIGNIT 시그널 발생시킨다.
      kill_timeout: 5000, // SIGINT 시그널 발생 후 SIGKILL 시그널까지 기다릴 시간. 시간이 초과하면 프로세스를 강제 종료한다.
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8081,
      },
    },
    {
      name: 'guhada-mobile-qa',
      script: 'server.js',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'guhada-mobile-stg',
      script: 'server.js',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'guhada-mobile-prod',
      script: 'server.js',
      instances: 0,
      exec_mode: 'cluster', // NOTE: CPU 수만큼 인스턴스를 만들고 클러스터 모드로 프로세스 실행
      wait_ready: true,
      listen_timeout: 50000, // ready까지 기다릴 시간. 이 시간 후 강제로 SIGNIT 시그널 발생시킨다.
      kill_timeout: 5000, // SIGINT 시그널 발생 후 SIGKILL 시그널까지 기다릴 시간. 시간이 초과하면 프로세스를 강제 종료한다.
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8081,
      },
    },
  ],
};
