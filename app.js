// Storage Controller

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: [
      { id: 0, name: "Steak Dinner", calories: 1200 },
      { id: 1, name: "Cookie", calories: 900 },
      { id: 2, name: "Egg", calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  // Public Methods
  return {
    logData: function(){
        return data;
    }
  }


})();

// UI Controller - Populating the List of Items
const UICtrl = (function () {

    // Public Methods
    return{

    }

})();

// App Controller (When the application loads)
const AppCtrl = (function (ItemCtrl, UICtrl) {

    // Public Methods
    return{
        init: function(){
            console.log('initializing app...');
        }
    }

})(ItemCtrl, UICtrl);

// Initializing App
AppCtrl.init();
