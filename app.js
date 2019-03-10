// Storage controller

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
    items: [
      // { id: 0, name: "Steak Dinner", calories: 1200 },
      // { id: 1, name: "Cookie", calories: 400 },
      // { id: 2, name: "Eggs", calories: 300 },
    ],
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
    logData() {
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
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
    hideList() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories,
      ).textContent = totalCalories;
    },
    getSelectors() {
      return UISelectors;
    },
  };
})();

// App Controller
const App = (function(ItemCtrl, UICtrl) {
  // Load Event Listeners
  const loadEventListeners = function() {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
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
      // Clear Fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Public Methods
  return {
    init() {
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate List with items
        UICtrl.populateItemList(items);
      }

      // Load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

App.init();
