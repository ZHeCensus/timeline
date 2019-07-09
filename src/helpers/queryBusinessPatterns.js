import censusPromise from "./censusPromise";

const CENSUS_API_KEY = "3c04140849164b373c8b1da7d7cc8123ef71b7ab";
//https://cbb.census.gov/sbe/#industry0=811212&geoId=36081&geoType=county&view=report&reportType=summary
//https://cbb.census.gov/sbe/#industry0=811212&geoId=11355&geoType=zcta&view=report&reportType=summary

//https://api.census.gov/data/2016/zbp?&NAICS2012=811212&get=ESTAB,ESTAB_F&for=zipcode:11355&key=3c04140849164b373c8b1da7d7cc8123ef71b7ab
//https://api.census.gov/data/2016/zbp?&NAICS2012=337124&get=ESTAB,ESTAB_F&for=zipcode:11355&key=3c04140849164b373c8b1da7d7cc8123ef71b7ab
export default function queryBusinessPatterns(geoId, geoType, NAICS) {
  //fetch Number of establishments (ESTAB)

  //TODO: use citySDK (it was throwing an error before)
  const years = [2013, 2014, 2015, 2016];
  const fetches = years.map(year => {
    let url = `https://api.census.gov/data/${year}/zbp?&NAICS2012=${NAICS}&get=ESTAB,ESTAB_F&for=zipcode:${geoId}&key=${CENSUS_API_KEY}`;

    // url = `https://api.census.gov/data/${year}/cbp?&NAICS2012=${NAICS}&get=ESTAB,ESTAB_F&for=county:${geoId}&key=${CENSUS_API_KEY}`;

    return fetch(url)
      .then(res => res.json())
      .then(result => {
        //use first element of array as keys
        const keys = result[0];
        const rows = result.slice(1).reduce((p, c) => {
          const row = {};
          c.forEach((item, index) => (row[keys[index]] = item));
          p.push(row);
          return p;
        }, []);

        return {
          year,
          rows
        };
      })
      .catch(error => {
        return {
          year,
          rows: []
        };
      });
  });

  return Promise.all(fetches).then(result => {
    //sort by zipcode/geoID instead of year; assumes no duplicates
    const dataset = result.reduce((p, year) => {
      year.rows.forEach(row => {
        const geoId = row["zipcode"];
        let found = p.find(i => {
          return i.geoId === geoId;
        });
        if (!found) {
          found = { geoId, data: [] };
          p.push(found);
        }
        found.data.push({ ...row, year: year.year });
      });
      return p;
    }, []);

    return {
      dataset,
      years
    };
  });
}
