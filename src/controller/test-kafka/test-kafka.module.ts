import { Module } from '@nestjs/common';
import { TestKafkaController } from './test-kafka.controller';

@Module({
  controllers: [TestKafkaController]
})
export class TestKafkaModule {}
