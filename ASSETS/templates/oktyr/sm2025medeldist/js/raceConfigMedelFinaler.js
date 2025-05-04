// ---------------------------------------------
//
// Konfiguration av tävlingsklasserna
//   Medeldistans A-finaler
//   Lördag 10/5 2025
//
// ---------------------------------------------

const raceConfig = {
  H20: {
    firstStart: "12:30", // Första starttiden (HH:MM)
    interval: 120, // Intervall mellan startande, i sekunder (ex. 120 = 2 min)
    baseBib: 401, // Första bib-numret, löparna får bib 401-445
  },
  D20: {
    firstStart: "12:53",
    interval: 120,
    baseBib: 301, // Bib 301-345
  },
  H18: {
    firstStart: "13:08",
    interval: 120,
    baseBib: 601, // Bib 601-645
  },
  D18: {
    firstStart: "13:25",
    interval: 120,
    baseBib: 501, // Bib 501-545
  },
  H21: {
    firstStart: "14:08",
    interval: 120,
    baseBib: 201, // Bib 201-245
  },
  D21: {
    firstStart: "15:01",
    interval: 120,
    baseBib: 101, // Bib 101-145
  },
};

/**
 * Hjälpfunktion för att nollfylla siffror (t.ex. 7 -> "07").
 */
function pad(num) {
  return num.toString().padStart(2, "0");
}

/**
 * Beräknar starttid för en given tävlingsklass och löpnummer.
 *
 * @param {string} klass - En av strängarna "H21", "D21", "H20", "D20", "H18", "D18".
 * @param {number} lopnummer - Löpnummer, mellan 1 och 45.
 * @param {number} [customInterval] - (Valfritt) Om du vill använda ett annat intervall än standard för denna klass (i sekunder).
 * @returns {string} Starttiden som HH:MM:SS.
 */
function calculateStartTimeUsingLopNummer(klass, lopnummer, customInterval) {
  if (!raceConfig.hasOwnProperty(klass)) {
    throw new Error("Okänd runner_class: " + klass);
  }
  if (lopnummer < 1 || lopnummer > 45) {
    throw new Error("Löpnummer måste vara mellan 1 och 45");
  }

  const config = raceConfig[klass];

  // Använd customInterval om det är angivet, annars standardvärdet.
  const intervalSec =
    typeof customInterval === "number" ? customInterval : config.interval;
  // Säkerställ att intervallet ligger mellan 60 (1 minut) och 300 (5 minuter) sekunder.
  if (intervalSec < 60 || intervalSec > 300) {
    throw new Error("Intervallet måste vara mellan 60 och 300 sekunder");
  }

  // Konvertera den första starttiden till sekunder från midnatt.
  const [hourStr, minStr] = config.firstStart.split(":");
  const startHour = parseInt(hourStr, 10);
  const startMinute = parseInt(minStr, 10);
  const firstStartSec = startHour * 3600 + startMinute * 60;

  // Beräkna starttiden för löparen: för löpare 1 används firstStartSec,
  // för löpare N adderas (N-1) * intervalSec.
  const runnerStartSec = firstStartSec + (lopnummer - 1) * intervalSec;

  // Omvandla sekunder till HH:MM:SS.
  const resultHour = Math.floor(runnerStartSec / 3600);
  const resultMinute = Math.floor((runnerStartSec % 3600) / 60);
  const resultSecond = runnerStartSec % 60;

  return `${pad(resultHour)}:${pad(resultMinute)}:${pad(resultSecond)}`;
}

/**
 * Beräknar bib-numret för en given tävlingsklass och löpnummer.
 *
 * @param {string} klass - En av strängarna "H21", "D21", "H20", "D20", "H18", "D18".
 * @param {number} lopnummer - Löpnummer, mellan 1 och 45.
 * @returns {number} Bib-numret.
 */
function calculateBibNumber(klass, lopnummer) {
  if (!raceConfig.hasOwnProperty(klass)) {
    throw new Error("Okänd runner_class: " + klass);
  }
  if (lopnummer < 1 || lopnummer > 45) {
    throw new Error("Löpnummer måste vara mellan 1 och 45");
  }

  const { baseBib } = raceConfig[klass];
  return baseBib + (lopnummer - 1);
}

/**
 * Beräknar starttid för en given tävlingsklass och ett angivet bib-nummer.
 *
 * Vi utgår från att de giltiga bib-numren är kontiguösa per klass, exempelvis
 * för H21 är giltiga bib-numren mellan 201 och 245.
 *
 * @param {string} klass - En av strängarna "H21", "D21", "H20", "D20", "H18", "D18".
 * @param {number} bibnumber - Det riktiga bib-numret (det som faktiskt skrivs ut) inom
 *                             klassens giltiga intervall.
 * @param {number} [customInterval] - (Valfritt) Om du vill använda ett annat intervall än standard (i sekunder).
 * @returns {string} Starttiden som HH:MM:SS.
 */
function calculateStartTime(klass, bibnumber, customInterval) {
  if (!raceConfig.hasOwnProperty(klass)) {
    throw new Error("Okänd tävlingsklass: " + klass);
  }
  const config = raceConfig[klass];

  // Bestäm giltigt bib-nummerintervall för klassen.
  const minBib = config.baseBib;
  const maxBib = config.baseBib + 44; // Eftersom det finns 45 löpare
  if (bibnumber < minBib || bibnumber > maxBib) {
    throw new Error(
      `Bib-numret för klass ${klass} måste vara mellan ${minBib} och ${maxBib}`
    );
  }

  // Räkna ut löpnummer baserat på bib-numret:
  // Exempel: För H21 med baseBib 201, ett bibnumber 207 blir löpnummer = 207 - 201 + 1 = 7.
  const lopnummer = bibnumber - config.baseBib + 1;

  // Använd customInterval om det anges; annars standardvärdet.
  const intervalSec =
    typeof customInterval === "number" ? customInterval : config.interval;
  // Säkerställ att intervallet ligger mellan 60 (1 minut) och 300 (5 minuter) sekunder.
  if (intervalSec < 60 || intervalSec > 300) {
    throw new Error("Intervallet måste vara mellan 60 och 300 sekunder");
  }

  // Konvertera den första starttiden (HH:MM) till sekunder från midnatt.
  const [hourStr, minStr] = config.firstStart.split(":");
  const startHour = parseInt(hourStr, 10);
  const startMinute = parseInt(minStr, 10);
  const firstStartSec = startHour * 3600 + startMinute * 60;

  // Beräkna starttiden för löparen:
  // För löpare 1 används firstStartSec och för varje efterföljande löpare adderas (lopnummer - 1) * intervalSec.
  const runnerStartSec = firstStartSec + (lopnummer - 1) * intervalSec;

  // Omvandla sekunder till HH:MM:SS.
  const resultHour = Math.floor(runnerStartSec / 3600);
  const resultMinute = Math.floor((runnerStartSec % 3600) / 60);
  const resultSecond = runnerStartSec % 60;

  return `${pad(resultHour)}:${pad(resultMinute)}:${pad(resultSecond)}`;
}

/**
 * Returnerar tävlingsklass för ett givet bib-nummer.
 *
 * För varje klass i raceConfig:
 *   - H21: bib 201–245
 *   - D21: bib 101–145
 *   - H20: bib 401–445
 *   - D20: bib 301–345
 *   - H18: bib 601–645
 *   - D18: bib 501–545
 *
 * @param {number} bibNumber - Det riktiga bib-numret att kolla.
 * @returns {string} Tävlingsklassen som bib-numret hör till (t.ex. "H21").
 * @throws {Error} Om bib-numret inte matchar något giltigt intervall.
 */
function getClassForBibNumber(bibNumber) {
  // Iterera över de konfigurerade tävlingsklasserna
  for (const klass in raceConfig) {
    if (raceConfig.hasOwnProperty(klass)) {
      const minBib = raceConfig[klass].baseBib;
      const maxBib = minBib + 44; // 45 bibnummer per klass
      if (bibNumber >= minBib && bibNumber <= maxBib) {
        return klass;
      }
    }
  }
  throw new Error("Bib-numret " + bibNumber + " matchar ingen tävlingsklass.");
}

/**
 * Beräknar löptiden (running time) för en löpare utifrån aktuell tid och starttiden.
 * Om aktuell tid är tidigare än starttiden (dvs. det har gått nästan ett helt dygn),
 * så beräknas tiden som (currentSeconds + (86400 - startSeconds)) mod 86400, vilket ger ett maximum
 * på 23:59:59. När exakt 24 timmar passerat (alltså aktuellt klockslag = starttid) återställs timern till 0.
 *
 * @param {number} bibNumber - Det bib-nummer som löparen har.
 * @param {number} [customInterval] - (Valfritt) Eventuellt custom intervall att skicka vidare till calculateStartTime.
 * @returns {string} Löptiden i formatet HH:MM:SS.
 */
function calculateRunningTime(bibNumber, customInterval) {
  // Hämta vilken klass bib-nummer hör till.
  const klass = getClassForBibNumber(bibNumber);
  // Beräkna starttiden i formatet HH:MM:SS för löparen.
  const startTidStr = calculateStartTime(klass, bibNumber, customInterval);

  // Hämta aktuell tid (sekunder sedan midnatt)
  const now = new Date();
  const currentSeconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  // Omvandla starttiden (HH:MM:SS) till totala sekunder från midnatt.
  const [startH, startM, startS] = startTidStr
    .split(":")
    .map((num) => parseInt(num, 10));
  const startSeconds = startH * 3600 + startM * 60 + startS;

  // Beräkna skillnaden med modulo 86400 (antal sekunder på ett dygn)
  // Om aktuell tid är lägre än starttiden innebär det att loppet pågår från föregående dygn,
  // därmed får vi: elapsed = (currentSeconds + (86400 - startSeconds)).
  // När skillnaden når 86400 (alltså 24 timmar) återställs klockan till 0.
  const elapsedSeconds = (currentSeconds - startSeconds + 86400) % 86400;

  // Omvandla elapsedSeconds till HH:MM:SS
  /*
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  if (formatAsString) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  */
  return elapsedSeconds;
}

/* -------------------------------
   Exempelanvändning:
------------------------------- */

/*
try {
  // Exempel 1: För klass H21, om bib-numret är 207 blir löpnummer:
  // 207 - 201 + 1 = 7, och starttiden beräknas därefter.
  const klass1 = "H21";
  const bib1 = 207;
  const startTid1 = calculateStartTime(klass1, bib1);
  console.log(`Klass ${klass1} - Bib ${bib1} startar kl. ${startTid1}`);

  // Exempel 2: Använd ett custom intervall (t.ex. 90 sekunder) för klass D21.
  // Giltigt bibnummer för D21 är mellan 101 och 145. Väljer t.ex. bib 107:
  const klass2 = "D21";
  const bib2 = 107; // Löparen blir då löpnummer 107 - 101 + 1 = 7.
  const customInterval = 90;
  const startTid2 = calculateStartTime(klass2, bib2, customInterval);
  console.log(`Klass ${klass2} - Bib ${bib2} startar kl. ${startTid2}`);
} catch (error) {
  console.error(error);
}

*/

/* -------------------------------
     Exempelanvändning:
  ------------------------------- */

/*
try {
  // Exempel 1: Beräkna starttid och bib-nummer för löpare 7 i H21 med standardintervall
  const klass = "H21";
  const lopnummer = 7;
  const startTid = calculateStartTime(klass, lopnummer);
  const bibNummer = calculateBibNumber(klass, lopnummer);
  console.log(
    `Klass ${klass} - Löpnummer ${lopnummer} startar kl. ${startTid} med bib ${bibNummer}`
  );

  // Exempel 2: Om du vill använda ett custom intervall, t.ex. 90 sekunder, för D21:
  const customInterval = 90;
  const klass2 = "D21";
  const lopnummer2 = 7;
  const startTidCustom = calculateStartTime(klass2, lopnummer2, customInterval);
  const bibNummer2 = calculateBibNumber(klass2, lopnummer2);
  console.log(
    `Klass ${klass2} - Löpnummer ${lopnummer2} startar kl. ${startTidCustom} med bib ${bibNummer2}`
  );
} catch (error) {
  console.error(error);
}
*/

/* -------------------------------
   Exempelanvändning:
------------------------------- */

/*
try {
  // Exempel: Bib-nummer 207 hör till H21 (eftersom H21 har bib 201-245)
  const bib = 207;
  const klass = getClassForBibNumber(bib);
  console.log(`Bib ${bib} tillhör tävlingsklassen ${klass}`);
} catch (error) {
  console.error(error);
}
*/

/* -------------------------------
   Exempelanvändning:
------------------------------- */

// Antag att vi har en löpare från API:t med bib 207 och att starttiden
// beräknas med calculateStartTime(getClassForBibNumber(207), 207)
/*
const bib = 207;
const runningTime = calculateRunningTime(bib);
console.log(`Löptid för bib ${bib}: ${runningTime}`);
*/
