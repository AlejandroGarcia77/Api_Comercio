const request = require('supertest');

const app = require('../app');

describe('Usabilidad usuario anonimo', ()=>{
    it('Buscamos todas la páginas en orden descendente de rating',async ()=>{

        const response = await request(app)
                        .get('/api/paginas?orden=-1')
                        .expect(200)
        expect(response.body[0].titulo).toEqual("Deportes-Madrid")
    })
    it('Buscamos la página Deportes-Madrid',async ()=>{

        const response = await request(app)
                        .get('/api/paginas/Deportes-Madrid')
                        .expect(200)
        expect(response.body.titulo).toEqual("Deportes-Madrid")
    })
    it('Buscamos las paginas que hay en Madrid',async ()=>{

        const response = await request(app)
                        .get('/api/paginas/buscar/Madrid')
                        .expect(200)
        expect(response.body[0].titulo).toEqual("Deportes-Madrid")
    })
    //!Gestion de errores
    it('Error al buscar las paginas que hay en Granada',async ()=>{

        const response = await request(app)
                        .get('/api/paginas/buscar/Granada')
                        .expect(403)
        expect(response.body.errors[0].msg).toEqual("No hay paginas de Granada")
    })
    it('Buscamos las paginas que hay en Madrid que esten relacionadas con Deportes',async ()=>{

        const response = await request(app)
                        .get('/api/paginas/buscar/Madrid/Deportes')
                        .expect(200)
        expect(response.body[0].titulo).toEqual("Deportes-Madrid")
    })
})

describe('Usabilidad usuario registrado',()=>{
    var token = "";

    it('Realizamos el registro del usuario',async ()=>{

        const response = await request(app)
                        .post('/api/usuarios/')
                        .send({
                            "email":"usuarioPrueba@gmail.com",
                            "nombre":"usuarioPrueba",
                            "contrasenia":"DEmh%6Uv17tFn8E6",
                            "edad":20,
                            "ciudad":"Madrid",
                            "intereses":["Deporte","Comida"],
                            "permiteRecibirOfertas":"true"
                        })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text.split(":")[0]).toEqual("Token creado")                
        token = response.text.split(":")[1]
    })
    it('Actualizamos datos del usuario',async ()=>{
        const response = await request(app)
                        .put('/api/usuarios/')
                        .auth(token, { type: 'bearer' })
                        .send({
                            "nombre":"usuarioPruebaActualizado",
                            "edad":18,
                            "permiteRecibirOfertas":"false"
                        })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text).toEqual("Usuario con el email: usuarioPrueba@gmail.com ha sido actualizado correctamente.")
    })
    it('Añadimos una reseña',async ()=>{
        const response = await request(app)
                        .patch('/api/paginas/Deportes-Madrid')
                        .auth(token, { type: 'bearer' })
                        .send({
                            "reseña":{
                                "puntuacion":5,
                                "comentario":"Me parece muy guay!!!!"
                            }
                        })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text).toEqual("El usuario usuarioPrueba@gmail.com ha publicado su reseña en Deportes-Madrid con exito")
    })
    it('Eliminamos el usuario',async ()=>{
        const response = await request(app)
                        .delete('/api/usuarios/')
                        .auth(token, { type: 'bearer' })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text).toEqual("Usuario con email: usuarioPrueba@gmail.com ha sido eliminado correctamente")
    })
})

describe('Usabilidad del administrador',()=>{
    var token = "";

    it('Realizamos el registro del usuario administrador',async ()=>{

        const response = await request(app)
                        .post('/api/usuarios/')
                        .send({
                            "email":"admin@gmail.com",
                            "nombre":"admin",
                            "contrasenia":"DEmh%6Uv17tFn8E6",
                            "edad":20,
                            "ciudad":"Madrid",
                            "intereses":["Deporte","Comida"],
                            "permiteRecibirOfertas":"true"
                        })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text.split(":")[0]).toEqual("Token creado")                
        token = response.text.split(":")[1]
    })
    it('Creamos un comercio',async ()=>{
        const response = await request(app)
                        .post('/api/comercios/')
                        .auth(token, { type: 'bearer' })
                        .send({
                            "CIF":"J34251595",
                            "nombre":"Comercio prueba",
                            "direccion":"Calle prueba 22",
                            "resumen":"Somos un comercio de prueba",
                            "email":"comercioPrueba@gmail.com",
                            "telefonos":["+34618052087","779170835"]
                        })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text.split(":")[0]).toEqual("Token creado")
    })
    it('Actualizamos un comercio',async ()=>{
        const response = await request(app)
                        .put('/api/comercios/J34251595')
                        .auth(token, { type: 'bearer' })
                        .send({
                            "nombre":"Comercio prueba Actualizado",
                            "direccion":"Calle prueba Actualizada 22",
                        })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text).toEqual("Comercio con CIF:J34251595 ha sido actualizado correctamente.")
    })
    it('Buscamos todos los comercios',async ()=>{
        const response = await request(app)
        .get('/api/comercios')
        .auth(token, { type: 'bearer' })
        .set('Accept','application/json')
        .expect(200)
        expect(response.body[0].nombre).toEqual("Comercio Pepe")
        expect(response.body[0].email).toEqual("comerciosPepe@gmail.com")
    })
    it('Buscamos el comercio con CIF J34251595',async ()=>{
        const response = await request(app)
                        .get('/api/comercios/J34251595')
                        .auth(token, { type: 'bearer' })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.body.nombre).toEqual("Comercio prueba Actualizado")
        expect(response.body.email).toEqual("comercioPrueba@gmail.com")
    })
    it('Eliminamos un comercio',async ()=>{
        const response = await request(app)
                        .delete('/api/comercios/J34251595')
                        .auth(token, { type: 'bearer' })
                        .expect(200)
        expect(response.text).toEqual("El comercio con el CIF:J34251595 ha sido eliminado correctamente y su pagina.")
    })
    it('Eliminamos el administrador',async ()=>{
        const response = await request(app)
                        .delete('/api/usuarios/')
                        .auth(token, { type: 'bearer' })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text).toEqual("Usuario con email: admin@gmail.com ha sido eliminado correctamente")
    })
})

describe('Usabilidad del comercio',  ()=>{

    var token = "";
    var token_comercio = "";

    it('Realizamos el registro del usuario administrador',async ()=>{

        const response = await request(app)
                        .post('/api/usuarios/')
                        .send({
                            "email":"admin@gmail.com",
                            "nombre":"admin",
                            "contrasenia":"DEmh%6Uv17tFn8E6",
                            "edad":20,
                            "ciudad":"Barcelona",
                            "intereses":["Deporte","Comida"],
                            "permiteRecibirOfertas":"true"
                        })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text.split(":")[0]).toEqual("Token creado")                
        token = response.text.split(":")[1]
    })
    it('Creamos un comercio',async ()=>{
        const response = await request(app)
                        .post('/api/comercios/')
                        .auth(token, { type: 'bearer' })
                        .send({
                            "CIF":"J34251595",
                            "nombre":"Comercio prueba",
                            "direccion":"Calle prueba 22",
                            "resumen":"Somos un comercio de prueba",
                            "email":"comercioPrueba@gmail.com",
                            "telefonos":["+34618052087","779170835"]
                        })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text.split(":")[0]).toEqual("Token creado")
        token_comercio = response.text.split(":")[1]
    })
    it('Creamos una página',async ()=>{
        const response = await request(app)
                        .post('/api/paginas/')
                        .auth(token_comercio, { type: 'bearer' })
                        .send({
                            "titulo":"PaginaPrueba",
                            "ciudad":"Madrid",
                            "actividad":"Prueba",
                            "resumen":"Esto es una web de prueba",
                            "textos":["Hola","Hola","Hola","Hola","Hola","Hola"],
                            "fotos":["Hola.img","Hola.img","Hola.img","Hola.img","Hola.img","Hola.img"],
                            "reseñas":[{"puntuacion":4,"comentario":"Me parece muy guay"}]
                        })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text).toEqual("La pagina PaginaPrueba ha sido creada con exito y asignada a comercioPrueba@gmail.com")
    })
    it('Actualizamos una página',async ()=>{
        const response = await request(app)
                        .put('/api/paginas/')
                        .auth(token_comercio, { type: 'bearer' })
                        .send({
                            "titulo":"PaginaPrueba-Actualizada",
                            "ciudad":"Barcelona",
                        })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text).toEqual("Página PaginaPrueba-Actualizada ha sido actualizada correctamente.")
    })
    it('Añadimos una foto a la página',async ()=>{
        const response = await request(app)
                        .post('/api/paginas/foto')
                        .auth(token_comercio, { type: 'bearer' })
                        //!Ruta desde app.js
                        .attach('image', './test/esp.png')
                        .set('Content-Type', 'multipart/form-data; boundary=Boundry')
                        .expect(200)
        expect(response.text.split(":")[0]).toEqual("Página PaginaPrueba-Actualizada se ha añadido la foto")
    })
    it('Actualizar una foto a la página',async ()=>{
        const response = await request(app)
                        .put('/api/paginas/foto/0')
                        .auth(token_comercio, { type: 'bearer' })
                        //!Ruta desde app.js
                        .attach('image', './test/esp.png')
                        .set('Content-Type', 'multipart/form-data; boundary=Boundry')
                        .expect(200)
        expect(response.text.split(":")[0]).toEqual("Página PaginaPrueba-Actualizada ha añadido la foto")
    })
    //!Gestion de errores
    it('Error al actualizar una foto a la página',async ()=>{
        const response = await request(app)
                        .put('/api/paginas/foto/1')
                        .auth(token_comercio, { type: 'bearer' })
                        //!Ruta desde app.js
                        .attach('image', './test/esp.png')
                        .set('Content-Type', 'multipart/form-data; boundary=Boundry')
                        .expect(403)
        expect(response.text).toEqual("No hay una imagen registrada en la posicion 1")
    })
    
    it('Añadimos un texto a la página',async ()=>{
        const response = await request(app)
                        .post('/api/paginas/texto')
                        .auth(token_comercio, { type: 'bearer' })
                        .send({
                            "texto":"Esto es un texto de prueba"
                        })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text.split(":")[0]).toEqual("Página PaginaPrueba-Actualizada se ha añadido el texto")
    })
    it('Actualizar un texto a la página',async ()=>{
        const response = await request(app)
                        .put('/api/paginas/texto/0')
                        .auth(token_comercio, { type: 'bearer' })
                        .send({
                            "texto":"Esto es un texto de prueba Actualizado"
                        })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text.split(":")[0]).toEqual("Página PaginaPrueba-Actualizada ha añadido el texto")
    })
    //!Gestion de errores
    it('Error al actualizar un texto a la página',async ()=>{
        const response = await request(app)
                        .put('/api/paginas/texto/1')
                        .auth(token_comercio, { type: 'bearer' })
                        .send({
                            "texto":"Esto es un texto de prueba Actualizado"
                        })
                        .set('Accept','application/json')
                        .expect(403)
       expect(response.text).toEqual("No hay un texto registrado en la posicion 1")
    })

    it('Buscamos los usuarios de la misma ciudad que el comercio y permitan recibir ofertas ordenados por inicio de sesion descendente',async ()=>{
        const response = await request(app)
                        .get('/api/usuarios?orden=-1')
                        .auth(token_comercio, { type: 'bearer' })
                        .expect(200)
        expect(response.body[0].email).toEqual("admin@gmail.com")
        expect(response.body[0].ciudad).toEqual("Barcelona")
    })
    it('Eliminamos la página',async ()=>{
        const response = await request(app)
                        .delete('/api/paginas')
                        .auth(token_comercio, { type: 'bearer' })
                        .expect(200)
        expect(response.text).toEqual("Página PaginaPrueba-Actualizada eliminada correctamente.")
    })
    it('Eliminamos un comercio',async ()=>{
        const response = await request(app)
                        .delete('/api/comercios/J34251595')
                        .auth(token, { type: 'bearer' })
                        .expect(200)
        expect(response.text).toEqual("El comercio con el CIF:J34251595 ha sido eliminado correctamente y su pagina.")
    })
    it('Eliminamos el administrador',async ()=>{
        const response = await request(app)
                        .delete('/api/usuarios/')
                        .auth(token, { type: 'bearer' })
                        .set('Accept','application/json')
                        .expect(200)
        expect(response.text).toEqual("Usuario con email: admin@gmail.com ha sido eliminado correctamente")
    })
})