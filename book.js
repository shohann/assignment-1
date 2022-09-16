const csvParser = require("csv-parser");
const needle = require("needle");
const { finished } = require('stream/promises');

async function readWords(url) {
  const records = [];
  const stream = needle.get(url);
  const parser = stream.pipe(csvParser({ delimiter: ',', columns: true }));

  parser.on('readable', () => {
  let record;
  while ((record = parser.read()) !== null) {
      records.push(record);
  }
  })
  await finished(parser);

  return records;
}

module.exports = readWords;