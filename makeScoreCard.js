/*jslint es6, browser, multivar */
/*global util */
/**
 *  scoreCard
 *
 *  Creates a score card data structure. Designed to allow scores to be added
 *  and a maximum, minimum and average score to be returned.
 **/
function makeScoreCard() {

    'use strict';

    var scoreCard = {},
        scores = [],
        max = -Infinity,
        min = Infinity,
        average = 0;

    /**
     *  scoreCard.addScore(score) -> scoreCard
     *  - score (Number): Score to add.
     *
     *  Adds a score to the score card. The score card is returned to allow for
     *  chaining.
     *
     *      scoreCard.addScore(1).addScore(2).addScore(3);
     *      score.getScores(); // -> [1, 2, 3]
     *
     *  The score is converted to a positive integer when added. Scores that
     *  cannot be converted into a positive integer are ignored.
     *
     *      scoreCard
     *          .addScore('1')
     *          .addScore(1.1)
     *          .addScore(-1)
     *          .addScore('a')
     *          .addScore({});
     *      scoreCard.getScores(); // -> [1, 1, 1]
     *
     **/
    function addScore(score) {

        var value = util.Number.toPosInt(score);

        if (!util.Number.isNumeric(value)) {

            scores.push(value);

            max = Math.max(max, value);
            min = Math.min(min, value);
            average = util.Number.average(...scores);

        }

        return scoreCard;

    }

    /**
     *  scoreCard.getMin() -> Number
     *
     *  Gets the lowest score.
     *
     *      scoreCard.addScore(1).addScore(2).addScore(3);
     *      scoreCard.getScores(); // -> [1, 2, 3]
     *      scoreCard.getMin(); // -> 1
     *
     * If no scores have been added, `Infinity` is returned.
     **/
    function getMin() {
        return min;
    }

    /**
     *  scoreCard.getMax() -> Number
     *
     *  Gets the highest score.
     *
     *      scoreCard.addScore(1).addScore(2).addScore(3);
     *      scoreCard.getScores(); // -> [1, 2, 3]
     *      scoreCard.getMax(); // -> 3
     *
     * If no scores have been added, `-Infinity` is returned.
     **/
    function getMax() {
        return max;
    }

    /**
     *  scoreCard.getAverage() -> Number
     *
     *  Gets the average score.
     *
     *      scoreCard.addScore(1).addScore(2).addScore(3);
     *      scoreCard.getScores(); // -> [1, 2, 3]
     *      scoreCard.getAverage(); // -> 2
     *
     * If no scores have been added, `0` is returned.
     **/
    function getAverage() {
        return average;
    }

    /**
     *  scoreCard.getSize() -> Number
     *
     *  Gets the number of scores that have been added.
     *
     *      scoreCard.addScore(1).addScore(2).addScore(3);
     *      scoreCard.getScores(); // -> [1, 2, 3]
     *      scoreCard.getSize(); // -> 3
     *
     **/
    function getSize() {
        return scores.length;
    }

    /**
     *  scoreCard.getScores() -> Array
     *
     *  Returns a copy of the scores.
     *
     *      scoreCard.addScore(1).addScore(2).addScore(3);
     *      scoreCard.getScores(); // -> [1, 2, 3]
     *
     **/
    function getScores() {
        return [].concat(scores);
    }

    util.Object.assign(scoreCard, {
        addScore,
        getMin,
        getMax,
        getSize,
        getAverage,
        getScores
    });

    return scoreCard;

}
