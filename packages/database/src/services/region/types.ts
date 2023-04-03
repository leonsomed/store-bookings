/*
- price schemes are attached to regions

How to import mapbox polygons into postgres
- Download the geojson file from mapbox datasets
  https://studio.mapbox.com/datasets/
- Enable the PostGIS extension in supabase
  https://supabase.com/docs/guides/database/extensions/postgis
- Create a local script to import the geojson file into postgres.
  There is a utility ST_GeomFromGeoJSON that allows to do this.
  https://postgis.net/docs/ST_GeomFromGeoJSON.html

Alternatively, we can use ogr2ogr to import the geojson file into postgres.
- https://github.com/mapbox/mapbox-studio-classic/blob/mb-pages/docs/tutorials/postgis-manual.md#import-data-into-postgis
- https://mapshaper.org/
- https://www.statsilk.com/maps/convert-geojson-esri-shapefile-map-format


How to test that a point is inside a polygon in postgres
- Use the ST_Contains from postgis
  https://postgis.net/docs/ST_Contains.html
  https://postgis.net/docs/using_postgis_dbmanagement.html#Polygon
*/
