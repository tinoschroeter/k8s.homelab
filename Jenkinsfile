pipeline {
  agent any

  stages {
      stage('Linting') {
          steps {
          echo 'linting..'
          }
      }
      stage('Build Dev') {
        when {
          branch 'dev'
        }
        steps {
            echo 'Build Dev..'
            sh("cd k3s/dev/ && skaffold run")
        }   
      }
      stage('Build Production') {
        when {
          branch 'master'
        }
        steps {
            echo 'Build Production....'
            sh("cd k3s/production/ && skaffold run")
        }  
    }
  }
}
