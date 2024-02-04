import neo4j from "neo4j-driver";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({path: "./.env"});

const driver = neo4j.driver(
  process.env.DUMMY_DATA_CONNECTION_URI,
  neo4j.auth.basic(process.env.DUMMY_DATA_USERNAME, process.env.DUMMY_DATA_PASSWORD)
);

const session = driver.session();

//user will provide the source and destination(comes from the frontend)
export async function getPaths(src, dst) {
  const query1BlrToBom  = `MATCH paths = (n1 {iata_code: "BLR"})-[*1..2]->(n2 {iata_code: "BOM"})
  RETURN paths`
  const query2 = `MATCH paths = (n1 {city: ${src}})-[*1..3]->(n2 {city: ${dst}})
  RETURN paths`
  const response =
    await session.run(query2);
  console.log(response);

  // const res = JSON.stringify(response);
  // fs.writeFileSync("paths.json", res);

  const resultingPaths = {
    source: src,
    destination: dst,
    paths: {},
  };

  response.records.forEach((record, index) => {
    resultingPaths.paths[index] = new Array(); //one way/path
    let startNode = {};
    startNode.type = "node";
    startNode.properties = record._fields[0].start.properties;

    resultingPaths.paths[index].push(startNode); //adding the firstnode into the array

    record._fields[0].segments.forEach((segment, i) => {
      //node,path,node till we reach destination
      let path = {};
      let nextNode = {};
      path.type = "path";
      nextNode.type = "node";

      path.properties = segment.relationship.properties;
      nextNode.properties = segment.end.properties;

      resultingPaths.paths[index].push(path); //adding the path and the next node for a path
      resultingPaths.paths[index].push(nextNode);
    });
  });

  console.log(resultingPaths);
  // const resPaths = JSON.stringify(resultingPaths);
  // fs.writeFileSync("formattedResult.json", resPaths);

  return resultingPaths;

  //TODO:
  //now acccording to the results we get from the response from neo4j, format the data according to our needs.
  //records: contains "paths"
  //paths: contains all the paths it has a start and end field which represents the source and destination nodes and then a segments field which has all the segments that is all the objects for each node-edge-node and all properities of that ex: records: {keys: paths, fields:[start:"mum",end: "manglore",segments:[{start: mum ,relationship: edgeinfo, end: manglore}]]}
  //each path obj contains: keys,length,_fields,_fieldLookup
}

getPaths();

//the object we need to format:
// {
//   "keys": ["paths"],
//   "length": 1,
//   "_fields": [
//     {
//       "start": {
//         "identity": { "low": 15, "high": 0 },
//         "labels": ["Airport"],
//         "properties": {
//           "icao_code": "VOBG",
//           "iata_code": "BLR",
//           "city_name": "Bangalore",
//           "airport_name": "Bengaluru International Airport"
//         },
//         "elementId": "4:0ddf47c8-6ce8-41de-bae1-77e10e59339d:15"
//       },
//       "end": {
//         "identity": { "low": 27, "high": 0 },
//         "labels": ["Airport"],
//         "properties": {
//           "icao_code": "VABB",
//           "iata_code": "BOM",
//           "city_name": "Mumbai",
//           "airport_name": "Chhatrapati Shivaji International Airport"
//         },
//         "elementId": "4:0ddf47c8-6ce8-41de-bae1-77e10e59339d:27"
//       },
//       "segments": [
//         {
//           "start": {
//             "identity": { "low": 15, "high": 0 },
//             "labels": ["Airport"],
//             "properties": {
//               "icao_code": "VOBG",
//               "iata_code": "BLR",
//               "city_name": "Bangalore",
//               "airport_name": "Bengaluru International Airport"
//             },
//             "elementId": "4:0ddf47c8-6ce8-41de-bae1-77e10e59339d:15"
//           },
//           "relationship": {
//             "identity": { "low": 15, "high": 299368448 },
//             "start": { "low": 15, "high": 0 },
//             "end": { "low": 27, "high": 0 },
//             "type": "Flight",
//             "properties": {
//               "Operator": "IGO",
//               "Arriving Time": "23:15",
//               "Effective To": "30-03-2024",
//               "Flight No": "6E 5094",
//               "frq": { "low": 1234567, "high": 0 },
//               "Aircraft Type": "A321",
//               "Arriving from": "BLR",
//               "Departure to": "BOM",
//               "Departure Time": "21:10",
//               "Effective from": "29-10-2023"
//             },
//             "elementId": "5:0ddf47c8-6ce8-41de-bae1-77e10e59339d:1285777693614276623",
//             "startNodeElementId": "4:0ddf47c8-6ce8-41de-bae1-77e10e59339d:15",
//             "endNodeElementId": "4:0ddf47c8-6ce8-41de-bae1-77e10e59339d:27"
//           },
//           "end": {
//             "identity": { "low": 27, "high": 0 },
//             "labels": ["Airport"],
//             "properties": {
//               "icao_code": "VABB",
//               "iata_code": "BOM",
//               "city_name": "Mumbai",
//               "airport_name": "Chhatrapati Shivaji International Airport"
//             },
//             "elementId": "4:0ddf47c8-6ce8-41de-bae1-77e10e59339d:27"
//           }
//         }
//       ],
//       "length": 1
//     }
//   ],
//   "_fieldLookup": { "paths": 0 }
// },
