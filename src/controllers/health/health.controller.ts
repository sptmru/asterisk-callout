import { FastifyReply, FastifyRequest } from 'fastify';
import { HealthStatusEnum } from '../../domain/enums/healthstatus.enum';
import { HealthResponseInterface } from '../../domain/interfaces/health.interface';

export class HealthController {
  static healthcheck(_request: FastifyRequest, reply: FastifyReply): FastifyReply {
    const payload: HealthResponseInterface = { status: HealthStatusEnum.HEALTHY };
    return reply.code(200).send(payload);
  }
}
