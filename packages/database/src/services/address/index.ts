import { uuid } from 'uuidv4';
import { NewAddressResponse, NewAddressPayload, Services } from '..';
import { prisma } from '../../client';

export class AddressService {
  private services: Services = null as unknown as Services;

  init(services: Services) {
    this.services = services;
  }

  async createAddress(address: NewAddressPayload): Promise<NewAddressResponse> {
    const id = uuid();
    const street2 = ''; // TODO
    const geoJson = `{"type": "Point","coordinates": [${address.coordinates.join(
      ','
    )}]}`;
    await prisma.$executeRaw`INSERT INTO "Address" (id, street, street2, city, state, zip, country, coords) values (${id}, ${address.street}, ${street2}, ${address.city}, ${address.state}, ${address.zip}, ${address.country}, ST_GeomFromGeoJSON(${geoJson}))`;

    const doc = await prisma.address.findFirst({ where: { id } });

    if (!doc) {
      throw new Error(`Address not found ${id}`);
    }

    return { address: doc, coordinates: address.coordinates };
  }

  async getAddressGeo(
    addressId: string,
    options: { coordinates?: boolean; isochrone?: boolean }
  ) {
    const select = [
      ...(options.coordinates
        ? ['ST_X(coords) AS lat, ST_Y(coords) AS lng']
        : []),
      ...(options.isochrone ? ['ST_AsGeoJson(geo) AS isochrone'] : []),
    ];

    const result = (await prisma.$queryRawUnsafe(
      `SELECT ${select.join(',')} FROM "Address" WHERE id='${addressId}'`
    )) as {
      lat?: number;
      lng?: number;
      isochrone?: string;
    }[];

    return {
      coordinates:
        result[0].lat && result[0].lng
          ? ([result[0].lat, result[0].lng] as [number, number])
          : undefined,
      isochrone: result[0].isochrone
        ? (JSON.parse(result[0].isochrone) as {
            type: string;
            coordinates: number[][][];
          })
        : undefined,
    };
  }

  async updateIsochroneForAddress(addressId: string, minutes: number) {
    const { coordinates } = await this.services.addressService.getAddressGeo(
      addressId,
      { coordinates: true }
    );

    if (!coordinates) {
      throw new Error(`Address ${addressId} does not have coordinates`);
    }

    const geomtery =
      await this.services.mapboxService.getIsochroneForCoordinates(
        coordinates,
        minutes
      );
    await prisma.$executeRaw`UPDATE "Address" SET geo = ST_GeomFromGeoJSON(${JSON.stringify(
      geomtery
    )}) WHERE id = ${addressId}`;
  }
}
