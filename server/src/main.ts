import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { CustomValidationPipe } from "./common/validation.pipe";
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add body parser middleware with explicit configuration
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Habilita o CORS para permitir requisições do React Native
  app.enableCors({
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  configureSwagger(app);
  configureValidationPipe(app);
  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`🚀 Server running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api`);
}

function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Montis API")
    .setDescription("API completa para o aplicativo Montis - Suporte à Sobriedade")
    .setVersion("1.0")
    .addTag("Authentication", "Endpoints de autenticação e gerenciamento de usuários")
    .addTag("Sobriety", "Endpoints para rastreamento de sobriedade")
    .addTag("Goals", "Endpoints para metas e conquistas")
    .addTag("Support", "Endpoints para recursos de suporte")
    .addTag("Notifications", "Endpoints para notificações push")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
}

function configureValidationPipe(app: INestApplication) {
  app.useGlobalPipes(new CustomValidationPipe());
}

bootstrap();