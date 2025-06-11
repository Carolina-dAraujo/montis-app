import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS para permitir requisições do React Native
  app.enableCors();

  configureSwagger(app);
  configureValidationPipe(app);
  await app.listen(process.env.PORT ?? 3000);
}

function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("MundoII Firebase Auth")
    .setDescription("Auth API for MundoII")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
}

function configureValidationPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
}

bootstrap();