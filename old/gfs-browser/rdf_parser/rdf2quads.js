import rdfParser from 'rdf-parse';
import streamifyString from 'streamify-string';

export async function parse(rdfStr, contType, baseURI) {

  // We convert the rdf to an N-Quads string.
  let quadStream = rdfParser.parse(streamifyString(rdfStr), {contentType: contType, baseIRI: baseURI})
  
  return quadStream
}

// /**
//  * turns a stream into a string
//  * @param stream -  The stream that needs to be turned into a string.
//  * @returns {Promise<unknown>}
//  */
// function streamToString (stream) {

//   const chunks = [];
//   return new Promise((resolve, reject) => {
//     stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
//     stream.on('error', (err) => reject(err));
//     stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
//   })
// }

module.exports = { 
  'parse':parse
};
