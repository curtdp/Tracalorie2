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
      { id: 0, name: "Steak Dinner", calories: 1200 },
      { id: 1, name: "Cookie", calories: 400 },
      { id: 2, name: "Eggs", calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  // Public Methods
  return {
    getItems() {
      return data.items;
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
    e.preventDefault();
    console.log("Add");
  };

  // Public Methods
  return {
    init() {
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Populate List with items
      UICtrl.populateItemList(items);

      // Load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

App.init();
