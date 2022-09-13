// =============================================//
// Storage Controller
// =============================================//

// =============================================//
// Item Controller
// =============================================//
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
      //   { id: 0, name: "Steak Dinner", calories: 1200 },
      //   { id: 1, name: "Cookie", calories: 900 },
      //   { id: 2, name: "Egg", calories: 300 },
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
    addItem: function (name, calories) {
      // Create ID
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Calories to number
      // calories = parseInt(calories) OR
      calories = +calories;

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    // Get Item by Id
    getItemById: function (idNumber) {
      let found = null;
      // Loop thru the items
      data.items.forEach(function (item) {
        if (item.id === idNumber) {
          found = item;
        }
      });
      return found;
    },
    // Set current item - itemToEdit
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    // Get current item
    getCurrentItem: function () {
      return data.currentItem;
    },
    // Get Total Calories
    getTotalCalories: function () {
      let total = 0;
      // Loop thru items and add calories
      data.items.forEach(function (item) {
        total += item.calories;
      });
      // Set total calories in data structure
      data.totalCalories = total;
      // Return total
      return data.totalCalories;
    },
    logData: function () {
      //   return data;
      console.log(data);
    },
  };
})();

// =============================================//
//UI Controller - Populating the List of Items
// =============================================//

const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };

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
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // Add class & id name
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      // Add html
      li.innerHTML = `<strong>${item.name}: </strong>
        <em>${item.calories}</em>
        <a href="#" class="secondary-content">
          <i class="fa fa-pencil edit-item"></i>
        </a>`;
      // Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    // Clear the fields (item name & calories)
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    // Add Item to Form
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function (ovrallTotalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        ovrallTotalCalories;
    },
    clearEditState: function () {
      //Clear the Input, hide buttons, show add btn
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      //Show Buttons except add btn
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

// =============================================//
// App Controller (When the application loads)
// =============================================//
const AppCtrl = (function (ItemCtrl, UICtrl) {
  // Load Event Listeners
  const loadEventListeners = function () {
    // GET UI SELECTORS (Above private - public)
    const UISelectors = UICtrl.getSelectors();
    // ADD ITEM EVENT
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
    // EDIT ICON EVENT
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemUpdateSubmit);
  };

  // Add Item Submit function()
  const itemAddSubmit = function (e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
    // Check for name and calorie input
    if (input.name !== "" && input.calories !== "") {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      // Clear fields (item name & calories)
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  //Update item Submit
  const itemUpdateSubmit = function (e) {
    if (e.target.classList.contains("edit-item")) {
      // Event Delegation (current item) - Get list item id (item-0)
      const listId = e.target.parentNode.parentNode.id;
      // Break into an Array the ID (item-0), showing 0 only
      const listIdArray = listId.split("-");
      // Get the Actual Id Number
      // const idNumber = parseInt(listIdArray[1]); OR
      const idNumber = +listIdArray[1];
      // Get the item to be edited
      const itemToEdit = ItemCtrl.getItemById(idNumber);
      // Set the itemToEdit as Current Item
      ItemCtrl.setCurrentItem(itemToEdit);
      // Add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  // Public Methods
  return {
    init: function () {
      // Clear Edit State / Set initial set
      UICtrl.clearEditState();

      // Fetch Items from Data Structure (ItemsCtrl)
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }
      // Populate List with Items
      UICtrl.populateItemList(items);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load Event Listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

// =============================================//
// Initializing App
// =============================================//
AppCtrl.init();
