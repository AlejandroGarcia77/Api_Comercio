const express = require("express")
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require("cors")
const dbConnectNoSql = require("./config/mongo")
require("dotenv").config();
const loggerStream = require("./utils/handleLogger")
const morganBody = require("morgan-body")
const swaggerUi = require("swagger-ui-express")
const YAML = require('yamljs');

const app = express()

//*Bloquemos a 100 peticiones cada 15 minutos por IP
const limiter = rateLimit({
    windowMs: 15*60*1000, //*15 minutos
    max: 100 //*Limite de solicitudes por IP
})

//*Protegemos las cabeceras para evitar cross-site scripting (XSS), clickjacking y otros ataques de inyección de código.
app.use(helmet())

//*Activamos el limitador de peticiones
app.use(limiter)

app.use(cors()) 
app.use(express.json())

app.use(express.static("storage")) 

//* 1.- Sniffer de todo las peticiones y respuestas
morganBody(app, { //*Para ver las distintas configuraciones que podemos pasarle en este objeto, mirad la doc en la parte de API
    noColors: true, //*limpiamos el String de datos lo máximo posible antes de mandarlo a Slack
    skip: function(req, res) { //*Solo enviamos errores (4XX de cliente y 5XX de servidor)
        return res.statusCode < 400
    },
    stream: loggerStream
})

//*Cargamos el fichero yaml
const swaggerSpecs = YAML.load('./docs/swagger.yml')

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

app.use("/api", require("./routes"))



dbConnectNoSql() 

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("🚀 Servidor escuchando en el puerto " + port)
    console.log("🌐📕 Documentacion en la url:" + process.env.PUBLIC_URL+"/api/docs")
    console.log("📕 Documentacion en la url:" + process.env.LOCAL_URL+"/api/docs")
})

module.exports = app