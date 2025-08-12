// Variáveis para armazenar as cotações
let exchangeRates = {
    USD_BRL: 0,
    EUR_BRL: 0,
    BRL_USD: 0,
    BRL_EUR: 0
};

// Função para mostrar/ocultar abas
function showTab(tabName) {
    // Remove active de todas as abas
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Adiciona active na aba clicada
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Função para validar entrada numérica (permite números, vírgula e sinal negativo)
function validateNumericInput(input, allowNegative = false) {
    let value = input.value;
    
    // Remove caracteres inválidos
    if (allowNegative) {
        value = value.replace(/[^0-9,-]/g, '');
    } else {
        value = value.replace(/[^0-9,]/g, '');
    }
    
    // Garante apenas uma vírgula
    const parts = value.split(',');
    if (parts.length > 2) {
        value = parts[0] + ',' + parts.slice(1).join('');
    }
    
    // Garante sinal negativo apenas no início
    if (allowNegative && value.indexOf('-') > 0) {
        value = value.replace(/-/g, '');
        if (input.value.startsWith('-')) {
            value = '-' + value;
        }
    }
    
    input.value = value;
    return parseFloat(value.replace(',', '.')) || 0;
}

// Funções de conversão de temperatura
function convertFahrenheitToCelsius() {
    const fahrenheitInput = document.getElementById('fahrenheit');
    const celsiusInput = document.getElementById('celsius');
    
    if (fahrenheitInput.value.trim() === '' || fahrenheitInput.value === '-') {
        celsiusInput.value = '';
        return;
    }
    
    const fahrenheit = validateNumericInput(fahrenheitInput, true);
    const celsius = (fahrenheit - 32) / 1.8;
    celsiusInput.value = celsius.toFixed(2);
}

function convertCelsiusToFahrenheit() {
    const celsiusInput = document.getElementById('celsius');
    const fahrenheitInput = document.getElementById('fahrenheit');
    
    if (celsiusInput.value.trim() === '' || celsiusInput.value === '-') {
        fahrenheitInput.value = '';
        return;
    }
    
    const celsius = validateNumericInput(celsiusInput, true);
    const fahrenheit = (celsius * 1.8) + 32;
    fahrenheitInput.value = fahrenheit.toFixed(2);
}

// Função para obter cotação da API
async function getExchangeRate(fromCurrency, toCurrency) {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/e49bcf089726ccc1cbfb750b/latest/${fromCurrency}`);
        if (response.ok) {
            const data = await response.json();
            return data.conversion_rates[toCurrency];
        } else {
            throw new Error('Erro ao obter cotação');
        }
    } catch (error) {
        console.error('Erro na API:', error);
        return null;
    }
}

// Funções de conversão de moedas
async function convertDollarToReal() {
    const dollarInput = document.getElementById('dollar');
    const realInput = document.getElementById('real');
    
    if (dollarInput.value.trim() === '') {
        realInput.value = '';
        return;
    }
    
    const dollarValue = validateNumericInput(dollarInput);
    if (exchangeRates.USD_BRL > 0) {
        const realValue = dollarValue * exchangeRates.USD_BRL;
        realInput.value = realValue.toFixed(2);
    }
}

async function convertRealToDollar() {
    const realInput = document.getElementById('real');
    const dollarInput = document.getElementById('dollar');
    
    if (realInput.value.trim() === '') {
        dollarInput.value = '';
        return;
    }
    
    const realValue = validateNumericInput(realInput);
    if (exchangeRates.BRL_USD > 0) {
        const dollarValue = realValue * exchangeRates.BRL_USD;
        dollarInput.value = dollarValue.toFixed(2);
    }
}

async function convertEuroToReal() {
    const euroInput = document.getElementById('euro');
    const realEuroInput = document.getElementById('realEuro');
    
    if (euroInput.value.trim() === '') {
        realEuroInput.value = '';
        return;
    }
    
    const euroValue = validateNumericInput(euroInput);
    if (exchangeRates.EUR_BRL > 0) {
        const realValue = euroValue * exchangeRates.EUR_BRL;
        realEuroInput.value = realValue.toFixed(2);
    }
}

async function convertRealToEuro() {
    const realEuroInput = document.getElementById('realEuro');
    const euroInput = document.getElementById('euro');
    
    if (realEuroInput.value.trim() === '') {
        euroInput.value = '';
        return;
    }
    
    const realValue = validateNumericInput(realEuroInput);
    if (exchangeRates.BRL_EUR > 0) {
        const euroValue = realValue * exchangeRates.BRL_EUR;
        euroInput.value = euroValue.toFixed(2);
    }
}

// Funções de conversão de distância
function convertMilesToKilometers() {
    const milesInput = document.getElementById('miles');
    const kilometersInput = document.getElementById('kilometers');
    
    if (milesInput.value.trim() === '') {
        kilometersInput.value = '';
        return;
    }
    
    const miles = validateNumericInput(milesInput);
    const kilometers = miles * 1.60934;
    kilometersInput.value = kilometers.toFixed(2);
}

function convertKilometersToMiles() {
    const kilometersInput = document.getElementById('kilometers');
    const milesInput = document.getElementById('miles');
    
    if (kilometersInput.value.trim() === '') {
        milesInput.value = '';
        return;
    }
    
    const kilometers = validateNumericInput(kilometersInput);
    const miles = kilometers / 1.60934;
    milesInput.value = miles.toFixed(2);
}

// Funções de conversão de tempo
function convertHoursToMinutes() {
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    
    if (hoursInput.value.trim() === '') {
        minutesInput.value = '';
        return;
    }
    
    const hours = validateNumericInput(hoursInput);
    const minutes = hours * 60;
    minutesInput.value = minutes.toFixed(2);
}

function convertMinutesToHours() {
    const minutesInput = document.getElementById('minutes');
    const hoursInput = document.getElementById('hours');
    
    if (minutesInput.value.trim() === '') {
        hoursInput.value = '';
        return;
    }
    
    const minutes = validateNumericInput(minutesInput);
    const hours = minutes / 60;
    hoursInput.value = hours.toFixed(2);
}

// Função para carregar cotações
async function loadExchangeRates() {
    try {
        // Carrega cotações USD -> BRL e BRL -> USD
        const [usdToBrl, brlToUsd] = await Promise.all([
            getExchangeRate('USD', 'BRL'),
            getExchangeRate('BRL', 'USD')
        ]);
        
        if (usdToBrl && brlToUsd) {
            exchangeRates.USD_BRL = usdToBrl;
            exchangeRates.BRL_USD = brlToUsd;
            document.getElementById('dollarRate').innerHTML = `💵 Dólar: R$ ${usdToBrl.toFixed(2)}`;
        } else {
            document.getElementById('dollarRate').innerHTML = `<div class="error">Erro ao carregar cotação do dólar</div>`;
        }

        // Carrega cotações EUR -> BRL e BRL -> EUR
        const [eurToBrl, brlToEur] = await Promise.all([
            getExchangeRate('EUR', 'BRL'),
            getExchangeRate('BRL', 'EUR')
        ]);
        
        if (eurToBrl && brlToEur) {
            exchangeRates.EUR_BRL = eurToBrl;
            exchangeRates.BRL_EUR = brlToEur;
            document.getElementById('euroRate').innerHTML = `💶 Euro: R$ ${eurToBrl.toFixed(2)}`;
        } else {
            document.getElementById('euroRate').innerHTML = `<div class="error">Erro ao carregar cotação do euro</div>`;
        }
    } catch (error) {
        console.error('Erro ao carregar cotações:', error);
        document.getElementById('dollarRate').innerHTML = `<div class="error">Erro ao carregar cotações</div>`;
        document.getElementById('euroRate').innerHTML = `<div class="error">Erro ao carregar cotações</div>`;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Conversões de temperatura
    const fahrenheitInput = document.getElementById('fahrenheit');
    const celsiusInput = document.getElementById('celsius');
    
    fahrenheitInput.addEventListener('input', convertFahrenheitToCelsius);
    celsiusInput.addEventListener('input', convertCelsiusToFahrenheit);

    // Conversões de moedas
    const dollarInput = document.getElementById('dollar');
    const realInput = document.getElementById('real');
    const euroInput = document.getElementById('euro');
    const realEuroInput = document.getElementById('realEuro');

    dollarInput.addEventListener('input', convertDollarToReal);
    realInput.addEventListener('input', convertRealToDollar);
    euroInput.addEventListener('input', convertEuroToReal);
    realEuroInput.addEventListener('input', convertRealToEuro);

    // Conversões de distância
    const milesInput = document.getElementById('miles');
    const kilometersInput = document.getElementById('kilometers');
    
    milesInput.addEventListener('input', convertMilesToKilometers);
    kilometersInput.addEventListener('input', convertKilometersToMiles);

    // Conversões de tempo
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    
    hoursInput.addEventListener('input', convertHoursToMinutes);
    minutesInput.addEventListener('input', convertMinutesToHours);

    // Carrega as cotações ao inicializar
    loadExchangeRates();
});