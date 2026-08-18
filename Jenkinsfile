pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend - Build & Test') {
            steps {
                dir('backend') {
                    bat 'mvnw.cmd clean package'
                }
            }
        }

        stage('Frontend - Install Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                }
            }
        }

        stage('Frontend - Test') {
            steps {
                dir('frontend') {
                    bat 'npm test -- --run'
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

        stage('Archive Backend') {
            steps {
                archiveArtifacts artifacts: 'backend/target/*.jar',
                                 fingerprint: true
            }
        }
    }

    post {
        success {
            echo '======================================'
            echo ' MSME360 CI PIPELINE SUCCESSFUL'
            echo ' Backend build and tests passed'
            echo ' Frontend tests and build passed'
            echo '======================================'
        }

        failure {
            echo '======================================'
            echo ' MSME360 CI PIPELINE FAILED'
            echo ' Check the failed stage above'
            echo '======================================'
        }

        always {
            echo 'MSME360 Jenkins pipeline completed.'
        }
    }
}