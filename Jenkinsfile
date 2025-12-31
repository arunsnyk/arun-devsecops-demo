pipeline {
    agent any

    environment {
        IMAGE_NAME = "arunhanamannavar/arun-devsecops-demo"
        IMAGE_TAG  = "${BUILD_NUMBER}"
        NEXUS_IMAGE = "nexus.example.com/arun/arun-devsecops-demo:${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Source') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/arunsnyk/arun-devsecops-demo.git'
            }
        }

        stage('Snyk Open Source Scan (Source Code)') {
            steps {
                snykSecurity(
                    snykInstallation: 'ARUNSNYK',
                    snykTokenId: 'SNYK_TOKEN',
                    organisation: 'vprofile-tests',
                    projectName: 'arun-source-pre-image',
                    severity: 'critical',
                    failOnIssues: 'false',
                    monitorProjectOnBuild: 'true'
                )
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                  docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                """
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DOCKERHUB_CREDS',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                      echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                      docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Push Image to Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'NEXUS_CREDS',
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    sh """
                      docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${NEXUS_IMAGE}
                      echo $NEXUS_PASS | docker login nexus.example.com -u $NEXUS_USER --password-stdin
                      docker push ${NEXUS_IMAGE}
                    """
                }
            }
        }

        stage('Snyk Container Scan (Image)') {
            steps {
                snykSecurity(
                    snykInstallation: 'ARUNSNYK',
                    snykTokenId: 'SNYK_TOKEN',
                    organisation: 'vprofile-tests',
                    projectName: 'arun-container-post-image',
                    severity: 'critical',
                    failOnIssues: 'false',
                    monitorProjectOnBuild: 'true',
                    dockerImageName: "${IMAGE_NAME}:${IMAGE_TAG}"
                )
            }
        }
    }
}

