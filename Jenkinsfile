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
          anyOf {
            changeset "button/**"
            changeset "button/**"
            changeset "www/**"
            changeset "k3s/base/**"
            changeset "k3s/dev/**"
          }
        }
        steps {
            echo 'Build Dev..'
            sh("cd k3s/dev/ && skaffold run")
        }   
      }
      stage('Build Production') {
        when { 
          branch 'master'
          anyOf {
            changeset "button/**"
            changeset "button/**"
            changeset "www/**"
            changeset "k3s/base/**"
            changeset "k3s/production/**"
          }
        }
        steps {
            echo 'Build Production....'
            sh("cd k3s/production/ && skaffold run")
        }  
     }
  }
}
