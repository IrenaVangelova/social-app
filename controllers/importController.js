const mongoose = require('mongoose');
const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
const filePath = require('../helpers/users.csv');

const importCsv = async (req, res) => {

    // const filePath = require('../helpers/users.csv');

    let inputStream = Fs.createReadStream(filePath, 'utf8');

    inputStream.pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
	.on('data', function (row) {
	    console.log('A row arrived: ', row);
	})
	.on('end', function () {
	    console.log('No more rows!');
	});

 
  
  res.status(200);
  res.send({
    error: false,
    message: `Imported`,
  });
};

module.exports = importCsv;
