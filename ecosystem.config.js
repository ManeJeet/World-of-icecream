// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: "World-of-icecream",
        script: "./index.js", // Adjust the script path as needed
        instances: "max", // Or specify a number like 2
        exec_mode: "cluster", // Or "fork" for single instance
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  };