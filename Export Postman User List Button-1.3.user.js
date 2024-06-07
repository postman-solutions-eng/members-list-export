// ==UserScript==
// @name         Export Postman User List Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add Export-to-CSV functionality to Postman Enterprise's Member Overview
// @author       Karan Banwasi (originally Jared Boynton)
// @match        https://*.postman.co/reports/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function tableToCSV(headerTable, bodyTable) {
    var data = [];
    // Process header row
    var headerRow = headerTable.querySelectorAll("tr th");
    var headerData = Array.from(headerRow).map(function (th) {
      return '"' + th.innerText.replace(/"/g, '""') + '"';
    });
    data.push(headerData.join(","));

    // Process body rows
    var rows = bodyTable.querySelectorAll("tbody tr");
    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll("td");
      for (var j = 0; j < cols.length; j++) {
        var text = cols[j].innerText.replace(/"/g, '""'); // Escape double quotes
        row.push('"' + text + '"');
      }
      data.push(row.join(","));
    }
    return data.join("\n");
  }

  function downloadCSV(csv) {
    var csvFile;
    var downloadLink;

    // Create a date object and format the date and time
    var now = new Date();
    var date = now.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    var time = now.toTimeString().slice(0, 8).replace(/:/g, "-"); // Format: HH-MM-SS
    var filename = `PostmanUsers-${date}-${time}.csv`;

    csvFile = new Blob([csv], { type: "text/csv" });

    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  // Add a button to trigger the export
  var button = document.createElement("button");

  button.textContent = "Export User List to CSV";
  button.style.backgroundColor = "#323232"; // Button color
  button.style.color = "white"; // Text color
  button.style.border = "1px solid #686868"; // Button border
  button.style.borderRadius = "10px"; // Border radius
  button.style.padding = "10px 10px"; // Padding inside the button
  button.style.marginRight = "10px"; // Margin to the right
  button.style.cursor = "pointer"; // Cursor on hover

  // Align the button to the right
  var container = document.createElement("div");
  container.style.position = "fixed"; // Fixed position
  container.style.top = "65px"; // Margin from the top
  container.style.right = "15px"; // Margin from the right
  container.style.zIndex = "1000"; // Ensure it's on top of other elements
  container.appendChild(button);

  // Add hover effect
  button.onmouseover = function () {
    button.style.backgroundColor = "#FFA500"; // Orange color on hover
  };
  button.onmouseout = function () {
    button.style.backgroundColor = "#323232"; // Original color when not hovering
  };

  button.onclick = function () {
    // Adjust selectors to match your table header and body
    var headerTable = document.querySelector(
      "#listOfMembers .Table__StyledTheadWrapper-agiy0i-3 table"
    );
    var bodyTable = document.querySelector(
      "#listOfMembers .Table__StyledTbodyWrapper-agiy0i-4 table"
    );
    if (headerTable && bodyTable) {
      var csv = tableToCSV(headerTable, bodyTable);
      downloadCSV(csv, "members_list.csv");
    } else {
      alert("Table not found!");
    }
  };

  // Insert the container with the button
  document.body.appendChild(container);
})();