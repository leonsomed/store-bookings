import { uuid } from 'uuidv4';
import {
  EditInstructorPayload,
  NewInstructorPayload,
  Product,
  Services,
} from '..';
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
      include: { user: { include: { address: true } } },
    });
  }

  async editInstructor({ id, ...payload }: EditInstructorPayload) {
    const instructor = await prisma.instructor.findFirst({
      where: {
        id,
      },
    });

    if (!instructor) {
      throw new Error(`Instructor not found ${id}`);
    }

    // TODO if addressId changes, then update the isochrone

    await prisma.user.update({
      where: {
        id: instructor.userId,
      },
      data: payload,
    });

    return await prisma.instructor.findFirst({
      where: {
        id,
      },
      include: { user: { include: { address: true } } },
    });
  }
}
