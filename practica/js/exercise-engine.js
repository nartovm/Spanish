/**
 * Exercise Engine — Reusable module for interactive exercises
 * Spanish B2.1 Learning Platform
 */

const ExerciseEngine = (function () {
    let exerciseData = {};
    let exerciseId = '';
    let unitId = '';

    /**
     * Normalize text for comparison (remove accents, lowercase)
     */
    function normalizeText(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    /**
     * Compare user input with correct answer
     * @param {string} input - User's answer
     * @param {string|string[]} correct - Correct answer(s)
     * @param {boolean} strict - If false, ignore accent differences
     */
    function fuzzyMatch(input, correct, strict = false) {
        const answers = Array.isArray(correct) ? correct : [correct];
        const normalizedInput = strict ? input.trim().toLowerCase() : normalizeText(input);

        return answers.some(answer => {
            const normalizedAnswer = strict ? answer.trim().toLowerCase() : normalizeText(answer);
            return normalizedInput === normalizedAnswer;
        });
    }

    /**
     * Initialize exercise with answer data
     */
    function init(data, options = {}) {
        exerciseData = data;
        exerciseId = options.exerciseId || document.body.dataset.exerciseId || 'unknown';
        unitId = options.unitId || 'unidad-1';

        // Set up form submission
        const form = document.getElementById('exercise-form');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                checkAnswers();
            });
        }

        // Load saved answers if available
        loadSavedAnswers();
    }

    /**
     * Check all answers and display results
     */
    function checkAnswers() {
        const results = [];
        let correct = 0;
        let total = 0;

        for (const [questionId, data] of Object.entries(exerciseData)) {
            const element = document.querySelector(`[name="${questionId}"], #${questionId}`);
            if (!element) continue;

            total++;
            let userAnswer = '';
            let isCorrect = false;

            // Get answer based on input type
            if (element.type === 'text') {
                userAnswer = element.value;
                isCorrect = fuzzyMatch(userAnswer, data.correct, data.strict);
            } else if (element.type === 'radio') {
                const checked = document.querySelector(`[name="${questionId}"]:checked`);
                userAnswer = checked ? checked.value : '';
                isCorrect = userAnswer === data.correct;
            } else if (element.tagName === 'SELECT') {
                userAnswer = element.value;
                isCorrect = fuzzyMatch(userAnswer, data.correct, true);
            }

            if (isCorrect) correct++;

            // Visual feedback
            const wrapper = element.closest('.question-block') || element.parentElement;
            wrapper.classList.remove('correct', 'incorrect');
            wrapper.classList.add(isCorrect ? 'correct' : 'incorrect');

            // Store result
            results.push({
                id: questionId,
                userAnswer,
                correctAnswer: Array.isArray(data.correct) ? data.correct[0] : data.correct,
                isCorrect,
                explanation: data.explanation
            });
        }

        showResults(correct, total, results);
        saveProgress(correct, total);
    }

    /**
     * Display results box with score and explanations
     */
    function showResults(correct, total, results) {
        const resultsBox = document.getElementById('results');
        if (!resultsBox) return;

        const percentage = Math.round((correct / total) * 100);
        let emoji = '😊';
        if (percentage < 50) emoji = '😔';
        else if (percentage < 80) emoji = '🤔';
        else if (percentage === 100) emoji = '🎉';

        let html = `
            <h3>${emoji} Результат: <span class="score">${correct}/${total}</span> (${percentage}%)</h3>
            <div class="explanations">
        `;

        // Show explanations for incorrect answers
        const incorrect = results.filter(r => !r.isCorrect);
        if (incorrect.length > 0) {
            html += '<h4>Разбор ошибок:</h4>';
            for (const r of incorrect) {
                html += `
                    <div class="explanation-item">
                        <div class="answer-comparison">
                            <span class="user-answer">❌ ${r.userAnswer || '(пусто)'}</span>
                            <span class="correct-answer">✓ ${r.correctAnswer}</span>
                        </div>
                        ${r.explanation ? `<p class="explanation-text">${r.explanation}</p>` : ''}
                    </div>
                `;
            }
        }

        html += '</div>';
        resultsBox.innerHTML = html;
        resultsBox.hidden = false;
        resultsBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Reset exercise - clear all inputs and results
     */
    function reset() {
        // Clear text inputs
        document.querySelectorAll('#exercise-form input[type="text"]').forEach(input => {
            input.value = '';
        });

        // Clear radio buttons
        document.querySelectorAll('#exercise-form input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        // Clear selects
        document.querySelectorAll('#exercise-form select').forEach(select => {
            select.selectedIndex = 0;
        });

        // Remove visual feedback
        document.querySelectorAll('.question-block, .fill-blank').forEach(el => {
            el.classList.remove('correct', 'incorrect');
        });

        // Hide results
        const resultsBox = document.getElementById('results');
        if (resultsBox) resultsBox.hidden = true;

        // Clear saved answers
        localStorage.removeItem(`exercise_answers_${unitId}_${exerciseId}`);
    }

    /**
     * Save current answers to localStorage
     */
    function saveAnswers() {
        const answers = {};

        document.querySelectorAll('#exercise-form input[type="text"]').forEach(input => {
            if (input.name || input.id) {
                answers[input.name || input.id] = input.value;
            }
        });

        document.querySelectorAll('#exercise-form input[type="radio"]:checked').forEach(input => {
            answers[input.name] = input.value;
        });

        document.querySelectorAll('#exercise-form select').forEach(select => {
            if (select.name || select.id) {
                answers[select.name || select.id] = select.value;
            }
        });

        localStorage.setItem(`exercise_answers_${unitId}_${exerciseId}`, JSON.stringify(answers));
    }

    /**
     * Load saved answers from localStorage
     */
    function loadSavedAnswers() {
        const saved = localStorage.getItem(`exercise_answers_${unitId}_${exerciseId}`);
        if (!saved) return;

        try {
            const answers = JSON.parse(saved);
            for (const [key, value] of Object.entries(answers)) {
                const input = document.querySelector(`[name="${key}"], #${key}`);
                if (!input) continue;

                if (input.type === 'text') {
                    input.value = value;
                } else if (input.type === 'radio') {
                    const radio = document.querySelector(`[name="${key}"][value="${value}"]`);
                    if (radio) radio.checked = true;
                } else if (input.tagName === 'SELECT') {
                    input.value = value;
                }
            }
        } catch (e) {
            console.error('Failed to load saved answers', e);
        }
    }

    /**
     * Save progress (completion status) to localStorage
     */
    function saveProgress(correct, total) {
        const key = `progress_${unitId}`;
        let progress = {};

        try {
            const saved = localStorage.getItem(key);
            if (saved) progress = JSON.parse(saved);
        } catch (e) { }

        progress[exerciseId] = {
            correct,
            total,
            percentage: Math.round((correct / total) * 100),
            completedAt: new Date().toISOString()
        };

        localStorage.setItem(key, JSON.stringify(progress));
    }

    /**
     * Get progress for a unit
     */
    function getProgress(unit = unitId) {
        try {
            const saved = localStorage.getItem(`progress_${unit}`);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }

    /**
     * Auto-save answers on input change
     */
    function enableAutoSave() {
        const form = document.getElementById('exercise-form');
        if (form) {
            form.addEventListener('input', saveAnswers);
            form.addEventListener('change', saveAnswers);
        }
    }

    // Public API
    return {
        init,
        checkAnswers,
        reset,
        saveAnswers,
        loadSavedAnswers,
        getProgress,
        enableAutoSave,
        normalizeText,
        fuzzyMatch
    };
})();

// Make available globally
window.ExerciseEngine = ExerciseEngine;
