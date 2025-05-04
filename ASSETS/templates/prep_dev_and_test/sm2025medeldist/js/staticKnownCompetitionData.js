/**
 * 
 * staticKnownCompetitionData
 * 
 * Functions that can be run at first init (or when needed) to
 * generate 'static' text and values for dropdown items in
 * SPX-GC editor view.
 * 
 --------------------------------------------------------- 
MedelDistans - A Finaler (sträcka i km - beräknad sluttid)
D21	4,9km – 30-35min	
H21	5,9km – 30-35min
D20	3,6km – 20-25min
H20	5,0km – 20-25min
D18	3,3km – 20-25min
H18	4,5km – 20-25min
----------------------------------------------------------
 */

/**
 * 
 Kamerakontroller:
    TV 1       ->  Endast H21 och D21 (men jag stödjer alla klasser i A-finalerna)
    TV 2 – ut  ->  Alla klasser i A-finalerna
    (TV 3)
    Förvarning
    MÅL

    Finns det uppgifter om antal kilometer till radiokontrollerna TV 1 och TV 2?
    Om det finns så kan vi även visa distansen i rubriken: SPLIT TV 1 - x.x KM.
 * 
 */

// Antar att det är SAMMA kamerakontroller för ALLA huvudklasser (H21/D21) i MedelDistans.

// Define the static placeholder as a constant:
const trackSplitsMedel = {
  track_splits: {
    track_id: 1,
    track_name: "MedelDistans",
    tv_controls: [
      "TV1",
      "TV2",
      "TV3", // could be used as a warning control
      "Förvarning",
      "MÅL",
    ],
  },
};

// Optionally attach it to window if you want to ensure global access
window.trackSplitsMedel = trackSplitsMedel;

// Antar att det är SAMMA kamerakontroller för ALLA huvudklasser (H21/D21) i Stafett.

//OBS: För stafett finns en TV3 kamera vid förvarning/varvning!!!:
// Define the static placeholder as a constant:
const trackSplitsStafett = {
  track_splits: {
    track_id: 1,
    track_name: "Stafett",
    tv_controls: [
      "TV1",
      "TV2",
      "TV3", // could be used as a warning control
      "Förvarning",
      "MÅL",
    ],
  },
};

// Optionally attach it to window if you want to ensure global access
window.trackSplitsStafett = trackSplitsStafett;

function createItemsFromTrackSplits(placeholder) {
  // Get the array of tv_controls.
  const controls = placeholder.track_splits.tv_controls;

  // Map each control to an object with text and value.
  const items = controls.map((ctrl) => {
    // For example, handle "Mål" as a special case.
    if (ctrl.toLowerCase() === "mål") {
      return { text: "MÅL", value: "FINISH" };
    }
    // Otherwise, use the original control string for both text and value:
    return { text: ctrl, value: ctrl };
  });

  return items;
}

// Example usage:
// ONLY DO THIS ONCE AT INIT IF REALLY NEEDED!
// Used to populate field: "f_vald_kontroll", ftype: "dropdown", title: "Select RadioControl" with items.

/*
  const items = createItemsFromTrackSplits(trackSplitsMedel);
  console.log("Generated items:", items);
  */

/**
 *
 * JavaScript kod för att utifrån API data från endpoint
 * kunna skapa items arrayer för dropdown i DataFields förenligt med SPXGCTemplateDefinition formatet!
 *
 */

// API data MÅSTE se ut som denna exempel struktur och ha dessa properties:
/*
{
  competition: "Medel-Kval",
  runner_class: "D21",
  runners: [
    {
      bib: "101",
      name: "Zerafina Pekkala",
      club: "OK Nåjd",
      start_time: "11:00",
      split_times: [24500, 50800, 78400],
      final_time: 108000,
      place: 12,
    },
    ...
   ],
};
*/

function createRunnerItems(apiData) {
  if (!apiData || !Array.isArray(apiData.runners)) {
    console.error("Invalid API data: runners array missing");
    return [];
  }

  // Map each runner to a new object with text and value properties
  return apiData.runners.map((runner) => {
    return {
      text: `${runner.bib} - ${runner.name}`,
      value: runner.bib,
    };
  });
}

// Example usage:
const apiMockDataExample = {
  competition: "Medel-Kval",
  runner_class: "D21",
  runners: [
    {
      bib: "101",
      name: "Zerafina Pekkala",
      club: "OK Nåjd",
      start_time: "11:00",
      split_times: [24500, 50800, 78400],
      final_time: 108000,
      place: 12,
    },
    {
      bib: "102",
      name: "Linda Fahlin",
      club: "OK Tyr",
      start_time: "11:30",
      split_times: [21500, 30800, 58400],
      final_time: 10800,
      place: 7,
    },
    {
      bib: "333",
      name: "Karin Johansson",
      club: "OK Djerf",
      start_time: "12:04",
      split_times: [2580, 5300, 8080],
      final_time: 11200,
      place: 3,
    },
    {
      bib: "111",
      name: "Anna Andersson",
      club: "OK Tyr",
      start_time: "12:00",
      split_times: [2450, 5080, 7840],
      final_time: 10800,
      place: 1,
    },
    {
      bib: "222",
      name: "Lisa Bergström",
      club: "IFK Göteborg",
      start_time: "12:02",
      split_times: [2520, 5190, 7950],
      final_time: 10950,
      place: 2,
    },
  ],
};

// ONLY DO THIS ONCE AT INIT IF REALLY NEEDED!
// Used to populate field: "f_vald_runner_bib", ftype: "dropdown", title: "Select Runner" with items!
/*
const items = createRunnerItems(apiMockDataExample); // NOTE: Change to real apiData for real items generation!
console.log("Constructed items:", items);
*/

// If you need them ordered in a specific way (for example, sorted by bib number or by place),
// you can sort them after mapping. For instance, to sort by bib in ascending order (comparing as strings):

const itemsSorted = createRunnerItems(apiData).sort((a, b) =>
  a.value.localeCompare(b.value)
);
console.log("Sorted items array:", itemsSorted);
