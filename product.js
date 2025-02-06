

function selectorsOpen() {
    const radioButtons = document.querySelectorAll('input[name="product_quantity"]');
    for(const radioButton of radioButtons) {
      radioButton.addEventListener('change', () => {
        const allLabels = document.querySelectorAll('.radio-button');
        allLabels.forEach((label) => {
          const selectors = label.querySelectorAll('.selector');
          selectors.forEach((selector) => {
            selector.style.display = "none";
          });
        });
        
        const parentLabel = radioButton.closest('.radio-button');
        const relatedSelectors = parentLabel.querySelectorAll('.selector');

        relatedSelectors.forEach((selector) => {
          selector.style.display = "block";
            let value = selector.querySelector('select')
            console.log(value.value)
        });
      });
    }
    
}
// function addToCart(currentValue){
//     const addToCart = document.querySelector('.button-add')
//     addToCart.addEventListener('click', () => {
//         selectorsOpen()
//         relatedSelectors.forEach((selector) => {
//             console.log(selector.value)
//             let newArr = []
//             newArr.push()
//         })
//     })
// }


selectorsOpen()