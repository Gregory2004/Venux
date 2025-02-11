// Глобальные переменные и функции, не связанные с groupedElements
let selectedValues = [];
let Quantities = 0
// Глобальный массив корзины – загружаем из localStorage при инициализации
let basketArr = loadCart();

// Функция открытия селекторов, привязанная к радио-кнопкам
function selectorsOpen() {
  const radioButtons = document.querySelectorAll('input[name="product_quantity"]');

  radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
      // Скрываем все селекторы
      const allLabels = document.querySelectorAll('.radio-button');
      allLabels.forEach(label => {
        const selectors = label.querySelectorAll('.selector');
        selectors.forEach(selector => {
          selector.style.display = "none"; // Скрываем селекторы
        });
      });

      // Получаем родительский элемент радио-кнопки
      const parentLabel = radioButton.closest('.radio-button');
      if (!parentLabel) {
        console.error('Родительский элемент для радио-кнопки не найден.');
        return;
      }

      // Показываем селекторы, связанные с выбранной радио-кнопкой
      const relatedSelectors = parentLabel.querySelectorAll('.selector');

      // Очищаем массив выбранных значений
      selectedValues = [];

      let index = 0;
      relatedSelectors.forEach(choosenSelector => {
        choosenSelector.style.display = 'block'; // Показываем селектор

        const selects = choosenSelector.querySelectorAll('select');
        selects.forEach(select => {
          // Инициализация массива для текущего индекса
          if (!selectedValues[index]) {
            selectedValues[index] = [];
          }

          // Сохраняем текущее значение select
          selectedValues[index].push(select.value);

          // Привязываем обработчик изменения, чтобы обновлять selectedValues.
          // Используем onchange для предотвращения накопления обработчиков.
          select.onchange = updateSelectedValues.bind(null, selects, index);
        });
        index++;
      });
    });
  });
}

// Функция для обновления выбранных значений при изменении селектора
function updateSelectedValues(selects, index) {
  selectedValues[index] = []; // Очищаем значения для текущей группы
  selects.forEach(select => {
    selectedValues[index].push(select.value); // Сохраняем актуальные значения
  });
}

// Функция для обработки нажатия кнопки «Добавить в корзину»
function addToCart() {
  const addToCartButton = document.querySelector('.button-add');
  if (!addToCartButton) {
    console.error('Кнопка добавления в корзину не найдена.');
    return;
  }
  const zeroItems = document.querySelector('.zero-basket');
  const fullItems = document.querySelector('.full-basket');

  addToCartButton.addEventListener('click', function () {
    if (Quantities == 0 || selectedValues.length == 0) {
      // Если ничего не выбрано, открываем сайдбар и показываем пустую корзину
      openClose();
      if (zeroItems) zeroItems.style.display = 'block';
      if (fullItems) fullItems.style.display = 'none';
      console.error('Нет выбранных значений.');
    } else {
      // Показываем заполненную корзину
      if (zeroItems) zeroItems.style.display = 'none';
      if (fullItems) fullItems.style.display = 'block';
      openClose();

      // Создаём глубокую копию выбранных значений
      const selectedCopy = JSON.parse(JSON.stringify(selectedValues));
      basketArr.push(selectedCopy); // Добавляем копию в глобальную корзину
      saveCart(basketArr);
    }
    // Передаём всю корзину в функцию группировки;
    // внутри неё будут обработаны только новые элементы
    packageToPush(basketArr);
  });
}

// Сохранение и загрузка корзины в localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function loadCart() {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
}

// Функция для открытия/закрытия сайдбара (корзины)
function openClose() {
  const sidebar = document.querySelector('.sidebar');
  const bgcGrey = document.querySelector('.grey');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
  if (bgcGrey) {
    bgcGrey.classList.toggle('greyed');
  }
  if (sidebar && sidebar.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Функция для открытия/закрытия сайдбара по клику на разные элементы
const openCloseSidebar = () => {
  const cartIcon = document.querySelector('.cart-icon');
  const closeSidebar = document.querySelector('.close-button');
  const continueButton = document.querySelector('.zero-item button');

  if (cartIcon) {
    cartIcon.addEventListener('click', openClose);
  }
  if (closeSidebar) {
    closeSidebar.addEventListener('click', openClose);
  }
  if (continueButton) {
    continueButton.addEventListener('click', openClose);
  }
};

// Универсальная функция для создания кнопок (с необязательным обработчиком)
function createButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  Object.assign(button.style, {
    padding: '5px 10px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#f0f0f0',
    fontSize: '16px',
    outline: 'none',
    margin: '0'
  });

  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = '#e0e0e0';
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = '#f0f0f0';
  });
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  return button;
}

// -------------------------
// packageToPush – функция-замыкание для группировки добавленных товаров,
// обрабатывающая только новые элементы корзины
// -------------------------
const packageToPush = (function () {
  // Локальный объект для хранения сгруппированных элементов
  let groupedElements = {};
  // Счётчик обработанных элементов корзины
  let processedItemsCount = 0;
  // Переменная для подсчёта общего количества товаров
  let totalItemsCount = 0;

  // Рекурсивная функция для обработки массива и группировки по ключу (на основе JSON-представления)
  function processArray(arr) {
    for (let element of arr) {
      if (Array.isArray(element)) {
        processArray(element);
      } else {
        const key = JSON.stringify(arr);
        if (!groupedElements[key]) {
          totalItemsCount += 1;
          groupedElements[key] = { value: arr, count: 1 };
        } else {
          totalItemsCount += 1;
          groupedElements[key].count += 1;
        }
        break; // После обработки первого примитивного элемента выходим из цикла
      }
    }
  }

  // Возвращаемая функция для группировки и отрисовки новых элементов
  return function (basketArr) {
    // Получаем элемент для отображения общего количества товаров
    const itemsQuantity = document.querySelector('.items-quantity');
    if (!itemsQuantity) {
      console.error('Элемент .items-quantity не найден');
      return;
    }

    // Обрабатываем только новые элементы из корзины
    for (let i = processedItemsCount; i < basketArr.length; i++) {
      processArray(basketArr[i]);
    }
    processedItemsCount = basketArr.length; // Обновляем счётчик обработанных элементов

    const item = document.querySelector('.item');
    if (!item) {
      console.error('Элемент .item не найден');
      return;
    }

    // Добавляем стили для input[type=number], если они ещё не добавлены
    if (!document.getElementById('customStyles')) {
      const style = document.createElement('style');
      style.id = 'customStyles';
      style.textContent = `
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `;
      document.head.appendChild(style);
    }

    // Обновляем существующие элементы или создаём новые для каждой группы
    Object.entries(groupedElements).forEach(([key, { value, count }]) => {
      // Ищем уже созданный элемент для данной группы
      let existingDiv = Array.from(item.children).find(
        child => child.dataset.key === key
      );

      if (existingDiv) {
        // Если элемент существует, обновляем значение счётчика
        const counterInput = existingDiv.querySelector('input');
        if (counterInput) {
          counterInput.value = count;
        }
      } else {
        // Создаём новый элемент для группы
        const newDiv = document.createElement('div');
        newDiv.dataset.key = key;

        const titleSpan = document.createElement('span');
        titleSpan.textContent = `${value.join(' / ')}: `;
        titleSpan.style.marginRight = '8px';

        const counterContainer = document.createElement('div');
        Object.assign(counterContainer.style, {
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: '4px',
          overflow: 'hidden',
          width: '150px',
          marginBottom: '10px'
        });

        const counterInput = document.createElement('input');
        counterInput.type = 'number';
        counterInput.value = count;
        counterInput.min = 1;
        Object.assign(counterInput.style, {
          width: '40px',
          textAlign: 'center',
          border: 'none',
          outline: 'none'
        });

        // Создаём кнопки уменьшения и увеличения
        const decrementButton = createButton('-');
        const incrementButton = createButton('+');

        decrementButton.addEventListener('click', () => {
          const currentCount = +counterInput.value;
          if (currentCount > 1) {
            groupedElements[key].count = currentCount - 1;
            totalItemsCount -= 1;
            itemsQuantity.textContent = totalItemsCount + " items";
            counterInput.value = groupedElements[key].count;
          }
        });

        incrementButton.addEventListener('click', () => {
          const currentCount = +counterInput.value;
          groupedElements[key].count = currentCount + 1;
          totalItemsCount += 1;
          itemsQuantity.textContent = totalItemsCount + " items";
          counterInput.value = groupedElements[key].count;
        });

        counterInput.addEventListener('change', () => {
          const inputValue = parseInt(counterInput.value, 10);
          if (!isNaN(inputValue) && inputValue >= 1) {
            // Обновляем общий счёт, вычислив разницу между новым и старым значением
            totalItemsCount += (inputValue - groupedElements[key].count);
            groupedElements[key].count = inputValue;
            itemsQuantity.textContent = totalItemsCount + " items";
          } else {
            counterInput.value = groupedElements[key].count;
          }
        });

        counterContainer.append(decrementButton, counterInput, incrementButton);
        newDiv.appendChild(titleSpan);
        newDiv.appendChild(counterContainer);
        item.appendChild(newDiv);
      }
    });

    // Обновляем отображение общего количества товаров
    itemsQuantity.textContent = totalItemsCount + " items";
    Quantities = totalItemsCount
  console.log(Quantities)
  };
})();

// При загрузке страницы – группируем ранее сохранённые товары
window.addEventListener('load', function () {
  packageToPush(basketArr);
  console.log(selectedValues)
});

// Инициализация обработчиков
openCloseSidebar();
selectorsOpen();
addToCart();
