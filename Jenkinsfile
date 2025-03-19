
pipeline {
    agent any
   
    parameters {
        string(name: 'FRONTEND_DOCKER_TAG', defaultValue: '', description: 'Setting docker image for latest push')
        string(name: 'BACKEND_DOCKER_TAG', defaultValue: '', description: 'Setting docker image for latest push')
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
        
        // stage("Trivy: Filesystem scan"){
        //     steps{
        //         script{
        //            sh "trivy fs --format table . > result.txt"
        //         }
        //     }
        // }

        // stage("OWASP: Dependency check"){
        //     steps{
        //         script{
        //           dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'OWASP'
        //           dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
        //         }
        //     }
        // }
        
        stage("SonarQube: Code Analysis"){
            steps{
                script{
                    withSonarQubeEnv('sonar-server') {
                        sh '''  sonar-scanner \
                               -Dsonar.projectKey=front-end-blog \
                               -Dsonar.sources=.
                             '''
                 }
                }
            }
        }
        
        stage("SonarQube: Code Quality Gates"){
            steps{
                script{
                    timeout(time: 1, unit: "MINUTES") {
                    waitForQualityGate abortPipeline: false
                     }

                }
            }
        }
        
        // stage('Exporting environment variables') {
        //     parallel{
        //         stage("Backend env setup"){
        //             steps {
        //                 script{
        //                     dir("Automations"){
        //                         sh "bash updatebackendnew.sh"
        //                     }
        //                 }
        //             }
        //         }
                
        //         stage("Frontend env setup"){
        //             steps {
        //                 script{
        //                     dir("Automations"){
        //                         sh "bash updatefrontendnew.sh"
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        
        stage("Docker: Build Images"){
            steps{
                script{
                        dir('backend'){
                             sh "docker build -t nguyenchisang/project-backend:${params.BACKEND_DOCKER_TAG} ."
                        }
                    
                        dir('frontend'){
                             sh "docker build -t nguyenchisang/project:${params.FRONTEND_DOCKER_TAG} ."
                        }
                }
            }
        }
        
        stage("Docker: Push to DockerHub"){
            steps{
                script{
                    withDockerRegistry(credentialsId: 'docker-cred', url: 'https://index.docker.io/v1/') {
                          sh "docker push  nguyenchisang/project-backend:${params.BACKEND_DOCKER_TAG}"
                            sh "docker push  nguyenchisang/project:${params.FRONTEND_DOCKER_TAG}"
}
                }
            }
        }
    }
    post{
        success{
            archiveArtifacts artifacts: '*.xml', followSymlinks: false
            build job: "Wanderlust-CD", parameters: [
                string(name: 'FRONTEND_DOCKER_TAG', value: "${params.FRONTEND_DOCKER_TAG}"),
                string(name: 'BACKEND_DOCKER_TAG', value: "${params.BACKEND_DOCKER_TAG}")
            ]
        }
    }
}
