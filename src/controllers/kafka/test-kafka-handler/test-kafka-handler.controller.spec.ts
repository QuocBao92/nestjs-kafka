import { Test, TestingModule } from '@nestjs/testing';
import { TestKafkaHandlerController } from './test-kafka-handler.controller';

describe('TestKafkaHandler Controller', () => {
  let controller: TestKafkaHandlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestKafkaHandlerController],
    }).compile();

    controller = module.get<TestKafkaHandlerController>(TestKafkaHandlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
