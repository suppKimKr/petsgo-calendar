module.exports = {
    apps: [
        {
            name: 'petsgo-calendar',
            script: 'app.js',
            exec_mode: 'cluster',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            instances: 0,
            instance_var: 'INSTANCE_ID',
            max_restarts: 3,
            env: {
                NODE_ENV: 'development',
                NODE_CONFIG_DIR: './config/',
            },
            env_local: {
                NODE_ENV: 'localhost',
                NODE_CONFIG_DIR: './config/',
            },
            env_production: {
                NODE_ENV: 'production',
                NODE_CONFIG_DIR: './config/',
            },
        },
    ],
};
