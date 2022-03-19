const elements = {
	usersContainer: document.querySelector( ".users-page__item-box" ),
	newUserNameInput: document.querySelector( ".users-page__new-item .user-item__name" ),
	newUserPhoneInput: document.querySelector( ".users-page__new-item .user-item__phone" ),
	newUserNameError: document.querySelector( ".user-item__validation-error_name" ),
	newUserPhoneError: document.querySelector( ".user-item__validation-error_phone" ),
	newUserButton: document.querySelector( ".button_add-user" ),
};

const regName = /^[a-zа-я]+$/i;
const regPhone = /^[a-zа-я]+$/i;

const users = [
	{
		id: 0,
		name: "Тест1",
		phone: "8 (901) 949 53-17",
		nameError: false,
		phoneError: false,
		isEditing: false
	},
	{
		id: 12,
		name: "Тест2",
		phone: "8 (901) 949 53-17",
		nameError: false,
		phoneError: false,
		isEditing: false
	},
	{
		id: 22,
		name: "Тест3",
		phone: "8 (901) 949 53-17",
		nameError: false,
		phoneError: false,
		isEditing: false
	},
	{
		id: 32,
		name: "Тест4",
		phone: "8 (901) 949 53-17",
		nameError: false,
		phoneError: false,
		isEditing: false
	}
];

// Создать функцию для изменения данных, сверять исходные и входные данные, заменять точечно.
// Временно, потом провести точечное удаление/добавление в список, не весь массив рендерить заново.

const getUserTemplateHTML = ( id, name, phone ) => {
	return `<div class="user-item" data-id="${id}">
		<div class="user-item__input-box">
			<label class="user-item__input-wrapper">
				<input class="user-item__name" type="text" placeholder="Введите имя" value="${name}" readonly>
				<span class="user-item__validation-error" style="display: none;"></span>
			</label>
			<label class="user-item__input-wrapper">
				<input class="user-item__phone" type="text" placeholder="8 (901) 949 53-17" value="${phone}" readonly>
				<span class="user-item__validation-error" style="display: none;"></span>
			</label>
		</div>
		<div class="user-item__button-box">
			<button class="button button_green button_edit-user">Редактировать</button>
			<button class="button button_red button_remove-user">Удалить</button>
		</div>
	</div>`;
};

const initUsersHTML = () => {
	users.forEach( item => elements.usersContainer.insertAdjacentHTML(
		"beforeEnd",
		getUserTemplateHTML( item.id, item.name, item.phone )
	));
};

// ${item.nameError ? `<span class="user-item__validation-error">*Заполните поле!</span>` : ""}
// ${item.phoneError ? `<span class="user-item__validation-error">*Заполните поле корректно!</span>` : ""}

const getMessageValidationError = ( value, reg ) => {
	if (!value.length) return "Заполните поле!"; 
	if (!reg.test( value )) return "Поле не соответствует формату!";

	return false;
}

// В дальнейшем передавать, может, сразу значения инпутов?
const getValidationInfo = ( nameInput, phoneInput ) => {
	const name = nameInput.value;
	const phone = phoneInput.value;

	const result = {
		name,
		phone,
		nameErrorMessage: false,
		phoneErrorMessage: false
	};

	result.nameErrorMessage = getMessageValidationError( name, regName );
	result.phoneErrorMessage = getMessageValidationError( phone, regPhone );
	result.isError = !!(result.nameErrorMessage || result.phoneErrorMessage);

	return result;
};

const setNewUserError = ( errorElement, message ) => {
	if (!message) return errorElement.style.display = "none";
	message = `*${message}`;

	if (message !== errorElement.innerHTML) errorElement.innerHTML = message;
	errorElement.style.display = "inline-block";
};

const getUserIndex = userId => {
	for (let index = 0; index < users.length; index++) {
		if (users[index].id === userId) return index;
	}

	return -1;
};

const addUser = ( name, phone ) => {
	// ну, в качестве заглушки пусть будет timestamp)
	const id = new Date().getTime();
	users.push({
		id,
		name,
		phone,
		nameError: false,
		phoneError: false,
		isEditing: false
	});

	elements.usersContainer.insertAdjacentHTML( "beforeEnd", getUserTemplateHTML( id, name, phone ) );

	elements.newUserNameInput.value = "";
	elements.newUserPhoneInput.value = "";
};

const setUser = ( name, phone ) => {

};

const removeUser = userIndex => {
	users.splice( userIndex, 1 );
	
	document.querySelectorAll( ".user-item" )[userIndex].remove();
};



initUsersHTML();

elements.usersContainer.addEventListener( "click", event => {
	// Как я помню, оператор ?. поддерживается не всеми браузерами, в таких ситуациях мне помогает Babel в Webpack/GULP.
	const userId = parseInt( event.target.closest( ".user-item" )?.dataset.id );
	if (isNaN( userId )) return;

	const userIndex = getUserIndex( userId );
	if (userIndex === -1) return;

	if (event.target.classList.contains( "button_edit-user" )) {
		const item = event.target.parentNode.parentNode;
		users[userIndex].isEditing = !users[userIndex].isEditing;

		if (event.target.innerHTML === "Сохранить") {
			users[userIndex].name = item.querySelector( ".user-item__name" ).value;
			users[userIndex].phone = item.querySelector( ".user-item__phone" ).value;

			// initUsersHTML();
		}
		else {
			// initUsersHTML();

			document.querySelectorAll( ".users-page__item-box .user-item__name" )[userIndex].focus();

			// Временный костыль.
			const value = document.querySelectorAll( ".users-page__item-box .user-item__name" )[userIndex].value;
			document.querySelectorAll( ".users-page__item-box .user-item__name" )[userIndex].value = "";
			document.querySelectorAll( ".users-page__item-box .user-item__name" )[userIndex].value = value;

			// при точечном изменении передавать аргумент isFocusName и index, на который его применить и с инпутом которого обновлять данные.
		}
	}
	else if (event.target.classList.contains( "button_remove-user" )) {
		removeUser( userIndex );
	}
});

elements.newUserButton.addEventListener( "click", event => {
	event.preventDefault();

	const { name, phone, isError, nameErrorMessage, phoneErrorMessage } = getValidationInfo( elements.newUserNameInput, elements.newUserPhoneInput );
	if (!isError) addUser( name, phone );

	setNewUserError( elements.newUserNameError, nameErrorMessage );
	setNewUserError( elements.newUserPhoneError, phoneErrorMessage );
});