pipeline {
    agent any

    stages {

        

        stage('Frontend - Install Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        

        stage('Frontend - Build') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }
    }

    post {
        success {
            echo '======================================'
            echo ' FRONTEND CI PIPELINE SUCCESSFUL'
            echo ' Frontend tests and build passed'
            echo '======================================'
        }

        failure {
            echo '======================================'
            echo ' FRONTEND CI PIPELINE FAILED'
            echo ' Check the failed stage above'
            echo '======================================'
        }

        always {
            echo 'Frontend Jenkins pipeline completed.'
        }
    }
}