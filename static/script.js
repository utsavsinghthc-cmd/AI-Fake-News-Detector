const $ = (selector) => document.querySelector(selector);

const form = $('#news-form');
const textarea = $('#news');
const detectBtn = $('#detect-btn');
const clearBtn = $('#clear-btn');
const errorBox = $('#input-error');
const wordCount = $('#word-count');
const charCount = $('#char-count');
const readingTime = $('#reading-time');
const languageDetected = $('#language-detected');
const historyList = $('#history-list');
const themeToggle = $('[data-theme-toggle]');
const toast = $('#toast');
const prediction = window.__PREDICTION__ || {};
let toastTimer;

function showToast(message) {
    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('is-visible');
    }, 2600);
}

function getWords(text) {
    return text.trim().split(/\s+/).filter(Boolean);
}

function detectLanguage(text) {
    if (!text.trim()) {
        return 'Unknown';
    }

    const devanagariCharacters = (text.match(/[\u0900-\u097F]/g) || []).length;
    const englishCharacters = (text.match(/[A-Za-z]/g) || []).length;

    return devanagariCharacters > englishCharacters * 0.25 ? 'Hindi' : 'English';
}

function updateStats() {
    if (!textarea || !wordCount || !charCount || !readingTime || !languageDetected) {
        return;
    }

    const text = textarea.value;
    const totalWords = getWords(text).length;

    wordCount.textContent = totalWords;
    charCount.textContent = text.length;
    readingTime.textContent = totalWords === 0 ? '0 min' : `${Math.max(1, Math.ceil(totalWords / 220))} min`;
    languageDetected.textContent = detectLanguage(text);
}

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);

    const icon = $('.theme-icon');
    const label = $('.theme-label');

    if (icon) {
        icon.textContent = theme === 'dark' ? '☾' : '☀';
    }

    if (label) {
        label.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }
}

function validateInput() {
    if (!textarea || !errorBox) {
        return false;
    }

    const text = textarea.value.trim();

    if (!text) {
        errorBox.textContent = 'Please paste a news article before running detection.';
        showToast('Add news text first.');
        return false;
    }

    if (text.length < 10) {
        errorBox.textContent = 'Please enter at least 10 characters for a meaningful prediction.';
        showToast('Text is too short for analysis.');
        return false;
    }

    errorBox.textContent = '';
    return true;
}

function getHistory() {
    return JSON.parse(sessionStorage.getItem('predictionHistory') || '[]');
}

function saveHistory(item) {
    const nextHistory = [item, ...getHistory()].slice(0, 6);
    sessionStorage.setItem('predictionHistory', JSON.stringify(nextHistory));
    renderHistory();
}

function renderHistory() {
    const items = getHistory();

    if (!historyList) {
        return;
    }

    if (!items.length) {
        historyList.className = 'history-list empty';
        historyList.textContent = 'No predictions in this browser session yet.';
        return;
    }

    historyList.className = 'history-list';
    historyList.innerHTML = items
        .map(
            (item) => `
                <div class="history-item">
                    <strong>${item.prediction} • ${item.confidence}%</strong>
                    <span>${item.language} • ${item.words} words • ${item.time}</span>
                </div>
            `,
        )
        .join('');
}

function buildResultText() {
    return `AI Fake News Detector Result\nPrediction: ${prediction.prediction || 'Not available'}\nConfidence: ${prediction.confidence || 'Not available'}%\nLanguage: ${detectLanguage(prediction.news || '')}\n\nExplanation:\n${prediction.explanation || 'Not available'}`;
}

async function copyResult() {
    const resultText = buildResultText();

    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(resultText);
        } else {
            const tempInput = document.createElement('textarea');
            tempInput.value = resultText;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            tempInput.remove();
        }

        showToast('Result copied to clipboard.');
    } catch (error) {
        showToast('Copy failed. Please copy manually.');
    }
}

function escapeHtml(value) {
    return String(value || '').replace(/[<>&]/g, (character) => {
        const replacements = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
        };

        return replacements[character];
    });
}

function downloadPdf() {
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
        if (errorBox) {
            errorBox.textContent = 'Please allow pop-ups to export the result as a PDF.';
        }
        showToast('Allow pop-ups to export PDF.');
        return;
    }

    printWindow.document.write(`
        <html>
            <head>
                <title>AI Fake News Detector Result</title>
                <style>
                    body {
                        color: #111827;
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        padding: 32px;
                    }

                    h1 {
                        color: #0f62fe;
                    }

                    .box {
                        border: 1px solid #d1d5db;
                        border-radius: 14px;
                        margin: 16px 0;
                        padding: 18px;
                        white-space: pre-line;
                    }
                </style>
            </head>
            <body>
                <h1>AI Fake News Detector Result</h1>
                <div class="box">
                    <strong>Prediction:</strong> ${escapeHtml(prediction.prediction)}<br>
                    <strong>Confidence:</strong> ${escapeHtml(prediction.confidence)}%<br>
                    <strong>Language:</strong> ${escapeHtml(detectLanguage(prediction.news || ''))}
                </div>
                <div class="box"><strong>Explanation</strong><br>${escapeHtml(prediction.explanation)}</div>
                <div class="box"><strong>Analyzed Text</strong><br>${escapeHtml(prediction.news)}</div>
                <script>window.print();<\/script>
            </body>
        </html>
    `);
    printWindow.document.close();
    showToast('PDF export opened. Choose Save as PDF.');
}

textarea?.addEventListener('input', updateStats);

clearBtn?.addEventListener('click', () => {
    textarea.value = '';
    updateStats();
    if (errorBox) {
        errorBox.textContent = '';
    }
    textarea.focus();
    showToast('Text cleared.');
});

form?.addEventListener('submit', (event) => {
    if (!validateInput()) {
        event.preventDefault();
        return;
    }

    detectBtn.classList.add('is-loading');
    detectBtn.disabled = true;
    showToast('Analyzing news article...');
});

document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        form?.requestSubmit();
    }

    if (event.key === 'Escape') {
        clearBtn?.click();
    }
});

themeToggle?.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`${nextTheme === 'dark' ? 'Dark' : 'Light'} mode enabled.`);
});

$('#copy-result')?.addEventListener('click', copyResult);
$('#download-pdf')?.addEventListener('click', downloadPdf);
$('#clear-history')?.addEventListener('click', () => {
    sessionStorage.removeItem('predictionHistory');
    renderHistory();
    showToast('Prediction history cleared.');
});

setTheme(localStorage.getItem('theme') || 'dark');
updateStats();
renderHistory();

if (prediction.prediction) {
    saveHistory({
        prediction: prediction.prediction,
        confidence: prediction.confidence,
        language: detectLanguage(prediction.news || ''),
        words: getWords(prediction.news || '').length,
        time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        }),
    });
}
