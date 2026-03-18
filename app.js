let currentQuestions = []; // 読み込んだ問題を保持する配列

// 「問題を読み込む」ボタンのクリックイベント
document.getElementById('load-btn').addEventListener('click', () => {
    const filePath = document.getElementById('set-selector').value;
    loadCSV(filePath);
});

// CSVファイルを読み込む関数
function loadCSV(filePath) {
    // 画面を初期化
    document.getElementById('quiz-area').innerHTML = '読み込み中...';
    document.getElementById('result').innerText = '';
    document.getElementById('submit-btn').style.display = 'none';

    // PapaParseでCSVをフェッチ＆パース
    Papa.parse(filePath, {
        download: true, // URL（ファイルパス）から直接ダウンロード
        header: true,   // 1行目をキー名として扱う（「問題（もんだい）」などがキーになる）
        skipEmptyLines: true, // 空行を無視
        complete: function(results) {
            currentQuestions = results.data;
            displayQuestions(currentQuestions);
        },
        error: function(err) {
            document.getElementById('quiz-area').innerHTML = '問題の読み込みに失敗しました。';
            console.error(err);
        }
    });
}

// 読み込んだ問題を画面に表示する関数
function displayQuestions(questions) {
    const quizArea = document.getElementById('quiz-area');
    quizArea.innerHTML = ''; // クリア

    questions.forEach((q, index) => {
        // q は {"問題（もんだい）": "...", "選択肢（せんたくし）1": "...", ...} のようなオブジェクト

        const qDiv = document.createElement('div');
        qDiv.className = 'question-container';

        // 問題文の表示
        const qText = document.createElement('p');
        qText.innerHTML = `<strong>Q${index + 1}.</strong> ${q['問題（もんだい）']}`;
        qDiv.appendChild(qText);

        // 選択肢の表示（ラジオボタン）
        const choicesDiv = document.createElement('div');
        choicesDiv.className = 'choices';

        for (let i = 1; i <= 4; i++) {
            const choiceKey = `選択肢（せんたくし）${i}`;
            if (q[choiceKey]) {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="radio" name="question-${index}" value="${i}">
                    ${q[choiceKey]}
                `;
                choicesDiv.appendChild(label);
            }
        }
        
        qDiv.appendChild(choicesDiv);
        quizArea.appendChild(qDiv);
    });

    // 採点ボタンを表示
    if (questions.length > 0) {
        document.getElementById('submit-btn').style.display = 'block';
    }
}

// 「採点する」ボタンのクリックイベント
document.getElementById('submit-btn').addEventListener('click', () => {
    let score = 0;

    currentQuestions.forEach((q, index) => {
        // ユーザーが選択したラジオボタンを取得
        const selected = document.querySelector(`input[name="question-${index}"]:checked`);
        const correctAnswer = q['正答（せいとう）'];

        // 問題コンテナを取得して色を変える（フィードバック）
        const qDiv = document.querySelectorAll('.question-container')[index];

        if (selected && selected.value === correctAnswer.trim()) {
            score++;
            qDiv.style.backgroundColor = '#e6ffe6'; // 正解は薄い緑
        } else {
            qDiv.style.backgroundColor = '#ffe6e6'; // 不正解は薄い赤
            // 正解を表示
            const correctText = document.createElement('div');
            correctText.style.color = 'red';
            correctText.style.marginTop = '10px';
            correctText.innerText = `正解: ${correctAnswer} (${q[`選択肢（せんたくし）${correctAnswer}`]})`;
            qDiv.appendChild(correctText);
        }
    });

    // 結果表示
    document.getElementById('result').innerText = `結果: ${currentQuestions.length}問中 ${score}問 正解！`;
    window.scrollTo(0, document.body.scrollHeight); // ページの一番下までスクロール
});
