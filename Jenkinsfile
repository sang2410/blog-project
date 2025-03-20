
pipeline {
    agent any
    parameters {
        string(name: 'FRONTEND_DOCKER_TAG', defaultValue: '', description: 'Setting docker image for latest push')
        string(name: 'BACKEND_DOCKER_TAG', defaultValue: '', description: 'Setting docker image for latest push')
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    
        
    }
    tools {
        nodejs 'nodeJs'
    }
    
    stages {
        
        stage("Workspace cleanup"){
            steps{
                script{
                    cleanWs()
                }
            }
        }
        
        stage('Git: Code Checkout') {
            steps {
                script{
                  git branch: 'main', url: 'https://github.com/sang2410/blog-project.git'
                }
            }
        }
         stage("SonarQube: Code Analysis"){
            steps{
                  dir('backend') {
                     script{
                    withSonarQubeEnv('sonar-server') {
                        sh '''  sonar-scanner \
                               -Dsonar.projectKey=back-end-blog \
                               -Dsonar.sources=.
                             '''
                          }
                     }
                  }
                    
            }
        }
         stage("SonarQube: Code Quality Gates"){
            steps{
                script{  
                    waitForQualityGate abortPipeline: false,credentialsId: 'sonar-cred'

                }
            }
        }
        
        // stage("Trivy: Filesystem scan"){
        //     steps{
        //         script{
        //            sh "trivy fs --format table . > result.txt"
        //         }
        //     }
        // }

        stage("OWASP: Dependency check"){
            steps{
                script{
                  dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'OWASP'
                  dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                }
            }
        }
        
        stage('Trivy File Scan') {
            steps {
                dir('backend') {
                    sh 'trivy fs . > trivyfs.txt'
                }
            }
        }stage('Docker Image Build') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker system prune -f'
                        sh 'docker container prune -f'
                        sh 'docker build -t nguyenchisang/project-backend:${params.BACKEND_DOCKER_TAG} .'
                    }
                }
            }
        }
         stage('Trivy Image Scan') {
            steps {
                sh "trivy image nguyenchisang/project-backend:${params.BACKEND_DOCKER_TAG} > trivyimage.txt "
            }
        }
        stage("Docker: Push to DockerHub"){
            steps{
                script{
                    withDockerRegistry(credentialsId: 'docker-cred', url: 'https://index.docker.io/v1/') {
                          sh "docker push  nguyenchisang/project-backend:${params.BACKEND_DOCKER_TAG}"
                       }
                }
            }
        }   
        
        
    }
   
}
