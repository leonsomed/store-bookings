import { getServices, prisma } from 'database';
import { Heading } from '../../../components/Heading';
import { SimplePageLayout } from '../../../components/SimplePageLayout';
import {
  PageParamsProps,
  getParam,
  routes,
} from '../../../services/navigation';
import { SimpleCard } from '../../../components/SimpleCard';
import { LabelPair } from '../../../components/LabelPair';
import { LinkButton } from '../../../components/Link';
import { getAddressLine } from '../../../services/format';
import { MapBox } from './MapBox';
import { getMapLink } from '../../../services/mapbox';

export const REVALIDATE_SECONDS = 1;

async function getInstructorDetails(id: string) {
  const { addressService } = getServices();
  const instructor = await prisma.instructor.findFirst({
    where: { id },
    include: { user: { include: { address: true } } },
  });
  const geo = await addressService.getAddressGeo(instructor.user.addressId, {
    coordinates: true,
    isochrone: true,
  });
  return { instructor, geo };
}

export default async function InstructorPage({ params }: PageParamsProps) {
  const instructorId = getParam('instructorId', params);
  const { instructor, geo } = await getInstructorDetails(instructorId);

  return (
    <SimplePageLayout>
      <SimpleCard>
        <div className="flex justify-between">
          <Heading>Instructor</Heading>
          <LinkButton
            variant="primary"
            href={routes.instructor.edit(instructorId)}
          >
            Edit
          </LinkButton>
        </div>
        <br />
        <div className="flex justify-between">
          <div className="w-[500px]">
            <LabelPair label="Email" value={instructor.user.email} />
            <LabelPair label="First Name" value={instructor.user.firstName} />
            <LabelPair label="Last Name" value={instructor.user.lastName} />
            <LabelPair
              label="Address"
              value={
                <a
                  className="underline text-sky-500"
                  href={getMapLink(geo.coordinates)}
                  target="_blank"
                >
                  {getAddressLine(instructor.user.address)}
                </a>
              }
            />
          </div>
          <MapBox
            className="w-[500px] h-[300px] border"
            center={geo.coordinates}
            geojson={geo.isochrone}
          />
        </div>
      </SimpleCard>
    </SimplePageLayout>
  );
}
