import { uuid } from 'uuidv4';
import { EditInstructorPayload, NewInstructorPayload, Services } from '..';
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
      include: { user: true },
    });

    if (!instructor) {
      throw new Error(`Instructor not found ${id}`);
    }

    if (payload.addressId && instructor.user.addressId !== payload.addressId) {
      await this.services.addressService.updateIsochroneForAddress(
        payload.addressId,
        30
      );
    }

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
