// Variables
const TEXT_OFFSET = 5; // Adjust as needed
const CHAR_SIZE = 9.594; // Pixel width per character

// 20 chars
// 191.5px
// 20 chars * 9.1203 = 182.406
// 182.406 + 10.094
const prefixText = `[t1]you[/t1][t2]@[/t2][t3]guest- $ [/t3]`;
// End of variables

const output = document.getElementById("output");
const input = document.getElementById("terminalInput");
const prefix = document.getElementById("prefix");
const autocomplete = document.querySelector("div#autocomplete");
let lengthOfPrefix = 0;

let availableCommands = [
  "about",
  "help",
  "skills",
  "clear",
  "social",
  "",
  "projects",
  // Add more commands as necessary
]; // Sets the available commands for the red stuff to work.

let advancedAvailableCommands = [" "];

let commands = [];
let backIndex = 0;

const welcomeMessage = `
<img src="./baradika.jpg" alt="Welcome Image" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" />
<p style="text-align: center;">Welcome to my terminal!</p>
<p style="text-align: center;">You can use the <span class="click" onclick="handleHelpCommand()">help</span> command to get assistance with the commands in this terminal!</p>
`;

// Function to handle displaying the welcome message
function displayWelcomeMessage() {
    const output = document.getElementById("output");
    const messageElement = document.createElement("div");
    messageElement.innerHTML = welcomeMessage;
    output.appendChild(messageElement);
}



// Function to add raw line of text to output
function addRawLine(text) {
  output.innerHTML += text;
}

// Function to apply color formatting to text
function colorize(text) {
  let colorizedText = text;

  // Customize color tags
  colorizedText = colorizedText
    .replaceAll("[cr]", '<div class="colour red-stuff">')
    .replaceAll("[/cr]", "</div>") // RED
    .replaceAll("[cb]", '<div class="colour blue-stuff">')
    .replaceAll("[/cb]", "</div>") // BLUE
    .replaceAll("[cy]", '<div class="colour yellow-stuff">')
    .replaceAll("[/cy]", "</div>") // YELLOW
    .replaceAll("[cg]", '<div class="colour green-stuff">')
    .replaceAll("[/cg]", "</div>") // GREEN
    .replaceAll("[clb]", '<div class="colour lightblue-stuff">')
    .replaceAll("[/clb]", "</div>") // LIGHT BLUE
    .replaceAll("[clg]", '<div class="colour lightgreen-stuff">')
    .replaceAll("[/clg]", "</div>") // LIGHT GREEN
    .replaceAll("[t1]", '<div class="colour term1-stuff">')
    .replaceAll("[/t1]", "</div>")
    .replaceAll("[t2]", '<div class="colour term2-stuff">')
    .replaceAll("[/t2]", "</div>")
    .replaceAll("[t3]", '<div class="colour term3-stuff">')
    .replaceAll("[/t3]", "</div>");

  // Handling clickable elements
  const clickableMatches = colorizedText.match(/\[click-\w+\]/g);
  if (clickableMatches) {
    clickableMatches.forEach((element) => {
      const cmdName = element.replace("[click-", "").replace("]", "");
      colorizedText = colorizedText.replaceAll(
        `[click-${cmdName}]`,
        `<div class='inline click' woofclick='${cmdName}'>`
      );
    });
  }

  // Handling links
  const linkMatches = colorizedText.match(/\[link-https?:\/\/[^\s]+]/g);
  if (linkMatches) {
    linkMatches.forEach((element) => {
      const linkUrl = element.replace("[link-", "").replace("]", "");
      colorizedText = colorizedText.replaceAll(
        `[link-${linkUrl}]`,
        `<a href="${linkUrl}" target="_blank">`
      );
    });
  }

  colorizedText = colorizedText.replaceAll("[/link]", "</a>");
  colorizedText = colorizedText.replaceAll("[/click]", "</div>");
  colorizedText = colorizedText.replaceAll("[n/]", "<br/>");
  colorizedText = colorizedText.replaceAll("[s/]", "&nbsp;");

  return colorizedText;
}

// Function to add a line of text to output with formatting
function addLine(text) {
  addRawLine('<div class="line">' + colorize(text) + "</div>");
}

// Function to clear the terminal output
function clearOutput() {
  const lines = output.innerHTML.split("<br/>"); // Split lines by line breaks
  if (lines.length > 1 && lines[0] === welcomeMessage) {
    // If the first line is the welcome message, keep it
    output.innerHTML = `<div class="line">${welcomeMessage}</div>`; // Keep only the welcome message
  } else {
    output.innerHTML = ""; // Otherwise, clear all lines
  }
}

function addLine(text) {
  if (output.innerHTML.indexOf(welcomeMessage) === -1) {
    output.innerHTML += `<div class="line">${colorize(text)}</div>`;
  }
}

// Function to set the input field value
function setInput(text) {
  input.value = text;
  setTimeout(() => {
    input.selectionStart = input.selectionEnd = 10000;
  }, 0);
  input.dispatchEvent(new Event("input"));
}

// Function to refocus the input field
function refocus() {
  input.focus();
}

// Function to check if a string starts with any of the substrings
function checkIfStringStartsWith(str, substrs) {
  return substrs.some((substr) => str.startsWith(substr));
}

// Function to check if a command exists
function commandExists(command) {
  return (
    availableCommands.includes(command) ||
    checkIfStringStartsWith(command, advancedAvailableCommands)
  );
}

// Function to add a command line to the terminal
function addCommandLine() {
  const doesCommandExist = commandExists(input.value);
  addLine(
    prefixText +
      (doesCommandExist
        ? input.value
        : `<div class='error inline'>${input.value}</div>`)
  );
}

// Function to  a new tab with the given URL
function Tab(url) {
  window.open(url, "_blank").focus();
}

// Function to provide help for commands
function helpCommand(cmd, desc) {
  addLine(`[clb][click-${cmd}]${cmd}[/click][/clb][n/]${desc}`);
}

// Function to get the length of formatted text
function stextLength(text) {
  const cleanText = colorize(text).replace(/<\/?[^>]+(>|$)/g, "");
  return cleanText.length;
}


clearOutput();

prefix.innerHTML = colorize(prefixText);

// Function to handle advanced commands
function advancedCommands(cmd) {
  let [command, ...args] = cmd.split(" ");

  switch (command) {
    case "":
      addLine(`[cg]ing ${args.join("%20") || "nothing??"}...[/cg]`);
      Tab(args.join("%20"));
      break;
    default:
      return false;
  }
  return true;
}

// Function to handle commands entered in the terminal
function commandHandler(command, cmdline = true) {
  if (cmdline) addCommandLine();
  backIndex = 0;

  switch (command.trim().toLowerCase()) {
    case "about":
      addLine(
        "An average student in SMK Negeri 24 Jakarta, Software Engineering. " +
        "I like using Linux and also get easily excited about cybersecurity. " +
        "If you want to ask anything about cybersecurity, feel free to ask me!"
      );
      break;

    case "projects":
      addLine(
        "[n/][clb]BaraBara project: [link-https://github.com/baradika/barabara-marketplace]BaraBara Marketplace[/link][/clb][n/]" +
        "[n/][clb]Honeypot project: [link-https://github.com/baradika/web-honeypot-simulation]Simple Honeypot Simulation[/link][/clb][n/]"
      );
      break;

      case "help":
        helpCommand("about", "- About me lol");
        helpCommand("skills", "- Skills overview");
        helpCommand("projects", "- General/Cybersecurity projects");
        helpCommand("social", "- Social media links");
        break;

        case "social":
          addLine(
            "[n/][clb]Github: [link-https://github.com/baradikae]Github (nyimpen project)[/link][/clb][n/]" +
            "[n/][clb]Medium: [link-https://medium.com/@baracarlo]Medium (buat WU CTF)[/link][/clb][n/]"
          );
          break;

    case "clear":
      clearOutput();
      refocus();
      break;

    case "skills":
      addLine(
        "[n/][cb]Skills[/cb][n/]" +
        "[clb]Python | JavaScript | PHP | Linux[/clb][n/]" +
        "[cg]Web Development, Cybersecurity, Penetration Testing, and more![/cg]"
      );
      break;



    default:
      addLine(`[cr]carlo: ${command}: command not found[/cr]`);
  }
}


  refocus();

// Add the initial welcome message
addLine(welcomeMessage);

// Attach the enter event to the input field
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    commandHandler(input.value.toLowerCase());
    setInput("");
  }
});