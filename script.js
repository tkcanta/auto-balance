/**
 * オートバランス.com - 5:5ゲームチーム分けサービス
 * メインのJavaScriptファイル
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の参照を取得
    const playersForm = document.getElementById('players-form');
    const playersContainer = document.getElementById('players-container');
    const generateTeamsButton = document.getElementById('generate-teams');
    const resetPlayersButton = document.getElementById('reset-players');
    const teamsContainer = document.getElementById('teams-container');
    
    // アプリケーション設定
    const CONFIG = {
        MAX_PLAYERS: 10,
        SPECIAL_NAMES: ['めう', 'meme', 'meu'],
        DEFAULT_POWER: 5
    };

    /**
     * 初期化処理
     */
    function initializeApp() {
        createPlayerInputs();
        setupEventListeners();
    }

    /**
     * イベントリスナーの設定
     */
    function setupEventListeners() {
        // チーム生成（フォーム送信）イベント
        playersForm.addEventListener('submit', handleFormSubmit);
        
        // リセットボタンイベント
        resetPlayersButton.addEventListener('click', resetPlayerInputs);
    }

    /**
     * プレイヤー入力欄を生成
     */
    function createPlayerInputs() {
        // プレイヤーパワーのラベルを先頭に表示
        playersContainer.innerHTML = `
            <div class="power-label text-end mb-1">プレイヤーパワー</div>
        `;
        
        // 10人分の入力欄を生成
        for (let i = 0; i < CONFIG.MAX_PLAYERS; i++) {
            const playerDiv = createPlayerInputRow(i);
            playersContainer.appendChild(playerDiv);
        }
        
        // パワースライダーのイベントリスナーを設定
        setupPowerSliders();
    }

    /**
     * 1行分のプレイヤー入力欄を生成
     * @param {number} index - プレイヤーのインデックス
     * @returns {HTMLElement} 生成された入力行の要素
     */
    function createPlayerInputRow(index) {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-input-row d-flex align-items-center mb-1';
        
        playerDiv.innerHTML = `
            <div class="player-number me-1">${index + 1}.</div>
            <div class="flex-grow-1">
                <input type="text" class="form-control form-control-sm player-name" 
                    placeholder="プレイヤー${index + 1}の名前" data-index="${index}">
            </div>
            <div class="ms-2">
                <div class="d-flex align-items-center">
                    <input type="range" class="form-range player-power" min="1" max="10" value="${CONFIG.DEFAULT_POWER}" 
                        data-index="${index}" style="width: 80px;">
                    <span class="power-value ms-1">${CONFIG.DEFAULT_POWER}</span>
                    <span class="ms-1">💪</span>
                </div>
            </div>
        `;
        
        return playerDiv;
    }

    /**
     * パワースライダーのイベントリスナーを設定
     */
    function setupPowerSliders() {
        document.querySelectorAll('.player-power').forEach(slider => {
            slider.addEventListener('input', updatePowerValue);
        });
    }

    /**
     * スライダー操作時のパワー値表示更新
     * @param {Event} event - 入力イベント
     */
    function updatePowerValue(event) {
        const container = event.target.closest('.d-flex');
        const powerValue = container.querySelector('.power-value');
        powerValue.textContent = event.target.value;
    }

    /**
     * プレイヤー名が特殊名称かどうかをチェック
     * @param {string} name - プレイヤー名
     * @returns {boolean} 特殊名称の場合はtrue
     */
    function isSpecialPlayer(name) {
        return CONFIG.SPECIAL_NAMES.includes(name.toLowerCase());
    }

    /**
     * 入力欄からプレイヤーデータを収集
     * @returns {Array} プレイヤーオブジェクトの配列
     */
    function collectPlayerData() {
        const players = [];
        const nameInputs = document.querySelectorAll('.player-name');
        const powerInputs = document.querySelectorAll('.player-power');
        
        for (let i = 0; i < CONFIG.MAX_PLAYERS; i++) {
            const name = nameInputs[i].value.trim();
            
            if (name) {  // 名前が入力されている場合のみ追加
                players.push({
                    name: name,
                    power: parseInt(powerInputs[i].value)
                });
            }
        }
        
        return players;
    }

    /**
     * フォーム送信時の処理
     * @param {Event} event - フォーム送信イベント
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        
        const players = collectPlayerData();
        
        // 入力チェック
        if (!validatePlayerInput(players)) {
            return;
        }
        
        // チーム分け実行
        const teamCombinations = generateTeamCombinations(players);
        displayTeamCombinations(teamCombinations);
    }

    /**
     * プレイヤー入力のバリデーション
     * @param {Array} players - プレイヤーの配列
     * @returns {boolean} 入力が有効な場合はtrue
     */
    function validatePlayerInput(players) {
        // 人数チェック
        if (players.length !== CONFIG.MAX_PLAYERS) {
            alert(`${CONFIG.MAX_PLAYERS}人分の名前を入力してください（現在: ${players.length}人）`);
            return false;
        }
        
        // 名前の重複チェック
        const names = players.map(player => player.name);
        const uniqueNames = new Set(names);
        
        if (names.length !== uniqueNames.size) {
            alert('同じ名前のプレイヤーが登録されています。全て異なる名前にしてください。');
            return false;
        }
        
        return true;
    }

    /**
     * 入力欄とチーム表示をリセット
     */
    function resetPlayerInputs() {
        // 名前入力欄をリセット
        document.querySelectorAll('.player-name').forEach(input => {
            input.value = '';
        });
        
        // パワースライダーをリセット
        document.querySelectorAll('.player-power').forEach(slider => {
            slider.value = CONFIG.DEFAULT_POWER;
            const container = slider.closest('.d-flex');
            const powerValue = container.querySelector('.power-value');
            powerValue.textContent = CONFIG.DEFAULT_POWER;
        });
        
        // チーム表示をリセット
        showInitialTeamMessage();
    }

    /**
     * 初期メッセージを表示
     */
    function showInitialTeamMessage() {
        teamsContainer.innerHTML = `
            <div class="text-center text-muted py-2">
                <p class="small mb-0">10人のプレイヤー情報を入力し、チーム分け生成ボタンをクリックしてください。</p>
            </div>
        `;
    }

    /**
     * チーム分け結果の生成
     * @param {Array} players - プレイヤーの配列
     * @returns {Array} チーム分けパターンの配列
     */
    function generateTeamCombinations(players) {
        // プレイヤーのコピーを作成し、パワー順にソート
        const sortedPlayers = [...players].sort((a, b) => b.power - a.power);
        const combinations = [];
        
        // 3つの異なるアルゴリズムでチーム分けを生成
        combinations.push(generateZigzagPattern(sortedPlayers));    // パターン1: ジグザグ割り当て
        combinations.push(generateAlternatingPattern(sortedPlayers)); // パターン2: 交互割り当て
        combinations.push(generateGreedyPattern(sortedPlayers));    // パターン3: 貪欲法
        
        // パワー差が小さい順にソート
        combinations.sort((a, b) => a.powerDifference - b.powerDifference);
        
        return combinations;
    }

    /**
     * パターン1: ジグザグ割り当てによるチーム分け
     * @param {Array} players - ソート済みプレイヤーの配列
     * @returns {Object} チーム分け結果
     */
    function generateZigzagPattern(players) {
        const shuffledPlayers = shuffleArray([...players]);
        const teamA = [];
        const teamB = [];
        
        // 1番目、4番目、5番目、8番目、9番目をチームAに
        // 2番目、3番目、6番目、7番目、10番目をチームBに
        for (let i = 0; i < shuffledPlayers.length; i++) {
            if (i % 4 === 0 || i % 4 === 3 || i === 8) {
                teamA.push(shuffledPlayers[i]);
            } else {
                teamB.push(shuffledPlayers[i]);
            }
        }
        
        return createTeamCombination(teamA, teamB);
    }

    /**
     * パターン2: 強い順に交互割り当てによるチーム分け
     * @param {Array} players - ソート済みプレイヤーの配列
     * @returns {Object} チーム分け結果
     */
    function generateAlternatingPattern(players) {
        const shuffledPlayers = shuffleArray([...players]);
        // パワー順にソート
        const powerSorted = [...shuffledPlayers].sort((a, b) => b.power - a.power);
        
        const teamA = [];
        const teamB = [];
        
        // 交互に割り振る
        for (let i = 0; i < powerSorted.length; i++) {
            if (i % 2 === 0) {
                teamA.push(powerSorted[i]);
            } else {
                teamB.push(powerSorted[i]);
            }
        }
        
        return createTeamCombination(teamA, teamB);
    }

    /**
     * パターン3: 貪欲法によるパワーバランス最適化
     * @param {Array} players - ソート済みプレイヤーの配列
     * @returns {Object} チーム分け結果
     */
    function generateGreedyPattern(players) {
        const shuffledPlayers = shuffleArray([...players]);
        const teamA = [];
        const teamB = [];
        let teamAPower = 0;
        let teamBPower = 0;
        
        // 最初の2人を各チームに振り分け
        teamA.push(shuffledPlayers[0]);
        teamAPower += shuffledPlayers[0].power;
        teamB.push(shuffledPlayers[1]);
        teamBPower += shuffledPlayers[1].power;
        
        // 残りのプレイヤーをパワー差が小さくなるように割り当て
        for (let i = 2; i < shuffledPlayers.length; i++) {
            const player = shuffledPlayers[i];
            
            if (teamA.length >= 5) {
                // チームAが既に5人なら、残りは全部チームBへ
                teamB.push(player);
                teamBPower += player.power;
            } else if (teamB.length >= 5) {
                // チームBが既に5人なら、残りは全部チームAへ
                teamA.push(player);
                teamAPower += player.power;
            } else if (teamAPower <= teamBPower) {
                // パワー合計が小さい方に割り当て
                teamA.push(player);
                teamAPower += player.power;
            } else {
                teamB.push(player);
                teamBPower += player.power;
            }
        }
        
        return {
            teamA,
            teamB,
            teamAPower,
            teamBPower,
            powerDifference: Math.abs(teamAPower - teamBPower)
        };
    }

    /**
     * チーム分け結果オブジェクトを作成
     * @param {Array} teamA - チームAのプレイヤー配列
     * @param {Array} teamB - チームBのプレイヤー配列
     * @returns {Object} チーム分け結果
     */
    function createTeamCombination(teamA, teamB) {
        const teamAPower = calculateTotalPower(teamA);
        const teamBPower = calculateTotalPower(teamB);
        
        return {
            teamA,
            teamB,
            teamAPower,
            teamBPower,
            powerDifference: Math.abs(teamAPower - teamBPower)
        };
    }

    /**
     * チームの合計パワーを計算
     * @param {Array} team - プレイヤーの配列
     * @returns {number} 合計パワー
     */
    function calculateTotalPower(team) {
        return team.reduce((sum, player) => sum + player.power, 0);
    }

    /**
     * 配列をシャッフル（Fisher-Yatesアルゴリズム）
     * @param {Array} array - シャッフルする配列
     * @returns {Array} シャッフルされた配列
     */
    function shuffleArray(array) {
        const result = [...array];
        let currentIndex = result.length;
        let randomIndex;
        
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            
            [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
        }
        
        return result;
    }
    
    /**
     * チーム分け結果を画面に表示
     * @param {Array} combinations - チーム分けパターンの配列
     */
    function displayTeamCombinations(combinations) {
        teamsContainer.innerHTML = '';
        
        combinations.forEach((combination, index) => {
            const combinationElement = createTeamCombinationElement(combination, index);
            teamsContainer.appendChild(combinationElement);
        });
    }

    /**
     * 1つのチーム分けパターン要素を生成
     * @param {Object} combination - チーム分け結果
     * @param {number} index - パターンのインデックス
     * @returns {HTMLElement} 生成された要素
     */
    function createTeamCombinationElement(combination, index) {
        const element = document.createElement('div');
        element.className = 'team-combination mb-2';
        
        element.innerHTML = `
            <h4 class="text-center mb-1 fw-bold">パターン ${index + 1} <small>(パワー差: ${combination.powerDifference})</small></h4>
            <div class="row team-row g-1">
                <div class="col-md-6">
                    ${createTeamCardHTML(combination.teamA, 'A', combination.teamAPower)}
                </div>
                <div class="col-md-6">
                    ${createTeamCardHTML(combination.teamB, 'B', combination.teamBPower)}
                </div>
            </div>
        `;
        
        return element;
    }

    /**
     * チームカードのHTML生成
     * @param {Array} team - チームのプレイヤー配列
     * @param {string} teamName - チーム名（'A'または'B'）
     * @param {number} totalPower - チームの合計パワー
     * @returns {string} チームカードのHTML
     */
    function createTeamCardHTML(team, teamName, totalPower) {
        return `
            <div class="team-card">
                <div class="team-${teamName.toLowerCase()}-header">
                    <h5 class="mb-0 fw-bold">チーム${teamName}</h5>
                </div>
                <div class="team-details">
                    <small>メンバー: ${team.length}人</small>
                    <span class="team-power-total">合計: ${totalPower} 💪</span>
                </div>
                <div class="team-members">
                    ${team.map(player => `
                        <div class="team-member">
                            <span>${player.name}${isSpecialPlayer(player.name) ? `<img src="img/unko.svg" alt="💩" class="special-icon">` : ''}</span>
                            <span class="team-member-power">${player.power} 💪</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // アプリケーションの初期化
    initializeApp();
}); 