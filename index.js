const parse = require('csv-parse/lib/sync')
const fs = require('fs')

function sum(accumulator, a) {
  return accumulator + a;
}

function records(){
  const data = fs.readFileSync('./bg-sentence-pair-scores.csv', 'utf8')

  return parse(data, {
    columns: true,
    skip_empty_lines: true,
    bom: true
  })
}

function evaluatorAverageRating(){
  var hash = new Object();

  records().forEach(row => {
    const evaluatorName = row['evaluator id']
    if (typeof hash[evaluatorName] === 'undefined') {
      hash[evaluatorName] = []
    }
    hash[evaluatorName].push(parseInt(row['q1 score'], 10));
  });

  const averages = new Object();
  for (const evaluatorName in hash) {
    averages[evaluatorName] = hash[evaluatorName].reduce(sum, 0) / hash[evaluatorName].length
  }

  fs.writeFileSync('./1.json', JSON.stringify(averages))

  return JSON.stringify(averages);
}

function sentenceAverageRating(){
  var hash = new Object();

  records().forEach(row => {
    const sentence = row['sentence pair id']
    if (typeof hash[sentence] === 'undefined') {
      hash[sentence] = []
    }
    hash[sentence].push(parseInt(row['q1 score'], 10));
  });

  const averages = new Object();
  for (const sentence in hash) {
    averages[sentence] = hash[sentence].reduce(sum, 0) / hash[sentence].length
  }

  fs.writeFileSync('./2.json', JSON.stringify(averages))

  return averages;
}

module.exports = {
  sentenceAverageRating: sentenceAverageRating,
  evaluatorAverageRating: evaluatorAverageRating }
