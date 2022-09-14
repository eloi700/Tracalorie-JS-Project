// =============================================//
// Storage Controller
// =============================================//
const StorageCtrl = (function () {
  // Public Methods
  return {
    storeItem: function (item) {
      let items;
      // Check if any items in Local Storage
      if (localStorage.getItem("items") === null) {
        items = [];
        // Push New Item
        items.push(item);
        // Set Local Storage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // Get what is already in LS
        items = JSON.parse(localStorage.getItem("items"));
        // Push New Item
        items.push(item);
        // Reset the Local Storage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    // Get Items from Local Storage
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    }
  };
})();
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
    // items: [
    //   //   { id: 0, name: "Steak Dinner", calories: 1200 },
    //   //   { id: 1, name: "Cookie", calories: 900 },
    //   //   { id: 2, name: "Egg", calories: 300 },
    // ],
    items: StorageCtrl.getItemsFromStorage(),
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
    // Update Item
    updateItem: function (name, calories) {
      // Calories to a Number
      calories = +calories;
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    // Delete Item
    deleteItem: function (id) {
      // Get ids
      const ids = data.items.map(function (item) {
        return item.id;
      });

      // Get Index
      const index = ids.indexOf(id);
      // Remove Item
      data.items.splice(index, 1);
    },
    // Clear All Items
    cleaAllItems: function () {
      data.items = [];
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
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
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
    // Update List Item
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Node List (listItems) - Turn Node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong>
          <em>${item.calories}</em>
          <a href="#" class="secondary-content">
            <i class="fa fa-pencil edit-item"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
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
    // Remove Item from UI
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Node List (listItems) - Turn Node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function (item) {
        item.remove();
      });
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
const AppCtrl = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Load Event Listeners
  const loadEventListeners = function () {
    // GET UI SELECTORS (Above private - public)
    const UISelectors = UICtrl.getSelectors();
    // ADD ITEM EVENT
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
    // DISABLE SUBMIT ON ENTER
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.key === 13) {
        e.preventDefault();
        return false;
      }
    });
    // EDIT ICON CLICK EVENT
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);
    // UPDATE BTN - ITEM EVENT
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);
    // DELETE BTN - ITEM EVENT
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);
    // BACK BTN - ITEM EVENT
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);
    // CLEAR BTN - ITEMS EVENT
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
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

      // Store in Local Storage
      StorageCtrl.storeItem(newItem);

      // Clear fields (item name & calories)
      UICtrl.clearInput();
    }
    e.preventDefault();
  };

  //Click Edit Item
  const itemEditClick = function (e) {
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

  // Update item submit
  const itemUpdateSubmit = function (e) {
    // Get Item Input
    const input = UICtrl.getItemInput();
    // Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update Local Storage
    StorageCtrl.updateItemStorage(updatedItem);

    // Update the item - clear previous
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete btn event
  const itemDeleteSubmit = function (e) {
    // Get ID current Item
    const currentItem = ItemCtrl.getCurrentItem();
    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);
    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from Local Storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    // Update the item - clear previous
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Clear Items Event
  const clearAllItemsClick = function () {
    //Delete All Items from Data Structure
    ItemCtrl.cleaAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update the item - clear previous
    UICtrl.clearEditState();

    // Remove from UI
    UICtrl.removeItems();

    // Clear from local storage
    StorageCtrl.clearItemsFromStorage();

    // Hide the UL
    UICtrl.hideList();
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
})(ItemCtrl, StorageCtrl, UICtrl);

// =============================================//
// Initializing App
// =============================================//
AppCtrl.init();
