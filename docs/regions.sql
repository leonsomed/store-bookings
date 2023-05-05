-- SELECT ST_GeomFromGeoJSON('{"coordinates":[[[-121.240962,36.283516],[-121.341516,36.214038],[-121.190875,36.164285],[-121.101857,36.245806],[-121.184419,36.268797],[-121.240962,36.283516]]],"type":"Polygon"}');

CREATE TABLE regions_test(gid serial PRIMARY KEY, name varchar(100), geog geometry(POLYGON,4326) );

DROP TABLE regions_test;

INSERT INTO regions_test ( name, geog )
  VALUES ('San Diego', ST_GeomFromGeoJSON('{"coordinates":[[[-117.331944,32.768268],[-116.803672,32.834447],[-116.648233,32.406805],[-117.233219,32.412812],[-117.331944,32.768268]]],"type":"Polygon"}'));
  
  
SELECT name
FROM regions_test
WHERE ST_Contains(geog, ST_GeomFromGeoJSON('{"type": "Point","coordinates": [-116.9693364,32.5089527]}'));
-- https://goo.gl/maps/hCdQr8hkwrg6UfMs9 – [-116.9693364,32.5089527]