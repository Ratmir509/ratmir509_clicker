// Начальные значения
const defaultState = {
    coins: 0,
    energy: 10,
    maxEnergy: 10,
    coinsPerClick: 1,
    lastEnergyUpdate: Date.now() // Время последнего обновления энергии
};

// Считывание состояния из Local Storage
function loadState() {
    const savedState = localStorage.getItem('ratmir509ClickerState');
    if (savedState) {
        const state = JSON.parse(savedState);

        // Вычисляем, сколько времени прошло с последнего обновления энергии
        const now = Date.now();
        const elapsedTime = (now - state.lastEnergyUpdate) / 1000; // Время в секундах
        const energyToRestore = Math.floor(elapsedTime); // Количество энергии, которое должно было восстановиться
        state.energy = Math.min(state.maxEnergy, state.energy + energyToRestore); // Восстановление энергии
        state.lastEnergyUpdate = now; // Обновляем время последнего обновления энергии

        return state;
    }
    return defaultState;
}

// Сохранение состояния в Local Storage
function saveState(state) {
    state.lastEnergyUpdate = Date.now(); // Сохраняем текущее время как последнее обновление энергии
    localStorage.setItem('ratmir509ClickerState', JSON.stringify(state));
}

// Сброс состояния
function resetState() {
    state = { ...defaultState }; // Возвращаем начальные значения
    saveState(state); // Сохраняем новое состояние
    updateDisplay();  // Обновляем интерфейс
    showMessage('Игра сброшена до начальных значений!');
    localStorage.removeItem('ratmir509ClickerState'); // Очищаем Local Storage
}

let state = loadState();
const { coins, energy, maxEnergy, coinsPerClick } = state;

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
}

// Функция для вывода сообщения на экран
function showMessage(message) {
    messageBox.textContent = message;
    setTimeout(() => {
        messageBox.textContent = ''; // Очистить сообщение через 3 секунды
    }, 3000);
}

// Обработчик клика по ratmir509
ratmir509.addEventListener('click', () => {
    if (state.energy > 0) {
        state.coins += state.coinsPerClick;
        state.energy -= 1;
        updateDisplay();
        saveState(state);
    }
});

// Восстановление энергии
setInterval(() => {
    if (state.energy < state.maxEnergy) {
        state.energy += 1;
        updateDisplay();
        saveState(state);
    }
}, 1000);

// Улучшение: Увеличить монеты за клик
upgradeClickButton.addEventListener('click', () => {
    if (state.coins >= 10) {
        state.coins -= 10;
        state.coinsPerClick += 1;
        showMessage('Теперь ты получаешь больше монет за клик!');
        updateDisplay();
        saveState(state);
    } else {
        showMessage('Недостаточно монет для улучшения!');
    }
});

// Улучшение: Увеличить максимальную энергию
upgradeEnergyButton.addEventListener('click', () => {
    if (state.coins >= 15) {
        state.coins -= 15;
        state.maxEnergy += 5;
        showMessage('Максимальная энергия увеличена!');
        updateDisplay();
        saveState(state);
    } else {
        showMessage('Недостаточно монет для улучшения!');
    }
});

// Обработчик клика по кнопке сброса
resetButton.addEventListener('click', resetState);

// Начальная отрисовка
updateDisplay();
