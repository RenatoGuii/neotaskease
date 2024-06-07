NeoTaskEase
O NeoTaskEase é um aplicativo de gerenciamento de tarefas desenvolvido com React Native e Firebase.

Pré-requisitos
Antes de começar, certifique-se de ter instalado o seguinte:

- Node.js (v14 ou superior)
- Expo CLI (para executar o aplicativo no Expo Go)
- Conta no Firebase (para configurar o banco de dados e autenticação)

Configuração do Projeto
Clone o repositório:

- git clone https://github.com/RenatoGuii/neotaskease.git

Instale as dependências do projeto:

- cd neotaskease
- npm install

Configuração do Firebase:

Crie um novo projeto no Firebase Console.

No console do Firebase, ative o Firestore e a autenticação por e-mail/senha.

Crie um arquivo .env na raiz do projeto e adicione as chaves do Firebase:

- FIREBASE_API_KEY=AIzaSyCgMtHBOA9Zaq2L4DwS2PL3e8FTWUD68Wc
- FIREBASE_AUTH_DOMAIN=neotaskease-ec435.firebaseapp.com
- FIREBASE_PROJECT_ID=neotaskease-ec435

Inicie o aplicativo:

npx expo start 

Você pode escanear o código QR gerado com o aplicativo Expo Go em seu dispositivo móvel ou usar um emulador para visualizar o aplicativo.
