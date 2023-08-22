// Движение вперед

// Объект с сохраненными ответами
var answers = {
    2: null,
    3: null,
    4: null,
    5: null,
};

var btbNext = document.querySelectorAll('[data-nav="next"]');
btbNext.forEach(function (button) {
    button.addEventListener("click", function () {
        var thisCard = this.closest("[data-card]");
        var thisCardNumber = parseInt(thisCard.dataset.card);

        if (thisCard.dataset.validate == "novalidate") {
            navigate("next", thisCard);
            updateProgressBar("next", thisCardNumber);

        } else {
            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

            //Валидация на заполненность
            if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                navigate("next", thisCard);
                updateProgressBar("next", thisCardNumber);
            } else {
                alert("Выберите ответ.");
            }
        }
    });
});

// Движение назад
var btbPrev = document.querySelectorAll('[data-nav="prev"]');
btbPrev.forEach(function (button) {
    button.addEventListener("click", function () {
        var thisCard = this.closest("[data-card]");
        var thisCardNumber = parseInt(thisCard.dataset.card);

        navigate("prev", thisCard);
        updateProgressBar("prev", thisCardNumber);

    });
});

// Функция для навигации вперед и назад
function navigate(direction, thisCard) {
    var thisCardNumber = parseInt(thisCard.dataset.card);
    var nextCard;
    if (direction == "next") {
        nextCard = thisCardNumber + 1;
    } else if (direction == "prev") {
        nextCard = thisCardNumber - 1;
    }

    thisCard.classList.add("hidden");
    document
        .querySelector(`[data-card = "${nextCard}"]`)
        .classList.remove("hidden");
}

// Функция сбора заполненных данных с карточки
function gatherCardData(number) {
    var question;
    var result = [];

    // Находим карточку по номеру и data-атрибуту
    var currentCard = document.querySelector(`[data-card="${number}"`);

    // Находим главный вопрос карточки
    question = currentCard.querySelector("[data-question]").innerText;

    // 1. Находим все заполненные значения из радио кнопок
    var radioValues = currentCard.querySelectorAll('[type="radio"]');

    radioValues.forEach(function (item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value,
            });
        }
    });

    // 2. Находим все заполненные значения из чекбоксов
    var checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
    checkBoxValues.forEach(function (item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value,
            });
        }
    });

    // 3. Находим все заполненные значения из инпутов
    var inputValues = currentCard.querySelectorAll(
        '[type="text"], [type = "email"], [type = "number"]'
    );
    inputValues.forEach(function (item) {
        itemValue = item.value;
        if (itemValue.trim() != "") {
            result.push({
                name: item.name,
                value: item.value,
            });
        }
    });

    var data = {
        question: question,
        answer: result,
    };

    return data;
}

// Функция записи ответа в объект с ответами
function saveAnswer(number, data) {
    answers[number] = data;
}

// функция проверки на заполненность
function isFilled(number) {
    if (answers[number].answer.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Функция проверки email
function validateEmail(email) {
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}

// Проверка на заполненность requıred чекбоксов и инпутов с email
function checkOnRequired(number) {
    var currentCard = document.querySelector(`[data-card = "${number}"]`);
    var requiredFields = currentCard.querySelectorAll("[required]");
    var isValidArray = [];

    requiredFields.forEach(function (item) {
        if (item.type == "checkbox" && item.checked == false) {
            isValidArray.push(false);
        } else if (item.type == "email" && item.checked == false) {
            if (!validateEmail(item.value)) {
                isValidArray.push(false);
            }
        }
    });

    if (isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        false;
    }
}

// Подсветка рамки радио кнопок
document.querySelectorAll(".radio-group").forEach(function (item) {
    item.addEventListener("click", function (e) {
        //Проверяем активный класс у всех тегов label
        var label = e.target.closest("label");
        if (label) {
            // Отменяем активный класс у всех тегов label
            label
                .closest(".radio-group")
                .querySelectorAll("label")
                .forEach(function (item) {
                    item.classList.remove("radio-block--active");
                });
            // Добавляем активный класс к label по которому был клик
            label.classList.add("radio-block--active");
        }
    });
});
    
// Подсветка checkbox
document.querySelectorAll('label.checkbox-block input[type="checkbox"').forEach(function (item) {
        item.addEventListener("change", function (e) {
            //Проверяем активный класс у всех тегов label
            if (item.checked) {
                //
                item.closest("label").classList.add("checkbox-block--active");
            } else {
                item.closest("label").classList.remove("checkbox-block--active");
            }
        });
});
    
// Отображение прогресс бара

function updateProgressBar(direction, cardNumber) {
    //Расчитываем количество карточек
    var cardTotalNumber = document.querySelectorAll("[data-card]").length;

    // Текущая карточка
    // Проверка направления перемещения
    if (direction == "next") {
        cardNumber += 1;
    } else if (direction == "prev") {
        cardNumber -= 1;
    };

    // Расчет % прохождения
    progress = Math.round((cardNumber / cardTotalNumber) * 100);

    // Обновляем прогресс бар
    var currentCard = document.querySelector(`[data-card = "${cardNumber}"]`);

    if (currentCard.querySelector(".progress")) {
        currentCard.querySelector(".progress__label strong").innerText = `${progress}%`;
        currentCard.querySelector(".progress__line-bar").style = `width: ${progress}%`;
    };
};
