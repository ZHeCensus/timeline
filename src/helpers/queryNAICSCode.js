export default function queryNAICSCode(code) {
  return fetch(
    `https://cbb.census.gov/arcgis/rest/services/Census_EMS/CBB_2_5/MapServer/7/query?f=json&where=ID in ('${code}')&returnGeometry=false&outFields=*`
  )
    .then(res => res.json())
    .then(res => {
      if (res.features.length === 1) {
        const { ESTABSCBP2014, Name } = res.features[0].attributes;
        return {
          name: Name,
          count: ESTABSCBP2014 //Number of Establishments
        };
      }
      return null;
    });
}
