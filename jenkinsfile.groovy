pipeline {
    agent any

    environment {
        APP_NAME = 'World-of-icecream' // Replace with your application name
        EC2_USER = 'ubuntu' // Replace with your EC2 username (e.g., ec2-user, ubuntu)
        EC2_HOST = '3.26.48.92' // Replace with your EC2 instance IP or hostname
        DEPLOY_SSH_CREDENTIALS = 'myKey' // The ID for EC2 deployment SSH credentials
        GIT_SSH_CREDENTIALS = 'gitKey' // The ID for GitHub SSH credentials
        REPO_URL = 'https://github.com/ManeJeet/World-of-icecream.git' // SSH URL for GitHub
        BRANCH = 'main' // Your target branch
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
        
        stage('Deploy to EC2') {
            steps {
                sshagent (credentials: ["${env.DEPLOY_SSH_CREDENTIALS}"]) {
                    // Ensure the directory exists on EC2
                    sh """
                        ssh ${env.EC2_USER}@${env.EC2_HOST} 'mkdir -p /home/${env.EC2_USER}/${env.APP_NAME}'
                    """

                    // Transfer files to EC2 (exclude node_modules and git)
                    sh """
                        rsync -avz --delete --exclude='node_modules' --exclude='.git' ./ ${env.EC2_USER}@${env.EC2_HOST}:/home/${env.EC2_USER}/${env.APP_NAME}/
                    """

                    // Install production dependencies and restart the app
                    sh """
                        ssh ${env.EC2_USER}@${env.EC2_HOST} << 'ENDSSH'
                            cd /home/${env.EC2_USER}/${env.APP_NAME}/
                            npm install --production  // Install production dependencies
                            pm2 reload ecosystem.config.js --env production  // Restart app with PM2
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