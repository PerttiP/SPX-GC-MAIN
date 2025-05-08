/*
 * 
 WARNING; This componenet will be DISPLAYED on the GRAPHICS PLAYOUT !!!

  Do NOT use it for production!!!
*
*/

function showCustomConfirmation(message) {
  return "DO NOT USE ME IN PRODUCTION!";

  return new Promise((resolve) => {
    // Create an overlay to darken the background.
    const overlay = document.createElement("div");
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
      `;
    document.body.appendChild(overlay);

    // Create the modal container.
    const modal = document.createElement("div");
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 20px;
        z-index: 1001;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
        max-width: 90%;
        text-align: center;
      `;
    document.body.appendChild(modal);

    // Create and append the message.
    const messagePara = document.createElement("p");
    messagePara.textContent = message;
    modal.appendChild(messagePara);

    // Create a container for the buttons.
    const btnContainer = document.createElement("div");
    btnContainer.style.marginTop = "20px";
    modal.appendChild(btnContainer);

    // Create the "Yes" button.
    const yesButton = document.createElement("button");
    yesButton.textContent = "Yes";
    yesButton.style.marginRight = "10px";
    btnContainer.appendChild(yesButton);

    // Create the "No" button.
    const noButton = document.createElement("button");
    noButton.textContent = "No";
    btnContainer.appendChild(noButton);

    // Cleanup function to remove the modal and overlay.
    function cleanup() {
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
    }

    // Event listeners to handle button clicks.
    yesButton.addEventListener("click", () => {
      cleanup();
      resolve("YES");
    });

    noButton.addEventListener("click", () => {
      cleanup();
      resolve("NO");
    });
  });
}

// Usage example (using async/await):
/*
(async function () {
  const answer = await showCustomConfirmation("Do you want to proceed?");
  console.log("The user answered:", answer);
})();
*/
