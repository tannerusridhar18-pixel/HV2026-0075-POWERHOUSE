pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // =========================
        // BACKEND
        // =========================

        stage('Backend - Build & Test') {
            steps {
                dir('backend') {
                    bat 'mvnw.cmd clean package'
                }
            }
        }

        // =========================
        // FRONTEND
        // =========================

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

        // =========================
        // ARCHIVE
        // =========================

        stage('Archive Backend') {
            steps {
                archiveArtifacts artifacts: 'backend/target/*.jar',
                                 fingerprint: true
            }
        }

        stage('Archive Frontend') {
            steps {
                archiveArtifacts artifacts: 'frontend/dist/**',
                                 fingerprint: true
            }
        }
    }

    post {

        success {
            echo '======================================'
            echo ' MSME360 CI PIPELINE SUCCESSFUL'
            echo '======================================'
            echo ' Backend build and tests passed'
            echo ' Frontend dependencies installed'
            echo ' Frontend build passed'
            echo ' Backend JAR archived'
            echo ' Frontend build archived'
            echo '======================================'
        }

        failure {
            echo '======================================'
            echo ' MSME360 CI PIPELINE FAILED'
            echo '======================================'
            echo ' Check the failed stage above'
            echo '======================================'
        }

        always {
            echo 'MSME360 Jenkins pipeline completed.'
        }
    }
}