/*
Price schemes can defined rules such as:

- Fixed price per product
- Increase or decrease by percentage or amount
- Truncating the price to always end in 99 cents
- Applying a max and min price globally, ie: increasing by 10% might go over the max price, so we cap it at the max price

------------

- Coordinates can metch multiple regions
For example, one region can cover the whole United States, another the whole state of CA, another the city of San Diego.
Given coordinates within San Diego we will get 3 regions with potentially different price schemes.
This gives us more control over price discovery and management. For example, if there is a product that has the same price
across the whole United States, then we can define the price of that product only in the price scheme that belongs to the USA.
This way we can still set a specific price scheme for San Diego with local prices for lesson related products.

There are cases where a product is defined in all 3 price schemes and the price is different in each of them.
The rule is to let the smallest region take precedence. However, if the price is not found in the smallest region, then we
bubble up to the next biggest region and so on until we find the price. If a price is not found
then the product is not available in that region.

- Price schemes can extend another price schemes.
This allows us to define a base price scheme with fixed standard prices
and then extend it with a rule to increase or decrease the price by a percentage.

With this configuration we can have a single or a small amount of base price schemes
and then most other price schemes can include simple rules like increase or decrease 5%, 10%, 15% etc.

SELECT * FROM (
  SELECT
    ps1.id AS id1
    ,ps2.id AS id2
  FROM PriceScheme ps1
  WHERE id = 'xxxxxxxxxxxx'
  JOIN PriceScheme ps2 ON ps2.id = ps1.parentId
) ps
JOIN PriceSchemeProductPrice pp ON pp.priceSchemeId = ps.id1 OR pp.priceSchemeId = ps.id2

...
JOIN PriceSchemePriceModifier pm ON pm.priceSchemeId = ps1.id OR pm.priceSchemeId = ps2.id
*/
