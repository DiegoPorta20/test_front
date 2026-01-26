# Sistema de Gestión de Notificaciones y Servicios AWS

Aplicación Angular moderna que integra múltiples servicios AWS (S3, SQS, SES) y sistema de notificaciones en tiempo real mediante WebSockets.

## 🚀 Características

### Notificaciones en Tiempo Real
- ✅ Conexión WebSocket bidireccional
- ✅ Envío de notificaciones a usuarios específicos
- ✅ Broadcast de mensajes a todos los usuarios conectados
- ✅ Sistema de salas (rooms) para comunicación en grupo
- ✅ 7 tipos de notificaciones: INFO, SUCCESS, WARNING, ERROR, FILE_UPLOADED, EMAIL_SENT, MESSAGE_RECEIVED
- ✅ Visualización de usuarios conectados en tiempo real
- ✅ Historial de notificaciones con timeline

### Gestión de Archivos S3
- ✅ Carga de archivos individuales y múltiples
- ✅ Visualización de archivos cargados
- ✅ Descarga de archivos con URLs firmadas temporales
- ✅ Eliminación de archivos del bucket
- ✅ Previsualización de metadatos

### Gestión de Colas SQS
- ✅ Envío de mensajes individuales a colas
- ✅ Envío de mensajes en lote (batch)
- ✅ Recepción y visualización de mensajes
- ✅ Consulta de atributos de cola (aproximación de mensajes disponibles)
- ✅ Soporte para atributos personalizados en mensajes

### Servicio de Emails SES
- ✅ Envío de emails individuales
- ✅ Envío masivo de emails (bulk)
- ✅ Gestión de plantillas de email
- ✅ Creación, edición y eliminación de plantillas
- ✅ Envío de emails usando plantillas con datos dinámicos
- ✅ Soporte para emails HTML y texto plano
- ✅ Configuración de direcciones de respuesta (Reply-To)

## 🛠️ Tecnologías

- **Angular 20** - Framework principal con zoneless change detection
- **ng-zorro-antd** - Biblioteca de componentes UI
- **Socket.IO Client** - Cliente WebSocket para comunicación en tiempo real
- **RxJS** - Programación reactiva
- **TypeScript** - Tipado estático
- **SCSS** - Estilos avanzados

## 📋 Prerequisitos

- Node.js >= 18.x
- npm >= 9.x
- Backend NestJS corriendo (ver configuración de backend más abajo)

## ⚙️ Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd test_desing
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear archivo `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',  // URL de tu backend NestJS
  wsUrl: 'http://localhost:3001'     // URL del WebSocket Gateway
};
```

4. Iniciar el servidor de desarrollo:
```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 🔧 Configuración del Backend

El backend debe estar corriendo con los siguientes endpoints:

### Notificaciones (WebSocket)
- **URL**: `ws://localhost:3001`
- **Eventos**: 
  - `register` - Registrar usuario
  - `welcome` - Mensaje de bienvenida
  - `notification` - Recibir notificaciones
  - `sendMessage` - Enviar mensaje directo
  - `broadcast` - Enviar broadcast
  - `joinRoom` - Unirse a sala
  - `leaveRoom` - Salir de sala
  - `roomMessage` - Mensaje de sala
  - `userJoined` - Usuario se unió
  - `userLeft` - Usuario salió

### API REST
Base URL: `http://localhost:3000`

#### S3
- `POST /s3/upload` - Subir archivo
- `POST /s3/upload-multiple` - Subir múltiples archivos
- `GET /s3/files` - Listar archivos
- `POST /s3/download` - Obtener URL de descarga
- `DELETE /s3/delete` - Eliminar archivo

#### SQS
- `POST /sqs/send` - Enviar mensaje
- `POST /sqs/send-batch` - Enviar mensajes en lote
- `GET /sqs/receive` - Recibir mensajes
- `GET /sqs/attributes` - Obtener atributos de cola

#### SES
- `POST /ses/send-email` - Enviar email
- `POST /ses/send-bulk` - Enviar emails masivos
- `POST /ses/send-templated` - Enviar email con plantilla
- `POST /ses/templates` - Crear plantilla
- `PUT /ses/templates/:name` - Actualizar plantilla
- `DELETE /ses/templates/:name` - Eliminar plantilla
- `GET /ses/templates` - Listar plantillas
- `GET /ses/templates/:name` - Obtener plantilla

### Variables de Entorno del Backend
```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# S3
S3_BUCKET_NAME=your-bucket-name

# SQS
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/your-queue

# SES (opcional si usas sandbox)
SES_VERIFIED_EMAIL=your-verified-email@example.com
```

## 📱 Uso de la Aplicación

### Dashboard
Página principal con resumen de estadísticas y accesos directos a las diferentes funcionalidades.

### Notificaciones
1. Conectar al WebSocket ingresando tu nombre de usuario
2. Enviar notificaciones a usuarios específicos
3. Realizar broadcasts a todos los usuarios
4. Unirse a salas para chat en grupo
5. Ver el historial de notificaciones recibidas

### S3 - Gestión de Archivos
1. **Subir Individual**: Seleccionar y subir un archivo
2. **Subir Múltiple**: Seleccionar varios archivos para subir simultáneamente
3. **Archivos Subidos**: Ver lista de archivos con opciones para descargar o eliminar

### SQS - Gestión de Colas
1. **Enviar Mensaje**: Enviar un mensaje simple a la cola
2. **Envío en Lote**: Enviar múltiples mensajes a la vez
3. **Recibir Mensajes**: Obtener mensajes de la cola
4. **Atributos**: Ver información sobre la cola

### SES - Gestión de Emails
1. **Enviar Email**: Envío individual con opciones avanzadas
2. **Envío Masivo**: Enviar el mismo email a múltiples destinatarios
3. **Plantillas**: Crear, editar y gestionar plantillas de email

## 🎨 Características de UI

- Diseño responsive adaptable a móviles y tablets
- Tema consistente con ng-zorro-antd
- Animaciones suaves en transiciones
- Feedback visual en todas las acciones
- Mensajes de notificación para éxito y errores
- Loading states en operaciones asíncronas
- Validación de formularios en tiempo real

## 📦 Scripts Disponibles

```bash
npm start          # Iniciar servidor de desarrollo
npm run build      # Compilar para producción
npm test           # Ejecutar pruebas unitarias
npm run lint       # Verificar código con ESLint
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/        # Componentes de la aplicación
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── notifications/ # Gestión de notificaciones
│   │   ├── s3/           # Gestión de archivos S3
│   │   ├── sqs/          # Gestión de colas SQS
│   │   └── ses/          # Gestión de emails SES
│   ├── services/         # Servicios de Angular
│   │   ├── notification.service.ts
│   │   ├── s3.service.ts
│   │   ├── sqs.service.ts
│   │   └── ses.service.ts
│   ├── app.config.ts     # Configuración principal
│   ├── app.routes.ts     # Rutas de la aplicación
│   └── app.ts            # Componente raíz
├── environments/         # Configuración de entornos
└── styles.scss          # Estilos globales
```

## 🐛 Solución de Problemas

### Error de conexión WebSocket
- Verificar que el backend esté corriendo
- Comprobar la URL del WebSocket en `environment.ts`
- Revisar que el puerto 3001 esté disponible

### Error en carga de archivos S3
- Verificar credenciales de AWS
- Comprobar que el bucket existe y tiene los permisos correctos
- Revisar políticas de CORS en el bucket

### Error en envío de emails SES
- Verificar que el email está verificado en AWS SES
- Si estás en sandbox, ambos emails (from y to) deben estar verificados
- Comprobar límites de envío de tu cuenta SES

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Autor

Desarrollado para gestión integrada de servicios AWS y notificaciones en tiempo real.
