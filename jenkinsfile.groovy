pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                echo 'Building the project...'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'hello world'
            }
        }
        
        stage('Release') {
            steps {
                echo 'Releasing the project...'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded! Sending notifications...'
            // Add success notification steps here
        }
        failure {
            echo 'Pipeline failed! Sending notifications...'
            // Add failure notification steps here
        }
    }
}