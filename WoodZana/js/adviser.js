let questions = [
    {
        question: 'Выберите тип мебели, которая нужна:',
        type: 'choose',
        body: 'qs0',
    },
    {
        question: 'У вас есть чертеж?',
        type: 'choose',
        body: 'qs1',
    },
    {
        question: "Имя",
        type: 'fill',
        body: 'qs2',
    },
    {
        question: "Телефон",
        type: 'fill',
        body: 'qs3',
    },
    {
        question: "Город",
        type: 'fill',
        body: 'qs4',
    },
    {
        question: "Загрузить фото/файл",
        type: 'file',
        body: 'qs5',
    },
    {
        finish: true,
        body: 'qs6',
    },
];

class RoseMessage {

    static createMessage(mymessage = 'Error', type = 'error') {
        let container;
        let id = 'mes'+hashCode(String(mymessage));

        if (document.querySelector('#message-container')) {
            container = document.querySelector('#message-container');
        } else {
            container = document.createElement('div');
            container.id = 'message-container';
            document.documentElement.append(container);
        }

        let messageWidget = document.createElement('div');
        let message = document.createElement('p');
        let closer = document.createElement('span');

        messageWidget.classList.add(id);

        let icons = {
            error: '<svg x="0px" y="0px" viewBox="0 0 512 512"><path d="M256,0C114.497,0,0,114.507,0,256c0,141.503,114.507,256,256,256c141.503,0,256-114.507,256-256 C512,114.497,397.493,0,256,0z M256,472c-119.393,0-216-96.615-216-216c0-119.393,96.615-216,216-216 c119.393,0,216,96.615,216,216C472,375.393,375.385,472,256,472z"/><path d="M256,128.877c-11.046,0-20,8.954-20,20V277.67c0,11.046,8.954,20,20,20s20-8.954,20-20V148.877 C276,137.831,267.046,128.877,256,128.877z"/><circle cx="256" cy="349.16" r="27"/></svg>',

        }

        if (container.querySelector('.'+id)) {
            container.querySelector('.'+id).classList.add('shaking');

            setTimeout(() => {
                container.querySelector('.'+id).classList.remove('shaking');
            }, 500);

            return;
        }

        messageWidget.classList.add('message-widget');
        messageWidget.classList.add(type);
        message.classList.add('message');
        closer.classList.add('close');

        closer.addEventListener('click', () => {
            this.deleteMessage(messageWidget);
        });

        message.textContent = mymessage;
        closer.innerHTML = '<svg height="10" viewBox="0 0 413.348 413.348" width="10"><path d="m413.348 24.354-24.354-24.354-182.32 182.32-182.32-182.32-24.354 24.354 182.32 182.32-182.32 182.32 24.354 24.354 182.32-182.32 182.32 182.32 24.354-24.354-182.32-182.32z"/></svg>';

        if (icons[type]) {
            let icon = document.createElement('span');
            icon.classList.add('icon');
            icon.innerHTML = icons[type];
            messageWidget.append(icon);
        }

        messageWidget.append(message);
        messageWidget.append(closer);

        container.append(messageWidget);

        setTimeout(() => {
            messageWidget.classList.add('showing');
        }, 0);

        let deleteTimeout = setTimeout(() => {
            this.deleteMessage(messageWidget);
        }, 6500);

        messageWidget.addEventListener('mouseenter', () => {
            clearTimeout(deleteTimeout);
        });

        messageWidget.addEventListener('mouseleave', () => {
            deleteTimeout = setTimeout(() => {
                this.deleteMessage(messageWidget);
            }, 6500);
        });
        
    }

    static deleteMessage(message) {
        message.addEventListener('transitionend', () => {
            message.remove();
        });

        message.style.opacity = 0;
        message.style.transform = 'translate(20px, -200%)';
    }

    static error(message) {
        this.createMessage(message, 'error');
    }
}

function hashCode(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

let userAnswers = [];

function initAdviser() {
    let nextBtn = document.querySelector('.advicer__btn--next');
    let prevBtn = document.querySelector('.advicer__btn--prev');

    let currentStep = 1;
    updateStep(currentStep);

    document.querySelector('.steps-count').textContent = questions.length - 1;

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!(currentStep >= questions.length)) {
            let inputsArr = [... document.querySelectorAll('.advicer__body input')];

            if (questions[currentStep - 1].type == 'choose') {
                if (!inputsArr.some(inp => inp.checked)) {
                    RoseMessage.error('Виберіть хоча б один варіант відповіді');
                    return;
                }
            }

            if (questions[currentStep - 1].type == 'fill') {
                if (!inputsArr.some(inp => inp.value != '')) {
                    RoseMessage.error('Заповніть всі поля');
                    return;
                }
            }

            if (questions[currentStep - 1].type == 'file') {
                if (document.querySelector('.image-loader img').src = '') {
                    RoseMessage.error('Заповніть всі поля');
                    return;
                }
            }

            currentStep++;
            updateStep(currentStep);

            if (userAnswers[currentStep - 1]) {
                setAnswers(currentStep);
            }

            if (currentStep >= questions.length - 1) {
                nextBtn.style.width = nextBtn.offsetWidth + 'px';
                nextBtn.textContent = 'Закінчити';
                nextBtn.classList.add('advicer__btn--finish');
            }

            currentStep >= 1 ? prevBtn.classList.remove('advicer__btn--disabled') : '';
        }
    });

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!(currentStep <= 1)) {
            currentStep--;
            updateStep(currentStep);
            setAnswers(currentStep);

            currentStep <= 1 ? prevBtn.classList.add('advicer__btn--disabled') : '';
            if (currentStep <= questions.length) {
                nextBtn.textContent = 'Далі';
                nextBtn.classList.remove('advicer__btn--finish');
            }
        }
    });
}

function updateStep(currentStep) {
    let questionBody = document.querySelector('.advicer__body');
    let questionField = document.querySelector('.advicer__question');
    let progressBar = document.querySelector('.advicer__progress');
    let stepViewer = document.querySelector('.current-step');
    let images = [... document.querySelectorAll('.advice__img')];

    progressBar.style.width = (progressBar.parentElement.offsetWidth / questions.length) * currentStep + 'px'; 
    currentStep <= questions.length - 1 ? stepViewer.textContent = currentStep : '';

    
    

    if (questions[currentStep - 1].finish) {
        questionBody.closest('.advicer').classList.add('advicer--finish');
        questionBody.innerHTML = document.querySelector('#finish').content.firstElementChild.innerHTML;

        let result = JSON.stringify(userAnswers);

        //=============


        //========AJAX


        //============

        return;
    }

    questionField.textContent = questions[currentStep - 1].question;
    questionBody.innerHTML = document.querySelector('#' + questions[currentStep - 1].body).content.firstElementChild.innerHTML;

    questions[currentStep - 1].type == 'file' ? initFileInputs() : '';

    let inputsArr = [... document.querySelectorAll('.advicer__body input')];
    let idAuth;

    if (questions[currentStep - 1].type == 'choose') {
        idAuth = 'checked';
    }

    if (questions[currentStep - 1].type == 'fill') {
        idAuth = 'value';
    }

    if (questions[currentStep - 1].type == 'file') {
        idAuth = 'dataset.file';
    }

    [... document.querySelectorAll('.advicer__body input')].forEach(inp => {
        inp.addEventListener('change', () => {
            setTimeout(() => {
                let currentAnswers = inputsArr.map(inp => [inp.dataset.value, {value:(inp[idAuth] || inp.dataset.file), ansver: inp.dataset.text}]).filter(el => el[1].value);
                updateAnswers(currentStep, currentAnswers);
            }, 50);
        });
    });

    images[currentStep - 1] ? images[currentStep - 1].classList.add('advice__img--active') : '';
    images[currentStep] ? images[currentStep].classList.remove('advice__img--active') : '';
    images[currentStep-2] ? images[currentStep-2].classList.remove('advice__img--active') : '';

    questionBody.style.height = questionBody.scrollHeight + 'px';
}

function updateAnswers(currentStep, answers) {
    userAnswers[currentStep - 1] = [questions[currentStep - 1].question, answers];
}

function setAnswers(currentStep) {
    [... document.querySelectorAll('.advicer__body input')].forEach((e, i) => {
        if ((e.type == 'checkbox' || e.type == 'radio')) {
            userAnswers[currentStep - 1][1].some(ans => ans[0] == e.dataset.value) ? e.checked = true : '';
        }

        if ((e.type == 'text')) {
            e.value = userAnswers[currentStep - 1][1][i][1]['value'];
        }

        if ((e.type == 'file')) {
            e.closest('.image-loader').querySelector('img').src = userAnswers[currentStep - 1][1][i][1]['value'];
        }
    })
}

function initFileInputs() {
    [... document.querySelectorAll('.file-input')].forEach(input => {
        input.addEventListener('change', e => {
            let newImage = document.createElement('img');
            let imageWrapper = input.closest('.image-loader').querySelector('.image-loader__choosen-image');
            let reader = new FileReader();

            reader.onload = function() {
                newImage.src = reader.result;
                e.target.dataset.file = reader.result;
            };

            reader.readAsDataURL(e.target.files[0]);
            
            imageWrapper.innerHTML = '';
            imageWrapper.append(newImage);
            // newImage.style.height = input.closest('.image-loader').offsetHeight + 'px';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        initFileInputs();
        initAdviser();
    } catch(e) {
        console.error(e)
    }
}); 