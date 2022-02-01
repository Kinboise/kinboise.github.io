window.onload = function() {
    // Create quiz instances for each quiz and add them to the quizzes map.
    // The key is the ID of the quiz element, same as what we pass to the Quiz object as the first argument.
    quizzes['quiz-1'] = new Quiz('quiz-1', [
        'di bake.',
        'kate bore.'
    ]);

    quizzes['quiz-2'] = new Quiz('quiz-2', [
        'di line jehe.',
        'came ma.',
        'vi dade cice ma.',
        '我是大猫。'
    ]);
};

