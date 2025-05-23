// Class for individual item (defaults to textfield)
class Item {
  constructor(field, value, title = "Info", ftype = "textfield") {
    this.field = field;
    this.ftype = ftype;
    this.title = title;
    this.value = value;
  }

  // To get a formatted string of the item (for graphic display)
  getFormattedItem() {
    return `${this.title}: ${this.value}`;
  }

  // To get an editor field item ("f0": "First field value")
  getEditorFieldItem() {
    return `${this.field}: ${this.value}`;
  }
}

// Class for a list of items (e.g., item1, item2, etc.)
class ItemList {
  constructor(items) {
    this.items = items.map(
      (item) => new Item(item.field, item.value, item.title, item.ftype)
    );
  }

  // Method to get all items with non-empty values
  getNonEmptyItems() {
    return this.items.filter((item) => item.value !== "");
  }

  // Method to display all items as formatted strings
  displayItems() {
    return this.items.map((item) => item.getFormattedItem());
  }

  // Method to display all editor field items
  displayFieldItems() {
    return this.items.map((item) => item.getEditorFieldItem());
  }
}

// Class for managing multiple item lists
class MultiItemContainer {
  constructor(data) {
    this.itemLists = Object.keys(data).map((key) => {
      return { key, itemList: new ItemList(data[key]) };
    });
  }

  // Method to get all non-empty items for all lists
  getAllNonEmptyItems() {
    return this.itemLists.map(({ key, itemList }) => ({
      listKey: key,
      nonEmptyItems: itemList.getNonEmptyItems(),
    }));
  }

  // Method to display all items for all lists
  displayAllItems() {
    return this.itemLists.map(({ key, itemList }) => ({
      listKey: key,
      formattedItems: itemList.displayItems(),
      formattedFieldItems: itemList.displayFieldItems(),
    }));
  }
}

// Example data
/*
const example_data = {
  item1: [
    { field: "f0", ftype: "number", title: "Number", value: "444" },
    {
      field: "f1",
      ftype: "textfield",
      title: "Fullname",
      value: "Namn Namnsson",
    },
    { field: "f2", ftype: "textfield", title: "Club", value: "OK Tyr" },
    { field: "f4", ftype: "textfield", title: "Class", value: "D21" },
    { field: "f5", ftype: "textfield", title: "Starttime", value: "12:00" },
  ],
  item2: [
    { field: "f0", ftype: "number", title: "Number", value: "445" },
    { field: "f1", ftype: "textfield", title: "Fullname", value: "Kalle Anka" },
    { field: "f2", ftype: "textfield", title: "Club", value: "OK Ankeborg" },
    { field: "f4", ftype: "textfield", title: "Class", value: "H21" },
    { field: "f5", ftype: "textfield", title: "Starttime", value: "12:15" },
  ],
  item3: [
    { field: "f0", ftype: "number", title: "Number", value: "446" },
    {
      field: "f1",
      ftype: "textfield",
      title: "Fullname",
      value: "Namn Namnsson",
    },
    { field: "f2", ftype: "textfield", title: "Club", value: "OK Tyr" },
    { field: "f4", ftype: "textfield", title: "Class", value: "D21" },
    { field: "f5", ftype: "textfield", title: "Starttime", value: "12:00" },
  ],
};
*/
// Creating an instance of MultiItemContainer
/*
const multiItemContainer = new MultiItemContainer(example_data);

// Displaying all non-empty items
console.log("All Non-Empty Items:", multiItemContainer.getAllNonEmptyItems());

// Displaying all formatted items
console.log(
  "Formatted Items from All Lists:",
  multiItemContainer.displayAllItems()
);
*/
