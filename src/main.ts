import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServiceAccount } from 'firebase-admin';
import { initializeFirebaseConfig } from './config/firebase-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // DEPRECATED
  const adminConfig: ServiceAccount = {
    projectId: '',
    privateKey: '',
    clientEmail: '',
  };
  await initializeFirebaseConfig(adminConfig);
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
