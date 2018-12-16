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
              <a  class="btn btn-danger dropdown-item btn-sm">Невыполнено</a>
              <a  class="btn delete dropdown-item btn-sm ">Удалить</a>
            </div>
        </div>
      <section class="wrapper ${classStatus} block-example border border-info">
        <h4 class="zag">${settings.headLine}</h4>
        <p class="text-justify">${settings.content}</p>
      </section>`
  return template;
  }
  //сохрание в localstorage
  save() {
    let values = this.get();
    localStorage.setItem(this.name,JSON.stringify(values));
  }
  //инициализия всех элементов объекта(кнопок)
  initElements(li) {
    this.buttonSuccess = li.querySelector('.btn-success');
    this.buttonDanger = li.querySelector('.delete');
    this.buttonNotDone = li.querySelector('.btn-danger')
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

























// "use strict";
// var fieldResult = document.querySelector('.result span'),
// pre1 = document.querySelector('.pre1'),
// arr_to_send = [], // Массив, который будет содержать состояния элементов калькулятора
// itemArr = [       // Массив с описанием опций элементов калькулятора
//   {
//     name:   'span_1',
//     amount: 5,
//     rate:   1
//   },
//   {
//     name:   'span_2',
//     amount: 4,
//     rate:   2
//   },
//   {
//     name:   'span_3',
//     amount: 3,
//     rate:   3
//   },
//   {
//     name:   'span_4',
//     amount: 2,
//     rate:   4
//   },
//   {
//     name:   'span_5',
//     amount: 1,
//     rate:   5
//   }
// ];

// // Класс одного элемента калькулятора
// function CalculatorItem(settings) {
//   var that = this,  // Сохранение контекста класса
//   itemName = settings.selector, // Класс блока с элементом калькулятора
//   thisItem = document.querySelector('.' + itemName),  // Блок, в котором находится элемент калькулятора
//   minus = thisItem.querySelector('.minus'), // Кнопка "Минус"
//   valueField = thisItem.querySelector('.value'),  // Поле с количеством
//   plus = thisItem.querySelector('.plus'), // Кнопка "Плюс"
//   fieldRate = thisItem.querySelector('.rate span'), // Блок вывода "Цена за штуку"
//   fieldSum = thisItem.querySelector('.sum span'), // Блок вывода "Сумма" одного элемента
//   rate = settings.rate || 1,  // Цена за штуку
//   setCallback = settings.setCallback, // Функция, вызываемая при изменении количества
//   value = { // Объект, содержащий количество и стоимость
//     _value: settings.currentValue || 0,
//     cost:   settings.currentValue * rate || 0,
//     get value() { // Запускается при получении значения value.value
//       return this._value;
//     },
//     set value(param) {  // Запускается при присваивании нвого значения в value.value
//       this._value = param;  // Устанавливает количество
//       this.cost = this._value * rate; // И сразу же рассчитывает стоимость
//     }
//   };
//   // Публичный метод получения состояния элемента калькулятора
//   this.get = function() {
//     return {  // Возвращает объект с именем элемента калькулятора, количеством и стоимостью
//       item: itemName,
//       value: value.value,
//       cost: value.cost
//     };
//   };
//   // Публичный метод установки количества в элемент калькулятора
//   this.set = function(param) {
//     if(param >= 0) {  // Нельзя установить отрицательное количество
//       value.value = param;  // Установка количества
//       setCallback(that.get());  // Вызов коллбека с передачей состояния элемента
//       return true;
//     } else {
//       return false;
//     }
//   };
//   // Функция обновления поля с количеством
//   var updateValueField = function() {
//     valueField.textContent = value.value;
//   };
//   // Функция обновления блока с информацией о стоимости
//   var updateInfoField = function() {
//     try{
//       fieldRate.textContent = rate;
//       fieldSum.textContent = value.cost;
//     } 
//     catch(err) {

//     }
//   }
//   // Обработчик кнопки "Минус"
//   var minusFun = function() {
//     that.set(value.value - 1);
//     updateValueField();
//     updateInfoField();
//   };
//   // Обработчик кнопки "Плюс"
//   var plusFun = function() {
//     that.set(value.value + 1);
//     updateValueField();
//     updateInfoField();
//   };
//   // Обработчик ручного ввода значения в поле
//   var changeFun = function(e) {
//     // !that.set(+e.target.textContent) ? updateValue Field() : null;
//     that.set(+e.target.textContent);
//     updateInfoField();
//   }
//   // Функция начальной инициализации блока с элементом калькулятора
//   var run = function() {
//     updateValueField();
//     updateInfoField();
//     minus.addEventListener('click', minusFun);
//     plus.addEventListener('click', plusFun);
//     valueField.addEventListener('input', changeFun);
//   }
//   // Запуск инициализации
//   run();  
// }

// // Класс калькулятора, состоящего из нескольких элементов
// function Calculator(itemArr, callback) {
//   var calculatorItemsArr = [],  // Объявление массива, хранящего экзкмпляры элементов калькулятора
//   that = this;  //Сохранение контекста класса
//   itemArr.forEach(function(val, index) {  // Цикл по массиву с описанием опций элементов калькулятора
//     var newCalc = new CalculatorItem({ // Создание экзкмпляра элемента калькулятора
//       selector: val.name,
//       setCallback: updateSum,
//       currentValue: val.amount,
//       rate: val.rate
//     });
//     calculatorItemsArr.push(newCalc); // Добавление в массив созданного экземпляра
//   });
//   // Публичный метод получения массива состояний всех элементов калькулятора
//   this.get = function() {
//     var valuesArr = [];
//     calculatorItemsArr.forEach(function(val) {  // Цикл по всем экземплярам
//       valuesArr.push(val.get());  // Получение состояния из каждого экзкмпляра
//     });
//     return valuesArr;
//   }
//   // Функция, которая отдается в качестве коллбека в каждый элемент калькулятора
//   function updateSum(fieldState) {  // В аргументе приходит состояние конкретного изменившегося элемента
//     callback(that.get()); // При срабатывании из любого элемента, собирает состояние всех элементов
//   }
//   // Функция инициализации
//   function run() {
//     updateSum();
//   }
//   // Запуск инициализации
//   run();
// }

// // Функция, которая отдается в качестве коллбека в Калькулятор,
// // получает в аргументе массив с состоянием всех элементов калькулятора
// // при изменении любого элемента
// function handlerCalculator(results) {
//   arr_to_send = results.filter(function(item) { // Фильтрация состояний
//     if(item.value > 0) {  // для отсеивания элементов с нулевым количеством
//       return item;
//     }
//   });
//   console.table(arr_to_send); // Отображение в консоли отфильтрованных результатов
//   // Передача результатов в функцию отображения
//   showResult(arr_to_send);
// }
// // Функция отображения результатов
// function showResult(result) {
//   pre1.textContent = JSON.stringify(result, ' ', 2);  // Сериализовать массив результатов для тестового вывода на страницу
//   fieldResult.textContent = result.reduce(function(sum, current) {  // Посчитать сумму стоимости всех элементов из результата
//     return sum + current.cost;
//   }, 0);  // 0 - это начальное значение, к которому будет суммироваться стоимость
// }

// // Создание экземпляря калькулятора, и автоматическая его инициализация
// // Принимает массив настроек элементов калькулятора и коллбек, который 
// // вызывается при изменении состояния любого элемента и получает в
// // аргументе состояние всех элементов
// var calculator = new Calculator(itemArr, handlerCalculator);




// // var animal = {
// //   eats: true
// // };
// // function Rabbit(name) {
// //   this.name = name;
// //   // this.__proto__ = animal;//прототип
// // }
// // Rabbit.prototype = animal;//тоже прототип, но так лучше, ибо кроссбраузерность.
// // var rabbit = new Rabbit("Кроль");

// // alert( rabbit.eats ); // true, из прототипа

// //-------------------FUNCTIONAL OOP---------------------------------------------//
// function Machine(power) {
//   this._power = power;
//   this._enabled = false;

//   this.enable = function() {
//     this._enabled = true;
//   };

//   this.disable = function() {
//     this._enabled = false;
//   };
//   this.getStatus = function () {
//     return this._enabled;
//   }
// }
// // Fridge может добавить и свои аргументы,
// // которые в Machine не будут использованы
// function Fridge(power, temperature) {
//   Machine.apply(this, arguments);

//   // ...
// }
// function CoffeeMachine(power, capacity) {
  
//   Machine.call(this); // отнаследовать
//   Machine.apply(this, arguments);
//   var waterAmount = 0; // количество воды в кофеварке
//   var WATER_HEAT_CAPACITY = 4200;
//   var self = this;
//   var timerID = null;
//   var isRun = false;
//   //перезаписвания свойства родителя
//   var parentEnable = this.enable;
//   this.enable = function() {
//     parentEnable.call(this);
//     this.run();
//   }
//   this.waterAmount = function(amount) {
//     // вызов без параметра, значит режим геттера, возвращаем свойство
//     if (!arguments.length) return waterAmount;
//     // иначе режим сеттера
//     if (amount < 0) {
//       throw new Error("Значение должно быть положительным");
//     }
//     if (amount > capacity) {
//       throw new Error("Нельзя залить воды больше, чем " + capacity);
//     }
//     waterAmount = amount;
//   };
//   this.getPower = function() {
//     return power;
//   }
//   // расчёт времени для кипячения PRIVATE
//   // var getBoilTime = function () {
//   //   return this.waterAmount * WATER_HEAT_CAPACITY * 80 / power;
//   // }.bind(this)
//   function getBoilTime () {
//     return self.waterAmount * WATER_HEAT_CAPACITY * 80 / power;
//   }
//   // что делать по окончании процесса PRIVATE
//   function onReady() {
//     alert( 'Кофе готов!' );
//   }
//   //PUBLIC
//   this.run = function() {
//     // setTimeout - встроенная функция,
//     // она запустит onReady через getBoilTime() миллисекунд
//     timerID = setTimeout(function() {
//       onReady();
//     }, getBoilTime());
//     isRun = true;
//   };
//   //PUBLIC
//   this.stop = function() {
//     clearTimeout(timerID);
//     isRun = false;
//   }
//   this.addWater = function(amount) {
//     this.waterAmount(waterAmount + amount);
//   };
//   this.setOnReady = function(newOnReady) {
//     onReady = newOnReady;
//   };
//   this.isRunning = function() {
//     return isRun;
//   }
// }

// // создать кофеварку
// var coffeeMachine = new CoffeeMachine(100000, 200);
// coffeeMachine.enable()
// coffeeMachine.waterAmount(100);
// coffeeMachine.disable();
// console.log(coffeeMachine.getStatus())
// console.log(coffeeMachine.enable());
// coffeeMachine.setOnReady(function() {
//   var amount = coffeeMachine.waterAmount();
//   alert( 'Готов кофе: ' + amount + 'мл' ); // Готов кофе: 150 мл
// });
// coffeeMachine.run();
// coffeeMachine.stop();
// console.log(coffeeMachine.power)//приватное свойство
// -------------------FUNCTIONAL OOP---------------------------------------------//








// function applyAll(func) {
//   return func.apply(this,[].slice.call(arguments, 1));
// }
// console.log(applyAll(Math.min, 1, 3));

// function sum() {
//   var returnArray = [].reduce.call(arguments, function(a, b) {
//     return a + b;
//   });
//   return returnArray;
// }
// console.log(sum(1,3,4))



// Object.defineProperty(person, 'age', {
//   get: function() { return age; },
//   set: function(newValue) { if(isNaN(newValue) == false) age = newValue},
//   enumerable: true,
//   configurable: true
// });
// console.log(person.Age)
// person.Age = "sasda";
// console.log(person.Age)
//----------------------GET AND SET------------------//
  // function User(fullName) {
  //   this.fullName = fullName;

  //   Object.defineProperties(this, {
  //     firstname: {
  //       get: function() {
  //         return this.fullName.split(" ")[0];
  //       },
  //       set: function(newFirstName) {
  //         this.fullName = newFirstName + " " + this.lastname
  //       },
  //       enumerable: true
  //     },
  //     lastname: {
  //       get: function() {
  //         return this.fullName.split(" ")[1];
  //       },
  //       set: function(newLastName) {
  //         this.fullName = this.firstname + " " + newLastName
  //       },
  //       enumerable: true
  //     }
  //   });
  // }
  // var vasya = new User("Василий Попкин");
  // // чтение firstName/lastName
  // alert( vasya.firstname ); // Василий
  // alert( vasya.lastname ); // Попкин

  // // запись в lastName
  // vasya.lastname = 'Сидоров';
  // vasya.firstname = "Ruslan"
  // alert( vasya.fullName ); // Василий Сидоров
  // for(var key in vasya) {
  //   console.log(key);
  // }
//----------------------GET AND SET------------------//
//-------------------------SIMPLE CALCULATOR---------------------//
  // function Calculator() {
  //   var allMethods = {
  //     "+": function(a, b) {
  //       return +a + +b;
  //     },
  //     "-": function(a, b) {
  //       return a - b;
  //     }
  //   };

  //   this.calculate = function(str) {
  //     var array = str.split(' '),
  //     a = array[0],
  //     b = array[2],
  //     method = array[1];
      
  //     return allMethods[method](a, b);
  //   }
  //   this.addFunction = function(name, func) {
  //     allMethods[name] = func;
  //   }
  // }

  // var powerCalc = new Calculator;
  // powerCalc.addFunction("*", function(a, b) {
  //   return a * b;
  // });
  // powerCalc.addFunction("/", function(a, b) {
  //   return a / b;
  // });
  // powerCalc.addFunction("**", function(a, b) {
  //   return Math.pow(a, b);
  // });

  // var result = powerCalc.calculate("2 ** 3");
  // console.log( result ); // 8
//-------------------------SIMPLE CALCULATOR---------------------//  

  // var user = {
  //   name: "Вася",
  //   age: 30,
  //   size: {
  //     width: 15,
  //     height: 10
  //   }
  // };
  
  // var clone = {}; // новый пустой объект
  
  // // скопируем в него все свойства user
  // for (var key in user) {
  //   clone[key] = user[key];
  // }
  
  // // теперь clone - полностью независимая копия
  // clone.name = "Петя"; // поменяли данные в clone
  // clone.age = 25;
  // console.table([user, clone]);




  // function sum(elements) {
  //   var max = 0;
  //   var name = '';
  //   for(var item in elements) {
  //      if(max < elements[item]){
  //        max = elements[item];
  //        name = item;
  //      }
  //   }
  //   return name;
  // }

  // items.forEach(function(item, i) {
  //   item['a']++;
  //   // item.a++;
  // })
  // for(item in elements) {
  //   console.log(item + " => " + elements[item]);
  // }
  // var items = [
  //   {
  //     a: 5,
  //     b : 1,
  //     size : {
  //       width: 5,
  //       height: 10
  //     }
  //   },
  //   {
  //     a: 6,
  //     b : 7
  //   }
  // ]
  // var elements = {
  //   size: "500px",
  //   width: "100px",
  //   height: "200px"
  // }

  // console.log(items[0]);
  // /**
  //  * @param  {} value
  //  * function return true if value contains "xxx" or "viagra" else return false
  //  */
  // function checkSpam(value) {
  //   if(!value) return false;
  //   return (value.toLowerCase().indexOf("viagra") != -1 || value.toLowerCase().indexOf("xxx") != -1) ? true : false;
  // }
  // function truncate(value, maxlenght) {
  //   if(value.length  > maxlenght) {
  //     var newValue = value.slice(0, maxlenght - 3) + '...';
  //   }
  //   else {
  //     return "Ваша строка меньше числа.";
  //   }
  //   return newValue;
  // }
  // function extract(value) {
  //   return value.slice(1);
  // }





  //---------------ПРОСТЫЕ ЧИСЛА----------------------------
  // var number = prompt("Введите число");
  // if(isNaN(parseFloat(number))) {
  //   alert("Вы ввели не цифру!");
  // }
  // else if (number == null) {
  //   alert("Вы нажали отмена.")
  // }
  // else if(parseFloat(number) != NaN && number != null) {
  //   numberNext:
  //   for(var i = 2; i <= parseFloat(number); i++) {
  //     for(var j = 2; j < i; j++) {
  //       if(i % j == 0) continue numberNext;
  //     }
  //     alert(i);
  //   }
  // }
  //---------------ПРОСТЫЕ ЧИСЛА----------------------------




//-------------------------------------SPAN CALCULATOR------------------------------------------------------
// window.onload = function(e) {

//   var fieldResult = document.querySelector('.result span'),
//   pre1 = document.querySelector('.pre1'),
//   arr_to_send = [], // Массив, который будет содержать состояния элементов калькулятора
//   itemArr = [       // Массив с описанием опций элементов калькулятора
//   {
//     name:   'span_1',
//     amount: 5,
//     rate:   1
//   },
//   {
//     name:   'span_2',
//     // amount: 4,
//     rate:   2
//   },
//   {
//     name:   'span_3',
//     // amount: 3,
//     rate:   3
//   },
//   {
//     name:   'span_4',
//     // amount: 2,
//     rate:   4
//   },
//   {
//     name:   'span_5',
//     // amount: 1,
//     rate:   5
//   }
// ];

// // Класс одного элемента калькулятора
// function CalculatorItem(settings) {
//   var that = this,  // Сохранение контекста класса
//   itemName = settings.selector, // Класс блока с элементом калькулятора
//   thisItem = document.querySelector('.' + itemName),  // Блок, в котором находится элемент калькулятора
//   minus = thisItem.querySelector('.minus'), // Кнопка "Минус"
//   valueField = thisItem.querySelector('.value'),  // Поле с количеством
//   plus = thisItem.querySelector('.plus'), // Кнопка "Плюс"
//   fieldRate = thisItem.querySelector('.rate span'), // Блок вывода "Цена за штуку"
//   fieldSum = thisItem.querySelector('.sum span'), // Блок вывода "Сумма" одного элемента
//   rate = settings.rate || 1,  // Цена за штуку
//   setCallback = settings.setCallback, // Функция, вызываемая при изменении количества
//   value = { // Объект, содержащий количество и стоимость
//     _value: settings.currentValue || 0,
//     cost:   settings.currentValue * rate || 0,
//     get value() { // Запускается при получении значения value.value
//       return this._value;
//     },
//     set value(param) {  // Запускается при присваивании нвого значения в value.value
//       this._value = param;  // Устанавливает количество
//       this.cost = this._value * rate; // И сразу же рассчитывает стоимость
//     }
//   };
//   // Публичный метод получения состояния элемента калькулятора
//   this.get = function() {
//     return {  // Возвращает объект с именем элемента калькулятора, количеством и стоимостью
//       item: itemName,
//       value: value.value,
//       cost: value.cost
//     };
//   };
//   // Публичный метод установки количества в элемент калькулятора
//   this.set = function(param) {
//     if(param >= 0) {  // Нельзя установить отрицательное количество
//       value.value = param;  // Установка количества
//       setCallback(that.get());  // Вызов коллбека с передачей состояния элемента
//       return true;
//     } else {
//       return false;
//     }
//   };
//   // Функция обновления поля с количеством
//   var updateValueField = function() {
//     valueField.textContent = value.value;
//   };
//   // Функция обновления блока с информацией о стоимости
//   var updateInfoField = function() {
//     try{
//       fieldRate.textContent = rate;
//       fieldSum.textContent = value.cost;
//     } catch(err) {
//     }
//   }
//   // Обработчик кнопки "Минус"
//   var minusFun = function() {
//     that.set(value.value - 1);
//     updateValueField();
//     updateInfoField();
//   };
//   // Обработчик кнопки "Плюс"
//   var plusFun = function() {
//     that.set(value.value + 1);
//     updateValueField();
//     updateInfoField();
//   };
//   // Обработчик ручного ввода значения в поле
//   var changeFun = function(e) {
//     // !that.set(+e.target.textContent) ? updateValueField() : null;
//     that.set(+e.target.textContent);
//     updateInfoField();
//   }
//   // Функция начальной инициализации блока с элементом калькулятора
//   var run = function() {
//     updateValueField();
//     updateInfoField();
//     minus.addEventListener('click', minusFun);
//     plus.addEventListener('click', plusFun);
//     valueField.addEventListener('input', changeFun);
//   }
//   // Запуск инициализации
//   run();  
// }

// // Класс калькулятора, состоящего из нескольких элементов
// function Calculator(itemArr, callback) {
//   var calculatorItemsArr = [],  // Объявление массива, хранящего экзкмпляры элементов калькулятора
//   that = this;  //Сохранение контекста класса
//    .forEach(function(val, index) {  // Цикл по массиву с описанием опций элементов калькулятора
//     var newCalc = new CalculatorItem({ // Создание экзкмпляра элемента калькулятора
//       selector: val.name,
//       setCallback: updateSum,
//       currentValue: val.amount,
//       rate: val.rate
//     });
//     calculatorItemsArr.push(newCalc); // Добавление в массив созданного экземпляра
//   });
//   // Публичный метод получения массива состояний всех элементов калькулятора
//   this.get = function() {
//     var valuesArr = [];
//     calculatorItemsArr.forEach(function(val) {  // Цикл по всем экземплярам
//       valuesArr.push(val.get());  // Получение состояния из каждого экзкмпляра
//     });
//     return valuesArr;
//   }
//   // Функция, которая отдается в качестве коллбека в каждый элемент калькулятора
//   function updateSum(fieldState) {  // В аргументе приходит состояние конкретного изменившегося элемента
//     callback(that.get()); // При срабатывании из любого элемента, собирает состояние всех элементов
//   }
//   // Функция инициализации
//   function run() {
//     updateSum();
//   }
//   // Запуск инициализации
//   run();
// }

// // Функция, которая отдается в качестве коллбека в Калькулятор,
// // получает в аргументе массив с состоянием всех элементов калькулятора
// // при изменении любого элемента
// function handlerCalculator(results) {
//   arr_to_send = results.filter(function(item) { // Фильтрация состояний
//     if(item.value > 0) {  // для отсеивания элементов с нулевым количеством
//       return item;
//     }
//   });
//   console.table(arr_to_send); // Отображение в консоли отфильтрованных результатов
//   // Передача результатов в функцию отображения
//   showResult(arr_to_send);
// }
// // Функция отображения результатов
// function showResult(result) {
//   pre1.textContent = JSON.stringify(result, ' ', 2);  // Сериализовать массив результатов для тестового вывода на страницу
//   fieldResult.textContent = result.reduce(function(sum, current) {  // Посчитать сумму стоимости всех элементов из результата
//     return sum + current.cost;
//   }, 0);  // 0 - это начальное значение, к которому будет суммироваться стоимость
// }

// // Создание экземпляря калькулятора, и автоматическая его инициализация
// // Принимает массив настроек элементов калькулятора и коллбек, который 
// // вызывается при изменении состояния любого элемента и получает в
// // аргументе состояние всех элементов
// var calculator = new Calculator(itemArr, handlerCalculator);
//-------------------------------------SPAN CALCULATOR------------------------------------------------------










  //----------------------------------------------------------------------------
  // var person = {
  //   age: 15,
  //   name: 'Ruslan',
  //   sayAge: function() {
  //     alert(this.name + this.age);
  //   }
  // }
  // person.sayAge();


  //--------------CALCULATOR-------------------
  // var numberInputs = document.querySelectorAll('.buttons .number'),
  // signInputs = document.querySelectorAll('.buttons .sign'),
  // span = document.querySelector('.inputs #answer'), 
  // bufer = document.querySelector('.inputs #prev');
  // value = 0, 
  // digit = {};
  // span.oninput = function() {
  //   signInputsDisabled(false);
  // }
  // for(var i = 0; i < numberInputs.length; i++) {
  //   numberInputs[i].onclick = function() {
  //     span.value += this.textContent;
  //     signInputsDisabled(false);
  //   }
  // }

  // for(var j = 0; j < signInputs.length; j++) {
  //   signInputs[j].onclick = function() {
  //     console.log(digit);
  //     if(this.textContent != '=') {
  //         if(value == 0 && this.textContent != 'C') {
  //           digit.last = +span.value;
  //           value = +span.value;
  //           digit.sign = this.textContent;
  //           span.value = ' ';
  //           bufer.textContent += value + ' ' + digit.sign;
  //         }
  //         else if(value != 0 && digit.sign != null && this.textContent != 'C') {
  //           digit.last = +span.value;
  //           action(digit.sign);
  //           digit.sign = this.textContent;
  //           bufer.textContent += digit.last + ' ' + digit.sign + ' ';
  //           span.value = ' ';
  //         }
  //         else if(this.textContent == 'C') {
  //           delete digit.sign;
  //           span.value = '';
  //           console.log(digit);
  //           value = 0;
  //           bufer.textContent = '';
  //         }
  //     }
  //     else {
  //         digit.last = span.value;
  //         action(digit.sign);
  //         console.log(digit);
  //         span.value = '';
  //         console.log(value);
  //         bufer.textContent += digit.last + ' = ' + value;
  //     }
  //     console.log(value);
  //   }
  // }
  //--------------CALCULATOR-------------------


  // function signInputsDisabled(bool) {
  //     for(var g = 0; g < signInputs.length; g++) {
  //       signInputs[g].disabled = bool;
  //     }
  // }

  // function action(_action) {
  //   if(_action == '+') {
  //             value = parseFloat(value) + parseFloat(span.value);
  //   }
  //   else if(_action == '-'){
  //             value = parseFloat(value) - parseFloat(span.value);
  //   }
  //   else if(_action == '/'){
  //             value = parseFloat(value) / parseFloat(span.value);
  //   }
  //   else if(_action == '*') {
  //             value = parseFloat(value) * parseFloat(span.value);
  //   }
  // }
  //СОРТИРОВКА ПО ВОЗРВАСТАНИЮ
    // var digits = [1,3,20,4,5,10,9];
  // console.log(digits.sort(cleverSort));
  // function cleverSort(value1, value2) {
  //   if(value1 < value2) {
  //     return -1;
  //   }
  //   else if(value1 > value2) { 
  //     return 1;
  //   }
  //   else {
  //     return 0;
  //   }
  // }
  //СОРТИРОВКА ПО ВОЗРВАСТАНИЮ