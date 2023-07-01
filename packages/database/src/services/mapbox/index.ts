// @ts-ignore
import mapbox from '@mapbox/mapbox-sdk/services/isochrone';
import { Services } from '..';

export class MapboxService {
  private services: Services = null as unknown as Services;

  init(services: Services) {
    this.services = services;
  }

  async getIsochroneForCoordinates(
    coordinates: [number, number],
    minutes: number
  ) {
    const client = mapbox({
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_KEY,
    });

    const response = await client
      .getContours({
        profile: 'driving',
        coordinates,
        minutes: [minutes],
        polygons: true,
      })
      .send();

    if (response.statusCode !== 200) {
      throw new Error(`Isochrone failed ${response.statusCode}`);
    }

    return response.body.features[0].geometry as {
      coordinates: number[][][];
      type: string;
    };
  }
}
