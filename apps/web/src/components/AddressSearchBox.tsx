'use client';

import { SearchBox } from '@mapbox/search-js-react';
import type { Address, NewAddressResponse } from 'database';
import { api } from '../services/api';
import { CONFIG } from '../services/config';

export async function getAddress(
  address: Omit<Address, 'id' | 'street2'>,
  coordinates: [number, number]
) {
  return await api.address.create({ ...address, coordinates });
}

interface AddressSearchBoxProps {
  initialAddress?: string;
  onChange?: (
    address: Omit<Address, 'id' | 'street2'>,
    coordinates: [number, number]
  ) => unknown;
  onAddress?: (response: NewAddressResponse) => unknown;
}

export function AddressSearchBox({
  initialAddress,
  onChange,
  onAddress,
}: AddressSearchBoxProps) {
  return (
    <>
      <label className="block mb-2 text-sm font-medium">Address</label>
      <SearchBox
        value={initialAddress}
        accessToken={CONFIG.mapbox.publicKey}
        options={{ country: 'us', types: 'address' }}
        onRetrieve={async (response) => {
          const feat = response.features[0];
          const parts = feat.properties.context;
          const address = {
            street: parts.address?.name ?? '',
            city: parts.place?.name ?? '',
            state: parts.region?.name ?? '',
            zip: parts.postcode?.name ?? '',
            country: parts.country?.name ?? '',
          };

          if (
            !address.street ||
            !address.city ||
            !address.state ||
            !address.zip ||
            !address.country
          ) {
            alert('Please enter a valid address');
            console.warn('Invalid address', address);
            return;
          }

          onChange?.(address, feat.geometry.coordinates as [number, number]);

          if (onAddress) {
            const response = await getAddress(
              address,
              feat.geometry.coordinates as [number, number]
            );
            onAddress(response.data);
          }
        }}
      />
    </>
  );
}
