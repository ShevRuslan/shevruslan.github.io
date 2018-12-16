// Все переменные, которые нам пригодятся.
// let allElements = [];
let form = document.querySelector('.form form');
let buttonCreate = document.querySelector('form .create');
let head = document.querySelector('form .headline');
let textArea = document.querySelector('form .textcontent');
let container = document.querySelector('.todo_container');
let wrapperError = document.querySelector('.wrapper__error')

//класс для одно элемента тудушк
class ElementToDo {
  constructor(settings) {
    //начала инциализации объекта
    this.name = settings.name;
    this.headLine = settings.headLine;
    this.content = settings.content;
    this.number = settings.number;
    this.status = settings.status || 'wait';
    this.buttonSuccess = null;
    this.buttonNotDone = null;
    this.buttonDanger = null;
    this.buttonEdit = null;
    this.buttonSaveModal = null;

    this.textAreaModal = null;
    this.wrapper = null;
    this.init();//вызывается функция, который инициализирует объекта
    //конец инциализации объекта
  }
  //события удаление задания
  eventDelete() {
    this.thisItem.remove();
    localStorage.removeItem(this.name);//Удаляем с localstorage
  }
  //событие выполнение задания
  eventSuccess() {
    this.wrapper.classList.remove('border-red'); 
    this.wrapper.classList.add('border-green');
    this.status = 'done';
    this.save();
  }
  //событие невыполнение задания
  eventNotDone() {
    this.wrapper.classList.remove('border-green');
    this.wrapper.classList.add('border-red');
    this.status = 'notDone';
    this.save();
  }
  //функция, которая возвращает данные об объекте
  get() {
    return {
      name: this.name,
      headLine: this.headLine,
      content: this.content,
      number: this.number,
      status: this.status,
    }
  }
  //функция, которая генерирует шаблон для будущего объекта
  getTemplate(settings) {
    let classStatus = '';
    if(settings.status == 'done') {
      classStatus = 'border-green';
    }
    else if(settings.status == "notDone") {
      classStatus = 'border-red';
    }
    let template = `
      <div class="dropdown">
            <a class="btn btn-primary btn-sm" id="dropdownMenu${settings.number}" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false"><i class="fa fa-bars" aria-hidden="true"></i></a>
          
            <div class="dropdown-menu dropdown-primary">
              <a  class="btn btn-success dropdown-item btn-sm">Выполнено</a>
              <a  class="btn btn-info dropdown-item btn-sm" data-toggle="modal" data-target="#basicExampleModal">Редактировать</a>
              <a  class="btn btn-danger dropdown-item btn-sm">Невыполнено</a>
              <a  class="btn delete dropdown-item btn-sm ">Удалить</a>
            </div>
        </div>
      <section class="wrapper ${classStatus} block-example border border-info">
        <h4 class="zag">${settings.headLine}</h4>
        <p class="text-justify">${settings.content}</p>
      </section>

      <!-- Central Modal Small -->
    <div class="modal fade" id="basicExampleModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">

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
                <textarea type="text" id="form10" class="md-textarea form-control" rows="3" required></textarea>
                <div class="errors">
                
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary btn-sm save">Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <!-- Central Modal Small -->
  `
  return template;
  }
  //сохрание в localstorage
  save() {
    let values = this.get();
    localStorage.setItem(this.name,JSON.stringify(values));
  }
  saveModal(content, errors) {
    if(this.textAreaModal.value != '') {
      $('#basicExampleModal').modal('hide');//mdboostrap hide modal
      this.content = this.textAreaModal.value;
      content.textContent = this.content;
      this.save();
    }
    else {
      errors.textContent = "Поле не должно быть пустое!";
    }
  }
  //инициализия всех элементов объекта(кнопок)
  initElements(li) {
    let wrapperContent = li.querySelector('.wrapper p');
    let errorsModal = li.querySelector('.modal .errors');
    this.buttonSuccess = li.querySelector('.btn-success');
    this.buttonDanger = li.querySelector('.delete');
    this.buttonNotDone = li.querySelector('.btn-danger')
    this.buttonSaveModal = li.querySelector('.modal .save');
    this.textAreaModal = li.querySelector('.modal textarea');
    this.buttonSaveModal.addEventListener('click',this.saveModal.bind(this, wrapperContent, errorsModal));
    this.buttonSuccess.addEventListener('click', this.eventSuccess.bind(this));
    this.buttonDanger.addEventListener('click', this.eventDelete.bind(this));
    this.buttonNotDone.addEventListener('click', this.eventNotDone.bind(this));
    container.appendChild(li);
    this.thisItem = container.querySelector('.' + this.name);
    this.wrapper = this.thisItem.querySelector('.wrapper');
    wrapperError.textContent = '';
  }
  //функция инициализации
  init() {
    if(this.headLine != '' && this.content != '') {
      let template = this.getTemplate({
        headLine: this.headLine,
        content: this.content,
        number: this.number,
        status: this.status,
      });
      let li = document.createElement('li');
      li.classList.add(this.name);
      li.innerHTML = template;
      form.reset();
      this.initElements(li);
      this.save();

    }
    else {
      wrapperError.textContent = "Поля не должны быть пустыми!"
    }
  }
}
//функция, которая проверяет, есть ли элемент в localstorage
function checkLocalStorage() {
  for(let i = 1; i <= localStorage.length; i++) {
    let returnToDo = JSON.parse(localStorage.getItem("element_" + i));
    let newElement = new ElementToDo({
      name: returnToDo.name,
      headLine: returnToDo.headLine,
      content: returnToDo.content,
      number: returnToDo.number,
      status: returnToDo.status,
    })
    // allElements.push(newElement);
  }
}
checkLocalStorage();

buttonCreate.addEventListener('click', function() {
  let _name = "element_" + (container.children.length + 1);
  let newElement = new ElementToDo({
    name: _name,
    headLine: head.value,
    content: textArea.value,
    number: container.children.length + 1
  })
  // allElements.push(newElement);
})
