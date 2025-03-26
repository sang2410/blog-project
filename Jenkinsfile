pipeline {
    agent any
    parameters {
        string(name: 'FRONTEND_DOCKER_TAG', defaultValue: 'latest', description: 'Tag for frontend Docker image')
        string(name: 'BACKEND_DOCKER_TAG', defaultValue: 'latest', description: 'Tag for backend Docker image')
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        DOCKER_REGISTRY = 'nguyenchisang'
        FRONTEND_APP = 'project-frontend'
        BACKEND_APP = 'project-backend'
        GIT_REPO = 'https://github.com/sang2410/blog-project.git'
    }
    tools {
        nodejs 'nodeJs'
    }
    stages {
        stage("Workspace cleanup") {
            steps {
                cleanWs()
            }
        }
        stage('Git: Code Checkout') {
            steps {
                git branch: 'main', url: "${GIT_REPO}"
            }
        }
        // stage('Run Tests') {
        //     parallel {
        //         stage('Frontend Tests') {
        //             steps {
        //                 dir('frontend') {
        //                     sh 'npm install'
        //                     sh 'npm test'
        //                 }
        //             }
        //         }
        //         stage('Backend Tests') {
        //             steps {
        //                 dir('backend') {
        //                     sh 'npm install'
        //                     sh 'npm test'
        //                 }
        //             }
        //         }
        //     }
        // }
        stage("SonarQube: Code Analysis") {
            steps {
                dir('frontend') {
                    withSonarQubeEnv('sonar-server') {
                        sh "$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectKey=front-end-blog -Dsonar.sources=."
                    }
                }
                dir('backend') {
                    withSonarQubeEnv('sonar-server') {
                        sh "$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectKey=back-end-blog -Dsonar.sources=."
                    }
                }
            }
        }
        stage("SonarQube: Code Quality Gates") {
            steps {
                waitForQualityGate abortPipeline: true
            }
        }
        stage("OWASP: Dependency check") {
            steps {
                dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'OWASP'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage("Trivy File Scan") {
            steps {
                dir('backend') {
                    sh 'trivy fs . > trivyfs-backend.txt'
                }
                dir('frontend') {
                    sh 'trivy fs . > trivyfs-frontend.txt'
                }
            }
        }
        stage('Docker Image Build') {
            steps {
                dir('frontend') {
                    sh 'docker system prune -f'
                    sh 'docker container prune -f'
                    sh "docker build -t ${DOCKER_REGISTRY}/${FRONTEND_APP}:${params.FRONTEND_DOCKER_TAG} ."
                }
                dir('backend') {
                    sh 'docker system prune -f'
                    sh 'docker container prune -f'
                    sh "docker build -t ${DOCKER_REGISTRY}/${BACKEND_APP}:${params.BACKEND_DOCKER_TAG} ."
                }
            }
        }
        stage('Trivy Image Scan') {
            steps {
                sh "trivy image  ${DOCKER_REGISTRY}/${FRONTEND_APP}:${params.FRONTEND_DOCKER_TAG} > trivyimage-frontend.txt"
                sh "trivy image  ${DOCKER_REGISTRY}/${BACKEND_APP}:${params.BACKEND_DOCKER_TAG} > trivyimage-backend.txt"
            }
        }
        stage("Docker: Push to DockerHub") {
            steps {
                withDockerRegistry(credentialsId: 'docker-cred', url: 'https://index.docker.io/v1/') {
                    sh "docker push ${DOCKER_REGISTRY}/${FRONTEND_APP}:${params.FRONTEND_DOCKER_TAG}"
                    sh "docker push ${DOCKER_REGISTRY}/${BACKEND_APP}:${params.BACKEND_DOCKER_TAG}"
                }
            }
        }
        stage('Update: Git Manifest') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'git-cred', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                        sh """
                            git config user.email "chisang24102000@gmail.com"
                            git config user.name "sang"
                            cd kubernetes/frontend
                            sed -i 's|image: ${DOCKER_REGISTRY}/${FRONTEND_APP}:.*|image: ${DOCKER_REGISTRY}/${FRONTEND_APP}:${params.FRONTEND_DOCKER_TAG}|g' values.yaml
                            cd ../backend
                            sed -i 's|image: ${DOCKER_REGISTRY}/${BACKEND_APP}:.*|image: ${DOCKER_REGISTRY}/${BACKEND_APP}:${params.BACKEND_DOCKER_TAG}|g' values.yaml
                            git add ../frontend/values.yaml ../backend/values.yam
                            git commit -m "Update frontend to ${params.FRONTEND_DOCKER_TAG} and backend to ${params.BACKEND_DOCKER_TAG}"
                            git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/sang2410/blog-project.git main
                        """
                    }
                }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: '*.txt', allowEmptyArchive: true
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}