// Общие переменные
let totalCount = 0
const selectedValuesArr = [];
const groupedSelectElemens = {}

// Открытие сайдбара 
function openSidebar() {
  const sidebar = document.querySelector('.sidebar')
  const basketButton = document.querySelector('.cart-icon')
  const fullItems = document.querySelector('.full-basket')
  const zeroItems = document.querySelector('.zero-basket')
  const closeButton = document.querySelector('.close-button')
  const continueButton = document.querySelector('.zero-item button')
  basketButton.addEventListener('click', () => {
    sidebar.classList.toggle('open')
    if (sidebar.classList.contains('open')) {
      if (Object.keys(groupedSelectElemens).length !== 0) {
        fullItems.style.display = 'block'
        zeroItems.style.display = 'none'
      }
      else {
        fullItems.style.display = 'none'
        zeroItems.style.display = 'block'
      }
    }
  })
  closeButton.addEventListener('click', () => {
    sidebar.classList.toggle('open')
  })
  continueButton.addEventListener('click', () => {
    sidebar.classList.toggle('open')
  })
}


// Select values 
function selectValues() {
  const selects = document.querySelectorAll('.selector')
  const radioButtons = document.querySelectorAll('.radio-button input')
  for (let radioButton of radioButtons) {

    radioButton.addEventListener('click', () => {
      for (let selector of selects) {
        selector.style.display = 'none'
      }
      const label = radioButton.parentElement

      const visibleSelectors = label.querySelectorAll('.selector')
      for (let selector of visibleSelectors) {
        selector.style.display = 'block'
      }


      const selectPairs = [];
      const dropdownGroups = label.querySelectorAll('.selector');
      for (let group of dropdownGroups) {
        const dropdowns = group.querySelectorAll('select');
        const pair = [];
        for (let dropdown of dropdowns) {
          pair.push(dropdown.value);
        }
        selectPairs.push(pair);
      }

      // Добавляем обработчики изменения для select
      for (let i = 0; i < dropdownGroups.length; i++) {
        const dropdowns = dropdownGroups[i].querySelectorAll('select');

        for (let j = 0; j < dropdowns.length; j++) {
          dropdowns[j].addEventListener('change', () => {
            selectPairs[i][j] = dropdowns[j].value; // Обновляем значение в массиве пар
            console.log(selectPairs);
          });
        }
      }
      selectedValuesArr.length = 0
      selectedValuesArr.push(...selectPairs)
      console.log(selectedValuesArr)
    })

  }

}

// Действие кнопки AddToBasket
function addToBasket() {
  const addButton = document.querySelector('.button-add button')
  const fullItems = document.querySelector('.full-basket')
  const zeroItems = document.querySelector('.zero-basket')
  const sidebar = document.querySelector('.sidebar')

  if (addButton) {
    addButton.addEventListener('click', () => {

      sortArr(selectedValuesArr);
      if (!Object.keys(groupedSelectElemens).length == 0) {
        fullItems.style.display = 'block'
        zeroItems.style.display = 'none'
        displayFullBasket()
      }
      else {
        fullItems.style.display = 'none'
        zeroItems.style.display = 'block'
      }
      sidebar.classList.add('open')
    });
  }
}

// Сортировка
function sortArr(array) {
  for (let elementOfArray of array) {
    if (!groupedSelectElemens[elementOfArray]) {
      groupedSelectElemens[elementOfArray] = { count: 0 }
    }
    groupedSelectElemens[elementOfArray].count += 1

  }
}

// Показ полной корзины
function displayFullBasket() {
  const itemsQuantity = document.querySelector('.items-quantity')
  const itemsDiv = document.querySelector('.item')
  let counts = 0
  for (let elements in groupedSelectElemens) {
    if (!itemsDiv.querySelector(`[data-key="${elements}"]`)) {
      const slashedElements = elements
      let splitedElem = slashedElements.split(',')
      let pushSlashedElem = splitedElem[0] + ' / ' + splitedElem[1]


      let newDiv = document.createElement('div')
      newDiv.style.position = 'relative'
      newDiv.style.width = "100%"
      newDiv.style.height = "100px"
      newDiv.style.backgroundColor = 'white'
      newDiv.style.color = 'black'
      newDiv.style.display = 'flex'
      newDiv.style.justifyContent = 'start'
      newDiv.style.alignItems = 'center'
      newDiv.setAttribute('data-key', elements);

      const newDivText = document.createElement('div')
      const text1 = document.createElement('h1')
      text1.style.fontSize = '10px'
      text1.textContent = 'Barajas Rhinestone Set'
      newDivText.appendChild(text1)

      const text2 = document.createElement('h4')
      text2.textContent = pushSlashedElem
      newDivText.appendChild(text2)
      const counter = document.createElement('div');
      counter.style.display = 'flex';
      counter.style.alignItems = 'center';
      counter.style.border = '1px solid #aaa';
      counter.style.borderRadius = '5px';
      counter.style.width = '100px';
      counter.style.justifyContent = 'space-between';

      // 2. Создаем кнопку уменьшения (-)
      const decreaseBtn = document.createElement('button');
      decreaseBtn.textContent = '−';
      decreaseBtn.style.border = 'none';
      decreaseBtn.style.background = 'none';
      decreaseBtn.style.fontSize = '20px';
      decreaseBtn.style.width = '30px';
      decreaseBtn.style.height = '30px';
      decreaseBtn.style.cursor = 'pointer';

      // 3. Создаем элемент для отображения числа
      const countSpan = document.createElement('input');
      countSpan.style.outline = 'none'
      countSpan.style.borderLeft = '1px solid'
      countSpan.style.borderRight = '1px solid'
      countSpan.style.borderTop = 'none'
      countSpan.style.borderBottom = 'none'
      countSpan.style.width = '30px'
      countSpan.style.height = '100%'
      countSpan.style.fontWeight = 'bold';
      countSpan.style.fontSize = '18px';

      // 4. Создаем кнопку увеличения (+)
      const increaseBtn = document.createElement('button');
      increaseBtn.textContent = '+';
      increaseBtn.style.border = 'none';
      increaseBtn.style.background = 'none';
      increaseBtn.style.fontSize = '20px';
      increaseBtn.style.width = '30px';
      increaseBtn.style.height = '30px';
      increaseBtn.style.cursor = 'pointer';

      // 5. Добавляем кнопки и число внутрь контейнера
      counter.appendChild(decreaseBtn);
      counter.appendChild(countSpan);
      counter.appendChild(increaseBtn);
    

      newDivText.appendChild(counter)
      


      newDiv.appendChild(newDivText)
      itemsDiv.appendChild(newDiv)
      counts += groupedSelectElemens[elements].count

    }

    totalCount = counts
    itemsQuantity.textContent = `${totalCount} items`

    console.log(groupedSelectElemens)
    console.log(totalCount)
  }

}

addToBasket()
selectValues()
openSidebar()


