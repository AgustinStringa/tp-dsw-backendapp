# Backend Gimnasio IronHaven

Este es un proyecto desarrollado con Node, Express y Typescript para la materia Desarrollo de Software de la Universidad Tecnológica Nacional Facultad Regional Rosario.
Se trata de una API REST que es consumida por un frontend desarrollado en Angular. El sitio web dispone de información para visitantes (potenciales clientes) y cuenta con 2 niveles de acceso: uno para entrenadores y otro para clientes.

## Entrenadores

Cumplen el rol de administradores del sistema. Pueden gestionar y administrar usuarios, clases, membresías y crear rutinas para los clientes. Tienen acceso a estadísticas valiosas para la empresa, como lo son los ingresos del último mes, cantidad de membresías activas, clases que se brindan, entre otros.

## Clientes

A través de la autogestión pueden comprar membresías para asistir al gimnasio (mediante la plataforma de pagos Stripe), inscribirse a clases y registrar la ejecución de los ejercicios asignados. Disponen de secciones exclusivas para establecer metas y registrar progresos.

## Características generales

Los usuarios de cualquier tipo, pueden comunicarse a través de un chat. El sistema notifica mediante correos electrónicos la proximidad del vencimiento de una membresía, la disponibilidad de una nueva clase y el registro correcto en la plataforma. Por otra parte, se ejecutan tareas diarias automáticamente, que se encargan de enviar notificaciones al cliente y liberar cupos en las diferentes clases (ocupados por clienes que dejaron de asistir al gimnasio).

A continuación se detallan los pasos para instalar y ejecutar el proyecto de manera sencilla.

## Requisitos

- **Node.js**: Asegúrate de tener instalada la versión 20.19.0 (LTS) de Node.js. Puedes descargarla desde [nodejs.org](https://nodejs.org/).
- **npm**: npm se instala automáticamente con Node.js, pero si necesitas actualizarlo, puedes hacerlo ejecutando el siguiente comando:
  ```
  npm install -g npm
  ```

## Instalación

1. Clona este repositorio en tu computadora:

```
git clone https://github.com/AgustinStringa/tp-dsw-backendapp.git
```

2. Accede al directorio del proyecto:

```
cd tp-dsw-frontendapp
```

3. Instala las dependencias:

```
npm install
```

## Creación de un usuario inicial

Antes de acceder al sistema, es necesario que crees manualmente una entidad de tipo Trainer en la base de datos MongoDB. Puedes hacerlo utilizando MongoDB Compass o cualquier cliente de Mongo.
Ejemplo del documento:

```
{
  "firstName": "Entrenador",
  "lastName": "IronHaven",
  "email": "admin@ironhaven.com",
  // Hash de bcrypt para la contraseña 1234
  "password": "$2b$10$.i2P17aQ4jE4a7e9PJwCNei8lh6woj7ZJ5Cb4AM7f2i8Cbm19Vf7.",
  "dni": "12345678"
}
```

## Variables de entorno

Debes crear un archivo .env en la raíz del proyecto con las siguientes variables.

```
MONGO_URI=

EMAIL=
EMAIL_PASSWORD=

PORT=3000
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:4200

JWT_SECRET=your_jwt_secret
SESSION_DURATION_HOURS=1
REFRESH_TIME_MINUTES=10

STRIPE_API_KEY=
STRIPE_WEBHOOK=
```

Si quieres puedes omitir las variables del email o de Stripe ingresando cualquier string. Sin embargo, el sistema no podrá procesar pagos del usuario ni enviar notificaciones por correo electrónico.

## Ejecución

Puedes elegir cualquiera de los siguientes modos según tus necesidades. Sólo ejecuta el comando mostrado.

### Modo de desarrollo

```
npm run start:dev
```

El servidor normalmente estará disponible en `http://localhost:3000/` o el puerto que configures en tu archivo de configuración.

### Modo de producción

```
npm run build
```

Esto compilará los archivos de TypeScript. Los archivos generados se encontrarán en el directorio `dist/` listos para ser ejecutados por Node en tu servidor mediante el siguiente comando.

```
npm run start:prod
```

### Ejecutar tests

```
npm run test
```

## Autores

- **Aarón De Bernardo** - [aarondebernardo@gmail.com]
- **Agustín Stringa** - [stringaagustin1@gmail.com]
- **Elías Danteo** - [elias.danteo.tomas@hotmail.com]
- **Francisca Gramaglia** - [franciscagramaglia714@gmail.com]
