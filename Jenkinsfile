pipeline {
    agent any

    environment {
        NODE_ENV        = 'development'
        JWT_SECRET      = 'supersecret'
        JWT_EXPIRES_IN  = '1h'
        VALID_PROJECTS  = 'duragas'
        PORT            = '3000'
        CORS_WHITELIST  = 'http://localhost:3000,http://localhost:3002,http://localhost:8080'
        NVM_DIR         = '/opt/nvm'
        SONAR_TOKEN     = credentials('SONAR_TOKEN')
    }

    stages {
        stage('Crear .env') {
            steps {
                sh '''
          cat <<EOF > .env
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
VALID_PROJECTS=${VALID_PROJECTS}
PORT=${PORT}
CORS_WHITELIST=${CORS_WHITELIST}
EOF
        '''
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Pre-cleaning') {
            steps {
                sh '''
          export NVM_DIR="/var/lib/jenkins/.nvm"
          [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
          nvm use 20.17.0
          rm -rf node_modules
          npm cache clean --force
        '''
            }
        }

        stage('Install dependencies') {
            steps {
                sh '''
          export NVM_DIR="/var/lib/jenkins/.nvm"
          [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
          nvm install 20.17.0
          nvm use 20.17.0
          npm ci
        '''
            }
        }

        stage('Lint') {
            steps {
                sh '''
          export NVM_DIR="/var/lib/jenkins/.nvm"
          [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
          nvm use 20.17.0
          npm run lint
        '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('MySonarQube') {
                    script {
                        def scannerHome = tool name: 'SonarQubeScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                        sh """
              export NVM_DIR="/var/lib/jenkins/.nvm"
              [ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh"
              nvm use 20.17.0
              ${scannerHome}/bin/sonar-scanner \\
                -Dsonar.projectKey=ms-jwt \\
                -Dsonar.sources=src \\
                -Dsonar.exclusions=**/*.spec.ts,**/*.test.ts,**/__tests__/** \\
                -Dsonar.login=$SONAR_TOKEN
            """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build') {
            steps {
                sh '''
          export NVM_DIR="/var/lib/jenkins/.nvm"
          [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
          nvm use 20.17.0
          npm run build
        '''
            }
        }

        stage('Deploy server') {
            steps {
                sh '''
          set -e

          TAR=$(mktemp /tmp/ms-jwt.XXXXXX.tar.gz)

          echo "🔁 Comenzando transferencia a 172.16.1.15..."

          mkdir -p ~/.ssh
          ssh-keyscan -H 172.16.1.15 >> ~/.ssh/known_hosts 2>/dev/null || true

          tar --exclude=node_modules --exclude=.git -czf "$TAR" .

          # Copiar el artefacto al servidor destino
          scp -i /var/lib/jenkins/.ssh/id_rsa -o StrictHostKeyChecking=no "$TAR" deployer@172.16.1.15:/tmp/
          TAR_REMOTE=$(basename "$TAR")
          rm -f "$TAR"

          echo "El TAR remoto a usar será: $TAR_REMOTE"

          # Pasamos el valor ya expandido en la línea del SSH
          ssh -i /var/lib/jenkins/.ssh/id_rsa -o StrictHostKeyChecking=no deployer@172.16.1.15 '
            set -e

            BACKEND_ROOT="/opt/projects/backend"
            PROJECT_PATH="$BACKEND_ROOT/ms/ms-jwt"
            TAR_REMOTE="/tmp/'"${TAR_REMOTE}"'"

            echo BACKEND_ROOT=$BACKEND_ROOT
            echo PROJECT_PATH=$PROJECT_PATH
            echo TAR_REMOTE=$TAR_REMOTE

            rm -rf "$PROJECT_PATH"
            mkdir -p "$PROJECT_PATH"
            tar -xzf "$TAR_REMOTE" -C "$PROJECT_PATH"
            rm -f  "$TAR_REMOTE"
            echo "✅ Código copiado en $PROJECT_PATH"

            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
            nvm use 20.17.0
            cd "$PROJECT_PATH"
            npm ci --omit=dev

            bash "$BACKEND_ROOT/start-all-projects.sh"
          '
        '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completado: Lint, SonarQube y Build OK'
        }
        failure {
            echo '❌ Ha fallado el pipeline'
        }
    }
}
