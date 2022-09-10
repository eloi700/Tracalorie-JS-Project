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
    // Get Items / Data
    getItems: function () {
      return data.items;
    },
    logData: function () {
      return data;
    },
  };
})();

// UI Controller - Populating the List of Items
const UICtrl = (function () {
    const UISelectors = {
        itemList : '#item-list'
    }

  // Public Methods
  return {
    populateItemList: function (items) {

      let html = "";
      items.forEach(function (item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong>
          <em>${item.calories}</em>
          <a href="#" class="secondary-content">
            <i class="fa fa-pencil edit-item"></i>
          </a>
        </li>`;
      });

    // Insert List Items
    document.querySelector(UISelectors.itemList).innerHTML = html;
    },
  };
})();

// App Controller (When the application loads)
const AppCtrl = (function (ItemCtrl, UICtrl) {
  // Public Methods
  return {
    init: function () {
      // Fetch Items from Data Structure (ItemsCtrl)
      const items = ItemCtrl.getItems();

      // Populate List with Items
      UICtrl.populateItemList(items);
    },
  };
})(ItemCtrl, UICtrl);

// Initializing App
AppCtrl.init();
