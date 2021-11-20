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

function perSentenceStats(){
  var hash = new Object();

  records().forEach(row => {
    const sentence = row['sentence pair id']
      if (typeof hash[sentence] === 'undefined') {
        hash[sentence] = new Object();
      }

      //adds all the scores to every sentence
      if (typeof hash[sentence]['scores'] === 'undefined') {
        hash[sentence]['scores'] = [];
      }
      hash[sentence]['scores'].push(parseInt(row['q1 score'], 10));

      //finds the lowest scoring sentence
      if (typeof hash[sentence]['lowestScoringSentence'] === 'undefined') {
        hash[sentence]['lowestScoringSentence'] = parseInt(row['q1 score'], 10);
      } else if (parseInt(row['q1 score'], 10) < hash[sentence]['lowestScoringSentence']) {
        hash[sentence]['lowestScoringSentence'] = parseInt(row['q1 score'], 10);
      }

      //finds the highest scoring sentence
      if (typeof hash[sentence]['highestScoringSentence'] === 'undefined') {
        hash[sentence]['highestScoringSentence'] = parseInt(row['q1 score'], 10)
      } else if (parseInt(row['q1 score'], 10) > hash[sentence]['highestScoringSentence']) {
        hash[sentence]['highestScoringSentence'] = parseInt(row['q1 score'], 10)
      }
  });

  const averages = new Object();
    for (const sentence in hash) {
      averages[sentence] = new Object();
      averages[sentence]['averageScore'] = hash[sentence]['scores'].reduce(sum, 0) / hash[sentence]['scores'].length
      averages[sentence]['lowestScoringSentence'] = hash[sentence]['lowestScoringSentence']
      averages[sentence]['highestScoringSentence'] = hash[sentence]['highestScoringSentence']
    }

  fs.writeFileSync('./2.json', JSON.stringify(averages))

  return averages;
}

module.exports = {
  evaluatorAverageRating: evaluatorAverageRating,
  perSentenceStats: perSentenceStats }
