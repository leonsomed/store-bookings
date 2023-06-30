import { uuid } from 'uuidv4';
import { NewInstructorPayload, Product, Services } from '..';
import { prisma } from '../../client';

export class InstructorService {
  private services: Services = null as unknown as Services;

  init(services: Services) {
    this.services = services;
  }

  async createInstructor(payload: NewInstructorPayload) {
    const user = await prisma.user.create({
      data: {
        id: uuid(),
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
    });

    return await prisma.instructor.create({
      data: {
        id: uuid(),
        userId: user.id,
      },
      include: { user: true },
    });
  }
}
