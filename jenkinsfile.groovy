pipeline {
    agent any

    environment {
        // Define environment variables
        APP_NAME = 'world-of-icecream' // Replace with your application name
        EC2_USER = 'ubuntu' // Replace with your EC2 username (e.g., ec2-user, ubuntu)
        EC2_HOST = '3.26.48.92' // Replace with your EC2 instance IP or hostname
        SSH_KEY_CREDENTIALS = 'myKey' // Jenkins SSH credentials ID
        REPO_URL = 'git@github.com:ManeJeet/World-of-icecream.git' // Replace with your repository URL
        BRANCH = 'main' // Replace with your target branch
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: "${BRANCH}", url: "${REPO_URL}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build' // Modify if you have a different build command
            }
        }

        stage('Deploy to EC2') {
            steps {
                // Use SSH agent to handle SSH key authentication
                sshagent (credentials: ["${SSH_KEY_CREDENTIALS}"]) {
                    // Transfer files to EC2
                    sh """
                        rsync -avz --delete --exclude='node_modules' ./ ${EC2_USER}@${EC2_HOST}:/home/${EC2_USER}/${APP_NAME}/
                    """

                    // Execute deployment commands on EC2
                    sh """
                        ssh ${EC2_USER}@${EC2_HOST} << 'ENDSSH'
                            cd /home/${EC2_USER}/${APP_NAME}/
                            npm install --production
                            pm2 reload ecosystem.config.js --env production
                        ENDSSH
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment succeeded!'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}