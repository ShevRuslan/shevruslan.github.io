var fieldResult = document.querySelector('.result span'),
pre1 = document.querySelector('.pre1'),
arr_to_send = [], // Массив, который будет содержать состояния элементов калькулятора
itemArr = [       // Массив с описанием опций элементов калькулятора
  {
    name:   'span_1',
    amount: 5,
    rate:   1
  },
  {
    name:   'span_2',
    amount: 4,
    rate:   2
  },
  {
    name:   'span_3',
    amount: 3,
    rate:   3
  },
  {
    name:   'span_4',
    amount: 2,
    rate:   4
  },
  {
    name:   'span_5',
    amount: 1,
    rate:   5
  }
];

let oneItem = {
    name:   'span_1',
    amount: 5,
    rate:   1
}

class CalculatorItem {
  constructor(settings) {
    this.name = settings.name;
    this.count = settings.amount || 0;
    this.rate = settings.rate || 1;
    this.callback = settings.callback;
    this.value = {
      _value: this.count  || 0,//кол-во
      cost: this.count * this.rate,//сумма
      get getValue() {
        return this._value;
      },
      set setValue(newValue) {
        this._value = newValue;
        this.cost = newValue * this.rate;
      }
    }
    this.item = document.querySelector('.' + this.name);
    this.minusButton = this.item.querySelector('.minus');
    this.plusButton = this.item.querySelector('.plus');
    this.valueField = this.item.querySelector('.value');
    this.rateField = this.item.querySelector('.rate span');
    this.sumField = this.item.querySelector('.sum span');
    this.init();
  }
  get() {
    return {
      itemName: this.name,
      value: this.value.getValue,
      cost: this.value.cost
    }
  }
  set(newValue) {
    if(newValue >= 0) {
      this.value.setValue = newValue;
      this.value.cost = newValue * this.rate;
      this.callback(this.get());
    }
  }
  eventPlus() {
    this.set(this.value.getValue + 1);
    this.updateSumField();
    this.updateValueField();
  }
  eventMinus() {
    this.set(this.value.getValue - 1);
    this.updateSumField();
    this.updateValueField();
  }
  updateValueField() {
    this.valueField.textContent = this.value.getValue;
  }
  updateSumField() {
    this.sumField.textContent = this.value.cost;
    this.rateField.textContent = this.rate;
  }
  init() {
    this.updateSumField();
    this.updateValueField();
    this.minusButton.addEventListener('click',this.eventMinus.bind(this));
    this.plusButton.addEventListener('click',this.eventPlus.bind(this));
  }
}
class Calculator {
  constructor(items, functionCallback){
    this.elements = [];
    this._items = items;
    this.functionCall = functionCallback;
    var self = this;
    let callback = this.update;
    items.forEach(function(val,index){
      var newCalc = new CalculatorItem({
        name: val.name,
        count: val.amount,
        rate: val.rate,
        callback: callback
      });
      self.elements.push(newCalc);
    }); 

    this.init();
  }
  get() {
    var _elements = [];
    this.elements.forEach(function(val, index) {
      _elements.push(val.get());
    }); 
    return _elements;
  }
  update(oneField) {
    handlerCalculator(this.get());
  }
  init() {
    this.update();
  }
}
function handlerCalculator(results) {
  var obrArray = [];
  if(arr_to_send.length == 0) {
    results.forEach(function(val,index) {
      arr_to_send.push(val);
    }); 
  }
  else {
    arr_to_send.forEach(function(val,index){
      if(val.itemName == results.itemName) {
        arr_to_send[index] = results
      }
    })
  }
  obrArray = arr_to_send.filter(function(item) { // Фильтрация состояний
    if(item.value > 0) {  // для отсеивания элементов с нулевым количеством
      return item;
    }
  });
  // console.table(arr_to_send); // Отображение в консоли отфильтрованных результатов
  // Передача результатов в функцию отображения
  console.log(obrArray)
  showResult(obrArray);
}
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
// Функция отображения результатов
function showResult(result) {
  pre1.textContent = JSON.stringify(result, ' ', 2);  // Сериализовать массив результатов для тестового вывода на страницу
  fieldResult.textContent = result.reduce(function(sum, current) {  // Посчитать сумму стоимости всех элементов из результата
    return sum + current.cost;
  }, 0);  // 0 - это начальное значение, к которому будет суммироваться стоимость
}

var calc = new Calculator(itemArr, handlerCalculator);