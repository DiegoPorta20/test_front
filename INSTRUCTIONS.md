# Sistema de Gestión AWS - Angular Application

Aplicación Angular moderna para gestionar servicios AWS con interfaz elegante usando ng-zorro-antd.

## 🚀 Características

### 📬 Notificaciones en Tiempo Real
- **WebSocket Integration**: Conexión en tiempo real con el backend
- **Envío a Usuario Específico**: Notificaciones dirigidas
- **Broadcast**: Envío masivo a todos los usuarios conectados
- **Salas**: Notificaciones a grupos específicos
- **Mensajes Directos**: Chat entre usuarios
- **Estados de Conexión**: Visualización de usuarios conectados
- **Historial**: Timeline de notificaciones recibidas
- **Tipos Múltiples**: INFO, SUCCESS, WARNING, ERROR, FILE_UPLOADED, EMAIL_SENT, MESSAGE_RECEIVED

### ☁️ Gestión de Archivos S3
- **Upload Simple**: Sube un archivo a la vez
- **Upload Múltiple**: Sube hasta 10 archivos simultáneamente
- **URLs Firmadas**: Genera URLs temporales y seguras
- **Gestión de Archivos**: Lista, visualiza y elimina archivos
- **Notificaciones**: Integración con sistema de notificaciones
- **Organización por Carpetas**: Estructura jerárquica de archivos

### 📦 Colas SQS
- **Envío de Mensajes**: Envía mensajes individuales
- **Batch Processing**: Envía múltiples mensajes en lote
- **Recepción**: Recibe mensajes de la cola
- **Atributos de Cola**: Visualiza estadísticas y configuración
- **Configuración Flexible**: Delay y atributos personalizados
- **Long Polling**: Soporte para espera eficiente de mensajes

### 📧 Correos Electrónicos SES
- **Envío Simple**: Correos individuales con HTML o texto plano
- **Envío Masivo**: Distribución a múltiples destinatarios
- **Plantillas**: Crea y gestiona plantillas reutilizables
- **Variables Dinámicas**: Personalización con datos JSON
- **Opciones Avanzadas**: CC, BCC, Reply-To
- **Gestión de Plantillas**: CRUD completo de plantillas

## 🛠️ Tecnologías

- **Angular 20** - Framework principal
- **ng-zorro-antd** - Biblioteca de componentes UI
- **Socket.IO Client** - Cliente WebSocket
- **RxJS** - Programación reactiva
- **TypeScript** - Lenguaje tipado
- **SCSS** - Estilos mejorados

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Backend NestJS corriendo (ver configuración en environment.ts)

## 🔧 Instalación

1. **Clonar el repositorio** (si aplica)
```bash
git clone <url-del-repo>
cd test_desing
```

2. **Instalar dependencias**
```bash
npm install --legacy-peer-deps
```

3. **Configurar el entorno**
Edita `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // URL de tu backend
  wsUrl: 'http://localhost:3000',   // URL para WebSocket
};
```

4. **Iniciar la aplicación**
```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Dashboard principal
│   │   ├── notifications/      # Gestión de notificaciones
│   │   ├── s3/                 # Gestión de archivos S3
│   │   ├── sqs/                # Gestión de colas SQS
│   │   └── ses/                # Gestión de correos SES
│   ├── services/
│   │   ├── notification.service.ts  # Servicio de notificaciones
│   │   ├── s3.service.ts           # Servicio de S3
│   │   ├── sqs.service.ts          # Servicio de SQS
│   │   └── ses.service.ts          # Servicio de SES
│   ├── app.ts                  # Componente raíz
│   ├── app.html                # Template principal
│   ├── app.scss                # Estilos principales
│   ├── app.routes.ts           # Configuración de rutas
│   └── app.config.ts           # Configuración de la app
├── environments/
│   └── environment.ts          # Variables de entorno
└── styles.scss                 # Estilos globales
```

## 🎨 Características de UI/UX

- **Diseño Responsive**: Adaptable a todos los tamaños de pantalla
- **Sidebar Colapsable**: Navegación optimizada
- **Tema Oscuro en Sidebar**: Contraste visual elegante
- **Animaciones Suaves**: Transiciones fluidas
- **Cards Interactivos**: Hover effects y feedback visual
- **Notificaciones Toast**: Feedback instantáneo de acciones
- **Estados de Carga**: Spinners y estados de loading

## 📡 APIs del Backend

### Notificaciones
- `POST /notifications/send` - Enviar a usuario específico
- `POST /notifications/broadcast` - Broadcast a todos
- `POST /notifications/room` - Enviar a sala
- `GET /notifications/status/:userId` - Estado de usuario
- `GET /notifications/connected` - Usuarios conectados

### S3
- `POST /s3/upload` - Subir archivo
- `POST /s3/upload-multiple` - Subir múltiples archivos
- `GET /s3/signed-url/:key` - Obtener URL firmada
- `DELETE /s3/:key` - Eliminar archivo

### SQS
- `POST /sqs/send` - Enviar mensaje
- `POST /sqs/send-batch` - Enviar batch
- `GET /sqs/receive` - Recibir mensajes
- `GET /sqs/attributes` - Atributos de cola

### SES
- `POST /ses/send` - Enviar correo simple
- `POST /ses/send-templated` - Enviar con plantilla
- `POST /ses/send-bulk` - Envío masivo
- `POST /ses/templates` - Crear plantilla
- `PUT /ses/templates/:name` - Actualizar plantilla
- `DELETE /ses/templates/:name` - Eliminar plantilla
- `GET /ses/templates` - Listar plantillas
- `GET /ses/templates/:name` - Obtener plantilla

## 🔌 WebSocket Events

### Cliente emite:
- `register` - Registrar usuario con socketId
- `sendMessage` - Enviar mensaje directo a usuario
- `broadcast` - Enviar mensaje a todos
- `joinRoom` - Unirse a una sala
- `leaveRoom` - Salir de una sala
- `roomMessage` - Enviar mensaje a sala

### Cliente escucha:
- `connect` - Conexión establecida
- `welcome` - Mensaje de bienvenida
- `registered` - Usuario registrado exitosamente
- `disconnect` - Desconexión
- `notification` - Nueva notificación recibida
- `newMessage` - Mensaje directo recibido
- `broadcastMessage` - Mensaje broadcast
- `roomMessage` - Mensaje de sala
- `userJoined` - Usuario unido a sala
- `userLeft` - Usuario salió de sala

## 🚦 Scripts Disponibles

```bash
# Desarrollo
npm start                # Inicia el servidor de desarrollo

# Build
npm run build           # Build para producción
npm run build:dev       # Build para desarrollo

# Testing
npm test               # Ejecuta los tests

# Linting
npm run lint           # Verifica el código
```

## 🎯 Uso

### Dashboard
Al iniciar la aplicación, verás el dashboard con:
- Estadísticas generales
- Accesos rápidos a cada módulo
- Características principales

### Notificaciones
1. Conecta automáticamente al WebSocket
2. Selecciona el tipo de notificación (Usuario, Broadcast, Sala)
3. Completa el formulario
4. Envía y observa el feedback en tiempo real

### Archivos S3
1. Selecciona archivo(s) a subir
2. Opcionalmente especifica carpeta y userId
3. Visualiza archivos subidos
4. Genera URLs firmadas o elimina archivos

### Colas SQS
1. Envía mensajes individuales o por lote
2. Recibe mensajes de la cola
3. Visualiza atributos de la cola
4. Configura delays y atributos personalizados

### Correos SES
1. Envía correos simples con HTML o texto
2. Crea plantillas reutilizables
3. Envío masivo a múltiples destinatarios
4. Gestiona plantillas (crear, editar, eliminar)
5. Usa plantillas con datos dinámicos

## 🔐 Seguridad

- Todas las comunicaciones son HTTP/HTTPS
- URLs firmadas con expiración configurable
- WebSocket con autenticación por userId
- Validación de formularios en cliente

## 🐛 Troubleshooting

### WebSocket no conecta
- Verifica que el backend esté corriendo
- Revisa la URL en `environment.ts`
- Comprueba CORS en el backend

### Errores de CORS
- Asegúrate de que el backend permita el origen
- Verifica la configuración de CORS en NestJS

### Estilos no cargan
- Ejecuta `npm install --legacy-peer-deps`
- Limpia caché: `npm cache clean --force`
- Reinicia el servidor de desarrollo

## 📝 Notas Adicionales

- La aplicación usa **Zoneless Change Detection** de Angular
- Los componentes son **standalone** para mejor tree-shaking
- Rutas con **lazy loading** para optimizar carga inicial
- **RxJS** para manejo de estado reactivo

## 🤝 Contribución

Para contribuir:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto.

## 👨‍💻 Desarrollado con

- ❤️ y ☕
- Angular 20
- ng-zorro-antd
- Mucha creatividad

---

**¡Disfruta usando esta aplicación!** 🎉
