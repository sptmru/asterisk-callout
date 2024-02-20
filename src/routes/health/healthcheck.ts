import { FastifyReply, FastifyRequest } from 'fastify';

export const healthcheck = (_request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ status: 'healthy' });
};
