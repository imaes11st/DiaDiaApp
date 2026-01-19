# Configuración de Firebase para DiaDia

## 🚀 Pasos para configurar Firebase

### 1. Crear proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto" o "Add project"
3. Ingresa el nombre: `diadia-app`
4. Sigue los pasos para crear el proyecto

### 2. Habilitar Authentication
1. En el menú lateral, ve a **Authentication**
2. Haz clic en **Comenzar**
3. Ve a la pestaña **Método de inicio de sesión**
4. Habilita **Correo electrónico/contraseña**
5. Haz clic en **Guardar**

### 3. Configurar Firestore Database
1. En el menú lateral, ve a **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Selecciona **Comenzar en modo de prueba** (para desarrollo)
4. Elige una ubicación (recomendado: `us-central1`)
5. Haz clic en **Listo**

### 4. Obtener configuración del proyecto
1. Ve a **Configuración del proyecto** (icono de engranaje)
2. Desplázate hacia abajo hasta **Tus apps**
3. Haz clic en el ícono de **Web** (`</>`) para agregar una app web
4. Registra la app con nombre: `DiaDia Web`
5. **Copia la configuración** que aparece

### 5. Configurar en el proyecto
1. Abre el archivo `config/firebase.ts`
2. Reemplaza la configuración con los valores de tu proyecto:

```typescript
const firebaseConfig = {
  apiKey: "tu-api-key-aqui",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

### 6. Instalar dependencias
```bash
npm install firebase
```

### 7. Probar la app
```bash
npx expo start
```

## 📱 Funcionalidades con Firebase

✅ **Autenticación segura** - Login/registro con email y contraseña
✅ **Base de datos en tiempo real** - Sincronización automática
✅ **Multi-dispositivo** - Tus hábitos en todos tus dispositivos
✅ **Backup automático** - Nunca pierdes tus datos
✅ **Escalabilidad** - Crece con tu app

## 🔧 Estructura de la base de datos

### Colección: `users`
```json
{
  "id": "firebase-user-id",
  "email": "usuario@email.com",
  "name": "Nombre del usuario",
  "createdAt": "2024-01-17T10:00:00.000Z"
}
```

### Colección: `habits`
```json
{
  "title": "Hacer ejercicio",
  "priority": "high",
  "createdAt": "2024-01-17T10:00:00.000Z",
  "lastDoneAt": "2024-01-17T10:00:00.000Z",
  "streak": 5,
  "userId": "firebase-user-id"
}
```

### Colección: `profiles`
```json
{
  "name": "Nombre del usuario",
  "role": "Profesión",
  "avatarUri": "https://..."
}
```

## 🆘 Solución de problemas

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"
- Verifica que la configuración en `firebase.ts` sea correcta
- Asegúrate de que las dependencias estén instaladas

### Error: "Missing or insufficient permissions"
- Verifica que Firestore esté en modo de prueba
- Revisa las reglas de seguridad de Firestore

### Error de autenticación
- Verifica que Authentication esté habilitado
- Confirma que el método de email/contraseña esté activo

¿Necesitas ayuda con algún paso específico?