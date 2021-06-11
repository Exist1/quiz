'use strict'
window.addEventListener('load', function() {

	const ACTIVE_CLASS = 'is-active', // Главный класс активации элемента.
		READY_CLASS = 'is-ready'; // Главный класс о готовности блока к работе.
	let startBtn = document.querySelector('.start__btn'), // Кнопка открытия опроса.
		numberQuestion = 1, // Номер начального вопроса.
		keyCode, // Номер нажатой кнопки.
		chat = document.querySelector('.chat'), // Певдо-чат блок.
		tell = document.querySelector('[type="tel"]'), // Поле для телефона.
		form = document.querySelector('.screen__form'), // Блок формы.
		btnPrev = document.querySelector('.screen__prev'), // Кнопка для переключения на предыдущий вопрос.
		btnNext = document.querySelector('.screen__next'), // Кнопка для переключения на следующий вопрос.
		questions = document.querySelector('.questions'), // Блок вопросов.
		questionsList = questions.querySelector('.questions__list'), // Список вопросов.
		questionsTab = questionsList.children, // Вопросы.
		questionsAnswers = questionsList.querySelectorAll('.questions__answer'); // Списки ответов на вопросы.

	// Метка о том, что загрузка завершена и сайт готов к работе.
	changeWidthList();
	document.body.classList.add(READY_CLASS);

	// Открытие опроса.
	startBtn.addEventListener('click', function(){
		document.body.classList.remove(READY_CLASS);
		document.body.classList.add('is-start');
	});

	// Обновление действий при изменении размеров экрана.
	window.addEventListener('resize', changeWidthList, false);

	// Переключение вопрсов кнопками управления.
	btnPrev.addEventListener('click', function() {
		if (btnPrev.classList.contains(ACTIVE_CLASS)) {
			if (!form.classList.contains('is-dop') && numberQuestion === 2) {
				numberQuestion = 1;
				questionSwitching('left');
			} else {
				questionSwitching('left');
			};

			changeWidthList();
		};
	});
	btnNext.addEventListener('click', function() {
		if (btnNext.classList.contains(ACTIVE_CLASS)) {
			questionSwitching('right');
			changeWidthList();
		};
	});

	// Применение маски на поле, для телефона.
	tell.addEventListener('blur', maskPhone, false);
	tell.addEventListener('focus', maskPhone, false);
	tell.addEventListener('input', maskPhone, false);
	tell.addEventListener('keydown', maskPhone, false);

	// Выбор ответа и отметка чекбокса для формы.
	for (let qa = 0; qa < questionsAnswers.length; qa++) {
		let answer = questionsAnswers[qa], // Ответ.
			answerItem = answer.children, // Варианты ответов.
			answerCheck = answer.querySelectorAll('[type="checkbox"]'); // Чекбоксы ответов для формы.

		for (let ai = 0; ai < answerItem.length; ai++) {
			let item = answerItem[ai]; // Вариант ответа.

			item.addEventListener('click', function() {
				changeActiveClass(ai, answerItem);

				// Включение дополнительного вопроса.
				if (qa === 0 && item.classList.contains('questions__item-dop')) {
					form.classList.add('is-dop');
					numberQuestion = 0;
					questionSwitching('right');
				} else if (qa === 0) {
					form.classList.remove('is-dop');
					numberQuestion = 1;
					questionSwitching('right');

					let dopAnswers = questionsAnswers[1].children; // Дополнительные вопросы.

					// Убираем дополнительные ответы из фоормы, если выбран ответ, который не идёт с дополнительными.
					for (let da = 0; da < dopAnswers.length; da++) {
						let dop = dopAnswers[da], // Дополнительный ответ.
							dopCheck = dop.querySelector('[type="checkbox"]'); // Дополнительный чекбокс.

						dop.classList.remove(ACTIVE_CLASS);
						dopCheck.checked = false;
					};

				} else {
					questionSwitching('right');
				};

				changeWidthList();

				for (let ac = 0; ac < answerCheck.length; ac++) {
					let check = answerCheck[ac];

					check.checked = false;

					if (ac === ai) check.checked = true;
				};
			});
		};
	};

	/* Функция перебора активного класса между элементами.
		@param {number} number - номер выбранного элемента.
		@param {elements} elements - элементы, между которыми будет смена класса. */
	function changeActiveClass(number, elements) {
		for (let cac = 0; cac < elements.length; cac++) {
			let el = elements[cac]; // Элемент.

			el.classList.remove(ACTIVE_CLASS);
			if (number === cac) { el.classList.add(ACTIVE_CLASS); };
		};
	};

	/* Функция изменения длины списка вопросов. */
	function changeWidthList() {
		let lengthList = questions.offsetWidth*questionsTab.length, // Вся длина списка.
		 percentTab = (questions.offsetWidth*100)/lengthList; // Длина вопроса в процентном соотношении.
		
		questionsList.style.width = lengthList/16 + 'rem';

		return percentTab;
	};

	/* Функция переключения вопроса.
		@param {string} dir - направление движения списка вопросов. */
	function questionSwitching(dir) {
		let textItem = document.querySelector('.textItem'); // Поле ввода длины забора.

		if (dir === 'left' && numberQuestion >= 1) {
			numberQuestion--;
		} else if (dir === 'right' && numberQuestion <= (questionsTab.length - 1)) {
			numberQuestion++;
		};

		textItem.addEventListener('input', function() {
			if (textItem.value != '') {
				btnNext.classList.add(ACTIVE_CLASS);
				btnNext.addEventListener('click', function() {
					btnNext.classList.remove(ACTIVE_CLASS);
				});
			} else {
				btnNext.classList.remove(ACTIVE_CLASS);
			};
		});

		// Если вопрос не первый, то активируем кнопку переключения назад.
		if (numberQuestion > 0) {
			btnPrev.classList.add(ACTIVE_CLASS);
		} else {
			btnPrev.classList.remove(ACTIVE_CLASS);
		};

		// Показ и изменение текста у псевдо-чата.
		if (numberQuestion > 0 && numberQuestion < 3) {
			let chatText = chat.querySelector('.chat__msg');

			chat.classList.add(ACTIVE_CLASS);

			if (numberQuestion === 1) {
				chatText.textContent = 'Есть несколько типов забора, выберите какой вам больше подходит.';
			} else {
				chatText.textContent = 'Укажите примерную высоту вашего забора.';
			};

		} else {
			chat.classList.remove(ACTIVE_CLASS);
		};

		questionsList.style.transform = 'translateX(-' + changeWidthList()*numberQuestion + '%)';
		changeActiveClass(numberQuestion, questionsTab);

		// Если вопрос последний, то открываем форму и скрываем всё лишнее.
		if (numberQuestion === questionsTab.length - 1) {
			form.classList.add(READY_CLASS);
		};
	};

	/* Функция маски для телефона. */
	function maskPhone(event) {
		event.keyCode && (keyCode = event.keyCode);

		let cursor_pos = this.selectionStart,
			cursor_minPos = 4;
		if (cursor_pos < cursor_minPos) {
			this.selectionStart = cursor_minPos;
			this.selectionEnd = cursor_minPos;
			// event.preventDefault();
		};

		let matrix = "+7 (___) ___-__-__",
			i = 0,
			def = matrix.replace(/\D/g, ""),
			val = this.value.replace(/\D/g, ""),
			new_value = matrix.replace(/[_\d]/g, function(a) {
				return i < val.length ? val.charAt(i++) || def.charAt(i) : a
			});

		i = new_value.indexOf("_");

		if (i != -1) {
			i < 5 && (i = 4);
			new_value = new_value.slice(0, i);
		};

		let reg = matrix.substr(0, this.value.length).replace(/_+/g, function(a) {
			return "\\d{1," + a.length + "}"
		}).replace(/[+()]/g, "\\$&");

		reg = new RegExp("^" + reg + "$");

		if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
		if (event.type == "blur" && this.value.length < 5)  this.value = "";
	};

});