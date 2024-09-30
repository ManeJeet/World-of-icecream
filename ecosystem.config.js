// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: "World-of-icecream",
        script: "./server.js", // Replace with your main application file
        instances: "max", // Or specify a number like 2
        exec_mode: "cluster", // Or "fork" for single instance
        env: {
          NODE_ENV: "development",
          PORT: 3000
          // Add other development-specific variables here
        },
        env_production: {
          NODE_ENV: "production",
          PORT: 8080
          // Add other production-specific variables here
        }
      }
    ]
  };