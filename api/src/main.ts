import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Esta linha permite que outras aplicações (como o seu React) consumam esta API
  app.enableCors();

  // O processo escutará na porta 3000
  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
