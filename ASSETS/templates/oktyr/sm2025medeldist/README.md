
# I have a JavaScript file spx_parse.js with a function coded like this: 
```js
// This is a generic BASIC command handler
// between SPX and the template. See other
// SPX templates for more advanced functionality
// such as Update() etc..

function update(data) {
// Push data to template fields
const jsonData = JSON.parse(data)
for (var field in jsonData) {
if (document.getElementById(field)) {
let value = jsonData[field]
if ( value == "null" || value == "undefined" ) value = "";
document.getElementById(field).innerHTML = value
}
}
}
```
How can I use this function or an adapted function that periodically can update all 40 values (10 rows with 4 columns per row) in the HTML table by retrieving data values from a external JSON file with structure similar to "
```js
{
"runners": [
{
"description": "Startlist with runners data values",
"dataformat": "json",
"numberOfItems": "2",

            "item1": [
                {
                    "field": "f0",
                    "ftype": "textfield",
                    "title": "Number",
                    "value": "444"
                },
                {
                    "field": "f1",
                    "ftype": "textfield",
                    "title": "Fullname",
                    "value": "Namn Namnsson"
                },
                {
                    "field": "f2",
                    "ftype": "textfield",
                    "title": "Club",
                    "value": "OK Tyr"
                },
                {
                    "field": "f3",
                    "ftype": "textfield",
                    "title": "Location",
                    "value": ""
                },
                {
                    "field": "f4",
                    "ftype": "textfield",
                    "title": "Class",
                    "value": "D21"
                },
                {
                    "field": "f5",
                    "ftype": "textfield",
                    "title": "Starttime",
                    "value": "12:00"
                }
            ],
            "item2": [
                {
                    "field": "f0",
                    "ftype": "textfield",
                    "title": "Number",
                    "value": "445"
                },
                {
                    "field": "f1",
                    "ftype": "textfield",
                    "title": "Fullname",
                    "value": "Kalle Anka"
                },
                {
                    "field": "f2",
                    "ftype": "textfield",
                    "title": "Club",
                    "value": "OK Ankeborg"
                },
                {
                    "field": "f3",
                    "ftype": "textfield",
                    "title": "Location",
                    "value": ""
                },
                {
                    "field": "f4",
                    "ftype": "textfield",
                    "title": "Class",
                    "value": "H21"
                },
                {
                    "field": "f5",
                    "ftype": "textfield",
                    "title": "Starttime",
                    "value": "12:15"
                }
            ]
        }
    ]
    }
    ```
    
    So if the JSON contains 2 items then the start list should show 2 rows, If it has 3 items then show 3 rows etc. If the JSON has more than 10 items, only the first 10 items should be shown in the startlist. The JSON file may be updated externally, which is the reason that the update() function should be called periodically, like every minute or so. How adapt the code from previous answer to achieve this?

Here's how to modify your implementation to handle the JSON structure and dynamic updates:

```html

&lt;table id="startlist"&gt;
  &lt;thead&gt;
    &lt;tr&gt;&lt;th&gt;Number&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Club&lt;/th&gt;&lt;th&gt;Start&lt;/th&gt;&lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    
  &lt;/tbody&gt;
&lt;/table&gt;

&lt;script&gt;
// Initial table setup
const tbody = document.querySelector('#startlist tbody');
for (let i = 0; i &lt; 10; i++) {
  tbody.innerHTML += `
    &lt;tr&gt;
      &lt;td id="number-${i}"&gt;&lt;/td&gt;
      &lt;td id="name-${i}"&gt;&lt;/td&gt;
      &lt;td id="club-${i}"&gt;&lt;/td&gt;
      &lt;td id="start-${i}"&gt;&lt;/td&gt;
    &lt;/tr&gt;`;
}

// Modified update function
function update(data) {
  const jsonData = JSON.parse(data);
  const runnerData = jsonData.runners[0];
  const itemCount = Math.min(parseInt(runnerData.numberOfItems), 10);

  // Process each item
  for (let i = 1; i &lt;= itemCount; i++) {
    const item = runnerData[`item${i}`];
    const rowIdx = i - 1;
    
    item.forEach(field =&gt; {
      const cellMap = {
        'f0': `number-${rowIdx}`,
        'f1': `name-${rowIdx}`,
        'f2': `club-${rowIdx}`,
        'f5': `start-${rowIdx}`
      };
      
      if (cellMap[field.field]) {
        const element = document.getElementById(cellMap[field.field]);
        if (element) element.textContent = field.value || '';
      }
    });
  }

  // Clear remaining rows
  for (let i = itemCount; i &lt; 10; i++) {
    document.getElementById(`number-${i}`).textContent = '';
    document.getElementById(`name-${i}`).textContent = '';
    document.getElementById(`club-${i}`).textContent = '';
    document.getElementById(`start-${i}`).textContent = '';
  }
}

// Add periodic refresh
let isUpdating = false;
setInterval(async () =&gt; {
  if (!isUpdating) {
    isUpdating = true;
    try {
      const response = await fetch('your-data-source.json');
      const data = await response.text();
      update(data);
    } catch (error) {
      console.error('Update failed:', error);
    }
    isUpdating = false;
  }
}, 60000); // Update every 60 seconds
&lt;/script&gt;
```

**Key Adaptations:**

1. **Dynamic Row Handling:**

- Automatically creates 10 empty rows on initial load
- Only displays rows with actual data from JSON
- Clears unused rows when data has fewer than 10 items

2. **JSON Mapping:**
```javascript
item.forEach(field =&gt; {
  const cellMap = {
    'f0': `number-${rowIdx}`,
    'f1': `name-${rowIdx}`,
    'f2': `club-${rowIdx}`,
    'f5': `start-${rowIdx}`
  };
  // ... rest of mapping logic
});
```

3. **Automatic Refresh System:**

- Safe interval checking with `isUpdating` flag
- Error handling for failed fetches
- Configurable update interval (currently 60 seconds)

**JSON Structure Requirements:**

```json
{
  "runners": [{
    "numberOfItems": "2",
    "item1": [/* field definitions */],
    "item2": [/* field definitions */]
  }]
}
```

**Implementation Notes:**

1. Ensure your JSON endpoint matches the URL in the `fetch()` call
2. Field mapping ignores "Location" (f3) and "Class" (f4) as requested
3. Uses `textContent` instead of `innerHTML` for safer text rendering
4. Handles null/undefined values by falling back to empty string

This solution maintains compatibility with SPX-GC's template system while adding external JSON loading and automatic refresh capabilities.

