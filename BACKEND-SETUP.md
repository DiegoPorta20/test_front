# Configuración del Backend

## Error: HttpErrorResponse status 0

Este error indica que el frontend no puede conectarse al backend. Aquí están las soluciones:

## ✅ Solución 1: Asegúrate que el backend esté corriendo

1. Abre una terminal en tu proyecto backend NestJS
2. Ejecuta:
```bash
npm run start:dev
```

3. Verifica que el servidor esté corriendo en `http://localhost:3000`

## ✅ Solución 2: Configurar CORS en el Backend

El backend NestJS debe permitir solicitudes desde el frontend Angular. 

### Opción A: En el archivo `main.ts` del backend

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:4200', // URL del frontend Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(3000);
}
bootstrap();
```

### Opción B: CORS permisivo (solo para desarrollo)

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS permisivo para desarrollo
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
```

## ✅ Solución 3: Configurar WebSocket CORS

Si estás usando WebSocket Gateway, también necesitas configurar CORS ahí:

En tu `WebSocketGateway`:

```typescript
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // ... tu código
}
```

## ✅ Solución 4: Verificar las URLs

Asegúrate que las URLs en `src/environments/environment.ts` sean correctas:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',  // Puerto del backend REST
  wsUrl: 'http://localhost:3000',   // Puerto del WebSocket (puede ser diferente)
};
```

## ✅ Solución 5: Verificar que los endpoints existan

Asegúrate de que tu backend tenga estos controladores:

### S3Controller
```typescript
@Controller('s3')
export class S3Controller {
  @Post('upload')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // implementación
  }

  @Post('upload-multiple')
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    // implementación
  }

  @Get('files')
  async listFiles() {
    // implementación
  }

  @Post('download')
  async getDownloadUrl(@Body() body: { key: string }) {
    // implementación
  }

  @Delete('delete')
  async deleteFile(@Body() body: { key: string }) {
    // implementación
  }
}
```

### SQSController
```typescript
@Controller('sqs')
export class SqsController {
  @Post('send')
  async sendMessage(@Body() body: any) {
    // implementación
  }

  @Post('send-batch')
  async sendBatchMessages(@Body() body: { messages: any[] }) {
    // implementación
  }

  @Get('receive')
  async receiveMessages(@Query('maxMessages') maxMessages?: number) {
    // implementación
  }

  @Get('attributes')
  async getQueueAttributes() {
    // implementación
  }
}
```

### SESController
```typescript
@Controller('ses')
export class SesController {
  @Post('send-email')
  async sendEmail(@Body() body: any) {
    // implementación
  }

  @Post('send-bulk')
  async sendBulkEmail(@Body() body: { emails: string[], subject: string, body: string }) {
    // implementación
  }

  @Post('send-templated')
  async sendTemplatedEmail(@Body() body: any) {
    // implementación
  }

  @Post('templates')
  async createTemplate(@Body() body: any) {
    // implementación
  }

  @Put('templates/:name')
  async updateTemplate(@Param('name') name: string, @Body() body: any) {
    // implementación
  }

  @Delete('templates/:name')
  async deleteTemplate(@Param('name') name: string) {
    // implementación
  }

  @Get('templates')
  async listTemplates() {
    // implementación
  }

  @Get('templates/:name')
  async getTemplate(@Param('name') name: string) {
    // implementación
  }
}
```

## ✅ Solución 6: Verificar el firewall

Si usas Windows Firewall o antivirus, asegúrate de que Node.js tenga permisos para usar el puerto 3000.

## 🧪 Probar la conexión

Puedes probar si el backend está accesible desde el navegador:

1. Abre el navegador
2. Ve a `http://localhost:3000`
3. Deberías ver alguna respuesta del backend

O usa curl/PowerShell:

```powershell
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
```

```bash
# Bash/cmd
curl http://localhost:3000
```

## 📋 Checklist de verificación

- [ ] Backend está corriendo en el puerto 3000
- [ ] CORS está habilitado en main.ts
- [ ] WebSocket Gateway tiene CORS configurado
- [ ] Las URLs en environment.ts son correctas
- [ ] Los controladores S3, SQS, SES existen
- [ ] No hay firewall bloqueando el puerto 3000
- [ ] El navegador puede acceder a http://localhost:3000

## 🔧 Comandos útiles

```bash
# Ver si el puerto 3000 está en uso
netstat -ano | findstr :3000

# Reiniciar el backend
# Ctrl+C para detener
npm run start:dev
```

## 📞 Si el problema persiste

1. Revisa la consola del backend para ver errores
2. Abre DevTools del navegador (F12) → Network tab
3. Intenta hacer una solicitud y revisa los detalles del error
4. Verifica que no haya errores de TypeScript en el backend
