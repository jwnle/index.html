const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const apiKeyInput = document.getElementById('apiKey');

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getRecipeResponse(apiKey, message) {
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }]
        })
    };

    try {
        const response = await fetch(apiEndpoint, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            throw new Error('응답에 선택지가 없습니다.');
        }
    } catch (error) {
        console.error('OpenAI API 호출 중 오류 발생:', error);
        return '챗봇이 응답할 수 없습니다. 다시 시도해 주세요.';
    }
}

sendBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    const message = userInput.value.trim();

    if (!apiKey) {
        alert('API 키를 입력하세요.');
        return;
    }

    if (!message) return;

    appendMessage('나', message);
    userInput.value = '';

    const recipeResponse = await getRecipeResponse(apiKey, message);
    appendMessage('챗봇', recipeResponse);
});

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendBtn.click();
    }
});
