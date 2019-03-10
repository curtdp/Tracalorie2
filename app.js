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
    },
  };
})();

// App Controller
const App = (function(ItemCtrl, UICtrl) {
  // Public Methods
  return {
    init() {
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Populate List with items
      UICtrl.populateItemList(items);
    },
  };
})(ItemCtrl, UICtrl);

App.init();
