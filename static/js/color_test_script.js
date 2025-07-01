// static/js/color_test_script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("color_test_script.js: DOMContentLoaded fired!");

    const colorTestHeader = document.getElementById('colorTestHeader');
    const colorTestContent = document.getElementById('colorTestContent');
    const colorTestQuestionsDiv = document.getElementById('colorTestQuestions');
    const submitColorTestButton = document.getElementById('submitColorTest');
    const colorTestResult = document.getElementById('colorTestResult');

    // Accordion Toggle for Color Test Section
    if (colorTestHeader) {
        colorTestHeader.addEventListener('click', () => {
            colorTestContent.classList.toggle('open');
            colorTestHeader.classList.toggle('active');
            const arrowIcon = colorTestHeader.querySelector('.arrow-icon');
            if (arrowIcon) {
                arrowIcon.classList.toggle('fa-chevron-up');
                arrowIcon.classList.toggle('fa-chevron-down');
            }
            if (colorTestContent.classList.contains('open')) {
                colorTestContent.style.maxHeight = colorTestContent.scrollHeight + "px";
                colorTestContent.style.display = 'block';
            } else {
                colorTestContent.style.maxHeight = null;
                colorTestContent.style.display = 'none';
            }
        });
    }

    const questions = [
        {
            type: "ishihara",
            image: "ishihara_plate_12.png", // Anda perlu gambar ini di static/images
            question: "Angka berapa yang Anda lihat pada gambar ini?",
            options: ["12", "Tidak ada angka", "21"],
            correctAnswer: "12",
            isImageBased: true
        },
        {
            type: "basic_match",
            question: "Warna apakah yang paling mirip dengan warna ini?",
            color: "#FF0000", // Merah
            options: ["#0000FF", "#FF0000", "#00FF00"],
            correctAnswer: "#FF0000",
            isImageBased: false
        },
        {
            type: "basic_match",
            question: "Warna apakah yang paling mirip dengan warna ini?",
            color: "#0000FF", // Biru
            options: ["#FF0000", "#00FF00", "#0000FF"],
            correctAnswer: "#0000FF",
            isImageBased: false
        },
        {
            type: "ishihara",
            image: "ishihara_plate_74.png", // Anda perlu gambar ini di static/images
            question: "Angka berapa yang Anda lihat pada gambar ini?",
            options: ["74", "Tidak ada angka", "47"],
            correctAnswer: "74",
            isImageBased: true
        }
        // Tambahkan lebih banyak pertanyaan jika diperlukan
    ];

    let userAnswers = [];

    function loadQuestions() {
        if (!colorTestQuestionsDiv) return;

        colorTestQuestionsDiv.innerHTML = '';
        userAnswers = []; // Reset jawaban

        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('color-test-question');
            questionDiv.dataset.questionIndex = index;

            let questionContent = `<h3>Pertanyaan ${index + 1}: ${q.question}</h3>`;

            if (q.isImageBased) {
                questionContent += `<img src="{{ url_for('static', filename='images/${q.image}') }}" alt="Tes Buta Warna" style="max-width: 200px; margin-bottom: 10px;">`;
            } else if (q.color) {
                questionContent += `<div class="color-box-question" style="background-color: ${q.color};"></div>`;
            }

            questionDiv.innerHTML = questionContent;

            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('color-test-options');

            q.options.forEach(option => {
                const label = document.createElement('label');
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `question${index}`;
                radio.value = option;
                radio.addEventListener('change', (event) => {
                    userAnswers[index] = event.target.value;
                    const allAnswered = questions.every((_, i) => userAnswers[i] !== undefined);
                    if (allAnswered && submitColorTestButton) {
                        submitColorTestButton.style.display = 'block';
                    }
                });

                if (q.isImageBased) {
                    label.textContent = option;
                } else {
                    if (option.startsWith('#')) {
                        label.innerHTML = `<div class="color-box-option" style="background-color: ${option};"></div>`;
                    } else {
                        label.textContent = option;
                    }
                }

                label.prepend(radio);
                optionsDiv.appendChild(label);
            });
            questionDiv.appendChild(optionsDiv);
            colorTestQuestionsDiv.appendChild(questionDiv);
        });

        if (submitColorTestButton) {
            submitColorTestButton.style.display = 'none';
        }
    }

    if (submitColorTestButton) {
        submitColorTestButton.addEventListener('click', () => {
            let correctCount = 0;
            questions.forEach((q, index) => {
                if (userAnswers[index] === q.correctAnswer) {
                    correctCount++;
                }
            });

            if (colorTestResult) {
                const totalQuestions = questions.length;
                const score = (correctCount / totalQuestions) * 100;

                let diagnosis = "";
                if (score === 100) {
                    diagnosis = "Selamat! Anda tidak menunjukkan tanda-tanda buta warna.";
                } else if (score >= 75) {
                    diagnosis = "Mungkin ada sedikit kesulitan dalam membedakan warna tertentu, namun tidak signifikan.";
                } else if (score >= 50) {
                    diagnosis = "Anda menunjukkan beberapa indikasi kesulitan dalam membedakan warna. Disarankan untuk berkonsultasi dengan ahli mata.";
                } else {
                    diagnosis = "Anda menunjukkan indikasi kuat buta warna. Sangat disarankan untuk berkonsultasi dengan ahli mata untuk diagnosis lebih lanjut.";
                }

                colorTestResult.textContent = `Anda menjawab benar ${correctCount} dari ${totalQuestions} pertanyaan. (${score.toFixed(0)}%). ${diagnosis}`;
                colorTestResult.style.display = 'block';
            }
        });
    }

    if (colorTestContent && colorTestContent.classList.contains('open')) {
        loadQuestions();
    }
});