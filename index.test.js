const { sentenceAverageRating, evaluatorAverageRating } = require('./index');

test('returns average rating per evaluator', () => {
  expect(evaluatorAverageRating()).toBe('{"BBC_Bulgarian_01":63.12,"DW_Bulgarian_01":60.945,"BBC_Bulgarian_03":66.635,"DW_Bulgarian_02":52.46,"BBC_Bulgarian_02":60.655}');
});

test('returns average rating per sentence', () => {
  expect(sentenceAverageRating()['BG_SE_1']).toBe(48.6);
});
