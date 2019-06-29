// Все переменные, которые нам пригодятся.
let allElements = [];
let hideElement = [];
let body = document.querySelector('body')
let form = document.querySelector('.form form');
let buttonCreate = document.querySelector('form .create');
let head = document.querySelector('form .headline');
let textArea = document.querySelector('form .textcontent');
let container = document.querySelector('.todo_container');
let wrapperError = document.querySelector('.wrapper__error')
let searchInput = document.querySelector('.search');
let buttonDeleteAllTasks = document.querySelector('.button__delete');
let buttonChangeTheme = document.querySelector('.change-theme');
// Все переменные, которые нам пригодятся.

//Класс для одно элемента туду элемента
class ElementToDo {
  constructor({name, headLine, content, number, status, date}) {
    //Начала инциализации объекта
    this.name = name;
    this.headLine = headLine;
    this.content = content.replace(/(<([^>]+)>)/ig, "");
    this.number = number;
    this.status = status || 'wait';
    this.buttonSuccess = null;
    this.buttonNotDone = null;
    this.buttonDanger = null;
    this.buttonEdit = null;
    this.buttonSaveModal = null;
    this.wrapperContent = null;
    this.textAreaModal = null;
    this.wrapper = null;
    let _date = new Date();
    this.date = date || this.formatDate(_date);
    this.init(); //Вызывается функция, который инициализирует объекта
    //Конец инциализации объекта
  }
  formatDate(date) {
    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
  }
  //События удаление задания
  eventDelete() {
    this.thisItem.remove();
    localStorage.removeItem(this.name); //Удаляем с localstorage
  }
  //Событие выполнение задания
  eventSuccess() {
    this.wrapper.classList.remove('border-red');
    this.wrapper.classList.add('border-green');
    this.status = 'done';
    this.save();
  }
  //Событие невыполнение задания
  eventNotDone() {
    this.wrapper.classList.remove('border-green');
    this.wrapper.classList.add('border-red');
    this.status = 'notDone';
    this.save();
  }
  //Функция, которая возвращает данные об объекте
  get() {
    return {
      name: this.name,
      headLine: this.headLine,
      content: this.content,
      number: this.number,
      status: this.status,
      date: this.date,
    }
  }
  //Функция, которая генерирует шаблон для будущего объекта
  getTemplate(settings) {
    let classStatus = '';
    if (settings.status == 'done') {
      classStatus = 'border-green';
    } else if (settings.status == "notDone") {
      classStatus = 'border-red';
    }
    return  `
    <section>
      <div class="dropdown">
            <a class="btn btn-primary btn-sm" id="dropdownMenu${settings.number}" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false"><i class="fa fa-bars" aria-hidden="true"></i></a>
          
            <div class="dropdown-menu dropdown-primary">
              <a  class="btn btn-success dropdown-item btn-sm">Выполнено</a>
              <a  class="btn btn-info dropdown-item btn-sm" data-toggle="modal" data-target="#basicExampleModal${settings.number}">Редактировать</a>
              <a  class="btn btn-danger dropdown-item btn-sm">Невыполнено</a>
              <a  class="btn delete dropdown-item btn-sm ">Удалить</a>
            </div>
        </div>
      <section class="wrapper ${classStatus} block-example border border-info">
        <h4 class="zag">${settings.headLine}</h4>
        <pre class="text-justify content">${settings.content}</pre>
        <i class="date__create" >${settings.date}</i>
      </section>

      <!-- Central Modal Small -->
    <div class="modal fade" id="basicExampleModal${settings.number}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">

        <!-- Change class .modal-sm to change the size of the modal -->
        <div class="modal-dialog modal-lg" role="document">


          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title w-100" id="myModalLabel">${settings.headLine}</h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="md-form">
                <i class="fa fa-pencil prefix"></i>
                <textarea type="text" id="form10" class="md-textarea form-control" rows="3" required>${settings.content}</textarea>
                <div class="errors">
                
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Закрыть</button>
              <button type="button" class="btn btn-primary btn-sm save">Сохранить</button>
            </div>
          </div>
        </div>
      </div>
      <!-- Central Modal Small -->
      </section>
  `
  }
  //Сохранение в localstorage
  save() {
    let values = this.get();
    localStorage.setItem(this.name, JSON.stringify(values));
    localStorage.setItem('lastkey', this.number);
  }
  saveModal(errors) {
    if (this.textAreaModal.value != '') {
      $('#basicExampleModal' + this.number).modal('hide'); //mdboostrap hide modal
      this.content = this.textAreaModal.value;
      this.wrapperContent.textContent = this.content;
      this.save();
    } else {
      errors.textContent = "Поле не должно быть пустое!";
    }
  }
  //Инициализия всех элементов объекта(кнопок)
  initElements(li) {
    let errorsModal = li.querySelector('.modal .errors');
    this.buttonSuccess = li.querySelector('.btn-success');
    this.buttonDanger = li.querySelector('.delete');
    this.buttonNotDone = li.querySelector('.btn-danger')
    this.buttonSaveModal = li.querySelector('.modal .save');
    this.textAreaModal = li.querySelector('.modal textarea');
    this.buttonSuccess.addEventListener('click', this.eventSuccess.bind(this));
    this.buttonDanger.addEventListener('click', this.eventDelete.bind(this));
    this.buttonNotDone.addEventListener('click', this.eventNotDone.bind(this));
    container.appendChild(li);
    this.thisItem = container.querySelector('.' + this.name);
    this.wrapperContent = this.thisItem.querySelector('.content');
    this.buttonSaveModal.addEventListener('click', this.saveModal.bind(this, errorsModal));
    this.wrapper = this.thisItem.querySelector('.wrapper');
    wrapperError.textContent = '';
  }
  //Функция инициализации
  init() {
    if (this.headLine != '' && this.content != '') {
      let template = this.getTemplate({
        headLine: this.headLine,
        content: this.content,
        number: this.number,
        status: this.status,
        date: this.date,
      });
      let li = document.createElement('li');
      li.classList.add(this.name);
      li.id = 'number__' + this.number;
      li.innerHTML = template;
      form.reset();
      this.initElements(li);
      this.save();

    } else {
      wrapperError.textContent = "Поля не должны быть пустыми!"
    }
  }
}
//Функция, которая проверяет, есть ли элемент в localstorage
function checkLocalStorage() {
  let maxValueKey = JSON.parse(localStorage.getItem('lastkey'));
  for (let i = 1; i <= maxValueKey; i++) {
    let returnToDo = JSON.parse(localStorage.getItem("element_" + i));
    let {
      name,
      headLine,
      content,
      number,
      status,
      date
    } = returnToDo;
    if (returnToDo == undefined) continue;
    let newElement = new ElementToDo({
      name: name,
      headLine: headLine,
      content: content,
      number: number,
      status: status,
      date: date,
    })
    allElements.push(newElement);
  }
}


searchInput.addEventListener('input', () => {
  allElements.forEach((element) => {
    if (element.content.toLowerCase().indexOf(searchInput.value.toLowerCase()) == -1) {
      let elementTask = container.querySelector("." + element.name);
      elementTask.hidden = true;
    } else {
      let elementTask = container.querySelector("." + element.name);
      elementTask.hidden = false;
    }
  });
});

buttonDeleteAllTasks.addEventListener('click', () => {
  localStorage.clear();
  if (body.classList.contains('dark-theme')) {
    localStorage.setItem('theme', 'dark')
  } else if (body.classList.contains('light')) {
    localStorage.setItem('theme', 'light');
  }
  let elems = container.querySelectorAll('li');
  Array.from(elems).forEach(elem => elem.remove());
});

buttonCreate.addEventListener('click', () => {
  let _name = "element_" + (container.children.length + 1);
  let newElement = new ElementToDo({
    name: _name,
    headLine: head.value,
    content: textArea.value,
    number: container.children.length + 1
  })
  allElements.push(newElement);
})
buttonChangeTheme.addEventListener('click', (e) => {
  e.preventDefault();
  changeTheme();
})
changeTheme = () => {
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme-with-tranzition', 'dark-theme');
    body.classList.add('light')
    localStorage.setItem('theme', 'light')
  } else {
    body.classList.add('dark-theme', 'dark-theme-with-tranzition');
    body.classList.remove('light');
    localStorage.setItem('theme', 'dark')
  }
}
theme = () => {
  let theme = localStorage.getItem('theme');
  if (theme == 'dark') {
    body.classList.add('dark-theme');
  } else {
    body.classList.add('light');
  }
}
window.addEventListener('load', () => {
  theme();
  checkLocalStorage();
})
//--------------------------------------------------------DRAG&DROP------------------------------------------
// container.addEventListener('dragstart', e => {
//   const target = e.target;
//   e.dataTransfer.setData('html', target.outerHTML);
//   target.parentElement.classList.add('hidden');
// });
// container.addEventListener('dragenter', e => {
//   const target = e.target.parentElement.parentElement;
//   const elem = document.createElement('li');
//   elem.className = "drag placheholder";
//   if(target.matches('li')) {
//     const placeholders = document.querySelectorAll('.placheholder');
//     Array.from(placeholders).forEach(elem => container.removeChild(elem));
//     target.parentElement.insertBefore(elem, target);
//   }
//   else {
//     return;
//   }

// });
// container.addEventListener('dragover', e=> {
//   e.preventDefault();
// });
// container.addEventListener('dragend', e=> {
//   const hiddens = document.querySelector('.hidden');
//   const placheholder = document.querySelector('.placheholder');
//   hiddens.classList.remove('hidden');
//   if(placheholder != null) {
//     container.removeChild(placheholder); 
//   }
// });
// container.addEventListener('drop', e => {
//   const hiddens = document.querySelector('.hidden');
//   const placheholder = document.querySelector('.placheholder');
//   const elem =  e.dataTransfer.getData('html');
//   placheholder.innerHTML = elem;
//   container.removeChild(hiddens);
//   placheholder.classList.remove('placheholder');
// }); 
//--------------------------------------------------------DRAG&DROP------------------------------------------