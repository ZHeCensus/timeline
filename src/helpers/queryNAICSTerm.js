export default function queryNAICSTerm(term) {
  return fetch(
    `https://cbb.census.gov/arcgis/rest/services/Census_EMS/CBB_2_5/MapServer/8/query?f=json&where=synonymLowerCase LIKE '%${term}%' OR ID LIKE '%${term}%'&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=ID%2Csynonym%2CName%2CisSynonym&orderByFields=ID%2CisSynonym`
  )
    .then(res => res.json())
    .then(res => {
      const uniqueTypes = res.features.reduce((types, type) => {
        if (
          !types
            .map(type => type.attributes.Name)
            .includes(type.attributes.Name)
        ) {
          return [...types, type];
        } else {
          return types;
        }
      }, []);
      return uniqueTypes;
    });
}
