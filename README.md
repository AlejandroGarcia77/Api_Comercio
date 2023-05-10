#API de Comercio
Esta es una API de comercio electrónico diseñada para permitir que los desarrolladores accedan y gestionen información de productos, clientes, pedidos y pagos.

#Funcionalidades
La API cuenta con las siguientes funcionalidades:

Consulta de productos: permite obtener información detallada de los productos disponibles en la tienda.
Gestión de pedidos: permite crear, actualizar y cancelar pedidos realizados por los clientes.
Autenticación y autorización: la API cuenta con un sistema de autenticación y autorización basado en tokens JWT para garantizar la seguridad y privacidad de la información de los usuarios.
Tecnologías utilizadas
La API está desarrollada en Node.js y utiliza los siguientes módulos y paquetes:

Express: para la creación de las rutas y middleware.
Mongoose: para la conexión y gestión de la base de datos MongoDB.
JWT: para la generación y verificación de tokens JWT.
Documentación
La documentación completa de la API se encuentra en el archivo docs.yml. Allí encontrarás información detallada sobre las rutas, parámetros y respuestas de la API.

#Instalación y uso
Para instalar y utilizar la API, sigue los siguientes pasos:

#Clona el repositorio en tu máquina local:
bash
Copy code
git clone https://github.com/AlejandroGarcia77/Api_Comercio.git
Instala las dependencias de la API:
Copy code
npm install
Configura las variables de entorno en el archivo .env, con los valores de conexión a la base de datos MongoDB y la clave secreta para la generación de tokens JWT.

#Inicia la API:

npm start
Realiza las peticiones a la API mediante la URL http://localhost:3000.

#Autor
API de Comercio ha sido desarrollada por Alejandro García. Puedes contactar conmigo en mi dirección de correo electrónico: alexggallego@gmail.com.
