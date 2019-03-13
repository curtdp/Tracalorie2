// Storage controller
const StorageCtrl = (function() {
  // Public Methods
  return {
    storeItem(item) {
      let items = [];
      // Check if any items in ls
      if (localStorage.getItem("items") === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // Get what is already in ls
        items = JSON.parse(localStorage.getItem("items"));
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      // Set ls
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteFromLocalStorage(id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      // Set ls
      localStorage.setItem("items", JSON.stringify(items));
    },
  };
})();

// Item Controller

const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    // items: [
    //   // { id: 0, name: "Steak Dinner", calories: 1200 },
    //   // { id: 1, name: "Cookie", calories: 400 },
    //   // { id: 2, name: "Eggs", calories: 300 },
    // ],

    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  // Public Methods
  return {
    getItems() {
      return data.items;
    },
    addItem({ name, calories }) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new  item
      newItem = new Item(ID, name, calories);
      // Add to items Array
      data.items.push(newItem);
    },
    getTotalCalories() {
      data.totalCalories = data.items.reduce(
        (acc, item) => acc + item.calories,
        0,
      );
      return data.totalCalories;
    },
    getItemById(id) {
      // Loop trough items
      return data.items.find(item => item.id === id);
    },
    setCurrentItem(item) {
      data.currentItem = item;
    },
    getCurrentItem() {
      return data.currentItem;
    },
    updateItem({ name, calories }) {
      // Calories to number
      calories = parseInt(calories);
      let itemToUpdate = data.items.find(
        item => data.currentItem.id === item.id,
      );
      itemToUpdate.name = name;
      itemToUpdate.calories = calories;
      return itemToUpdate;
    },
    deleteItem(id) {
      // Get ids
      ids = data.items.map(item => {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems() {
      data.items = [];
    },
    logData() {
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    clearBtn: ".clear-btn",
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
    populateItemList(items) {
      let html = "";
      items.forEach(item => {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
          <button class="secondary-content">
            <i class="fa fa-pencil edit-item"></i>
          </button>
        </li>
        `;
      });
      // Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput() {
      const name = document.querySelector(UISelectors.itemNameInput).value;
      const calories = document.querySelector(UISelectors.itemCaloriesInput)
        .value;
      return {
        name,
        calories,
      };
    },
    addListItem(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // Add Class
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
      <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
      <button class="secondary-content">
        <i class="fa fa-pencil edit-item"></i>
      </button>
      `;
      // Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    removeItems() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems.forEach(item => {
        item.remove();
      });
    },
    hideList() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories,
      ).textContent = totalCalories;
    },
    clearEditState() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    addItemToForm() {
      document.querySelector(
        UISelectors.itemNameInput,
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput,
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    showEditState() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    updateListItem(updatedItem) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems.forEach(item => {
        const itemId = item.getAttribute("id");
        if (itemId === `item-${updatedItem.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
          <strong>${updatedItem.name}:</strong> <em>${
            updatedItem.calories
          } Calories</em>
          <button class="secondary-content">
            <i class="fa fa-pencil edit-item"></i>
          </button>
          `;
        }
      });
    },
    deleteListItem(id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    getSelectors() {
      return UISelectors;
    },
  };
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load Event Listeners
  const loadEventListeners = function() {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable submit on enter
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit Btn click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update Btn click event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener("click", e => {
      UICtrl.clearEditState();
      e.preventDefault();
    });

    // Clear all items
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  const itemDeleteSubmit = function(e) {
    e.preventDefault();
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete current item
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteFromLocalStorage(currentItem.id);

    UICtrl.clearEditState();
  };

  // Clear items event
  const clearAllItemsClick = function(e) {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Remove from UI
    UICtrl.removeItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Hide UL
    UICtrl.hideList();

    e.preventDefault();
  };

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if (input.name !== "" && input.calories !== "") {
      // Add item
      ItemCtrl.addItem(input);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear Fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Click Edit Item
  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split("-");

      // Get actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };

  // Update item submit
  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input);

    // Update UI

    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();
    e.preventDefault();
  };

  // Public Methods
  return {
    init() {
      // Clear edit state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate List with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
