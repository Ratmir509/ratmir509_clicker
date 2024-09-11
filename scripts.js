// Начальные значения
const defaultState = {
    coins: 0,
    energy: 10,
    maxEnergy: 10,
    coinsPerClick: 1,
    lastEnergyUpdate: Date.now(),
    upgradeClickCost: 10,
    upgradeEnergyCost: 15,
    upgradeClickCount: 0,
    upgradeEnergyCount: 0,
    maxUpgrades: 100
};

let state = loadState();

// Считывание состояния из Local Storage
function loadState() {
    const savedState = localStorage.getItem('ratmir509ClickerState');
    if (savedState) {
        const state = JSON.parse(savedState);

        const now = Date.now();
        const elapsedTime = (now - state.lastEnergyUpdate) / 1000;
        const energyToRestore = Math.floor(elapsedTime / 3);
        state.energy = Math.min(state.maxEnergy, state.energy + energyToRestore);
        state.lastEnergyUpdate = now;

        return state;
    }
    return { ...defaultState };
}

// Сохранение состояния в Local Storage
function saveState(state) {
    state.lastEnergyUpdate = Date.now();
    localStorage.setItem('ratmir509ClickerState', JSON.stringify(state));
}

// Сброс состояния
function resetState() {
    state = { ...defaultState };
    saveState(state);
    updateDisplay();
    showMessage('Игра сброшена до начальных значений!');
    localStorage.removeItem('ratmir509ClickerState');
}

// Ссылки на элементы
const ratmir509 = document.getElementById('ratmir509');
const coinsDisplay = document.getElementById('coins');
const energyDisplay = document.getElementById('energy');
const energyFill = document.getElementById('energy-fill');
const upgradeClickButton = document.getElementById('upgrade-click');
const upgradeEnergyButton = document.getElementById('upgrade-energy');
const messageBox = document.getElementById('message');
const resetButton = document.getElementById('reset');

// Обновление интерфейса
function updateDisplay() {
    coinsDisplay.textContent = `Монеты: ${state.coins}`;
    energyFill.style.width = `${(state.energy / state.maxEnergy) * 100}%`;

    // Обновляем кнопки улучшений в зависимости от лимита
    if (state.upgradeClickCount >= state.maxUpgrades) {
        upgradeClickButton.textContent = 'Максимально прокачено!';
        upgradeClickButton.disabled = true;
    } else {
        upgradeClickButton.textContent = `Улучшить клики (Цена: ${state.upgradeClickCost} монет)`;
        upgradeClickButton.disabled = false;
    }

    if (state.upgradeEnergyCount >= state.maxUpgrades) {
        upgradeEnergyButton.textContent = 'Максимально прокачено!';
        upgradeEnergyButton.disabled = true;
    } else {
        upgradeEnergyButton.textContent = `Увеличить энергию (Цена: ${state.upgradeEnergyCost} монет)`;
        upgradeEnergyButton.disabled = false;
    }
}

// Функция для вывода сообщения на экран
function showMessage(message) {
    messageBox.textContent = message;
    setTimeout(() => {
        messageBox.textContent = '';
    }, 3000);
}

// Обработчик клика по ratmir509
ratmir509.addEventListener('click', () => {
    if (state.energy > 0) {
        state.coins += state.coinsPerClick;
        state.energy -= 1;
        updateDisplay();
        saveState(state);
    } else {
        showMessage('Недостаточно энергии!');
    }
});

// Восстановление энергии каждые 3 секунды
setInterval(() => {
    if (state.energy < state.maxEnergy) {
        state.energy += 1;
        updateDisplay();
        saveState(state);
    }
}, 3000);

// Улучшение: Увеличить монеты за клик
upgradeClickButton.addEventListener('click', () => {
    if (state.coins >= state.upgradeClickCost && state.upgradeClickCount < state.maxUpgrades) {
        state.coins -= state.upgradeClickCost;
        state.coinsPerClick += 1;
        state.upgradeClickCount += 1;
        state.upgradeClickCost = Math.floor(state.upgradeClickCost * 1.5);
        showMessage('Теперь ты получаешь больше монет за клик!');
        updateDisplay();
        saveState(state);
    } else if (state.upgradeClickCount >= state.maxUpgrades) {
        showMessage('Улучшение кликов достигло максимума!');
    } else {
        showMessage('Недостаточно монет для улучшения!');
    }
});

// Улучшение: Увеличить максимальную энергию
upgradeEnergyButton.addEventListener('click', () => {
    if (state.coins >= state.upgradeEnergyCost && state.upgradeEnergyCount < state.maxUpgrades) {
        state.coins -= state.upgradeEnergyCost;
        state.maxEnergy += 5;
        state.upgradeEnergyCount += 1;
        state.upgradeEnergyCost = Math.floor(state.upgradeEnergyCost * 1.5);
        showMessage('Максимальная энергия увеличена!');
        updateDisplay();
        saveState(state);
    } else if (state.upgradeEnergyCount >= state.maxUpgrades) {
        showMessage('Увеличение энергии достигло максимума!');
    } else {
        showMessage('Недостаточно монет для улучшения!');
    }
});

// Обработчик клика по кнопке сброса
resetButton.addEventListener('click', resetState);

// Начальная отрисовка
updateDisplay();