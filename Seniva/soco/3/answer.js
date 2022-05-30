window.onload = function() {
    // Create quiz instances for each quiz and add them to the quizzes map.
    // The key is the ID of the quiz element, same as what we pass to the Quiz object as the first argument.
    quizzes['quiz-1'] = new Quiz('quiz-1', [
        '狗跳。',
        'bake flig.'
    ]);

    quizzes['quiz-2'] = new Quiz('quiz-2', [
        'di gale cice lip.'
    ]);

    quizzes['quiz-3'] = new Quiz('quiz-3', [
        'li sed.',
        'di lapre gupte pav.',
        'li flige ma flig.',
        'a'
    ])
};

