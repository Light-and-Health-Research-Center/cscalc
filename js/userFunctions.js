const VERSION = "2.0.0";

let thickness = 1;
let _thickness = 1;
let _mpod = 0.5,
  _t = 1,
  _d = 1,
  _p = 0;

let sourcelist;
let userSourceList = [];
let manUnique = [];
let lampUnique = [];
let cctUnique = [];
var combinedValues;

colors = ["#804080", "#408040", "#C0C040", "#C08040", "#C090A0"];
colorIdx = 0;

function getColor(iterate) {
  let color = colors[colorIdx];
  if (iterate) colorIdx = colorIdx == colors.length - 1 ? 0 : colorIdx + 1;
  return color;
}

function fillEditSourceSPD(source, together) {
  if (together) {
    str = "";
    for (let i = 0; i < source.spd.wavelength.length; i++) {
      str += `${source.spd.wavelength[i]}\t${source.spd.value[i]}\n`;
    }
    $("#edit-userSPDTogether").val(str);
  } else {
    wl = "";
    v = "";
    for (let i = 0; i < source.spd.wavelength.length; i++) {
      wl += `${source.spd.wavelength[i]}\n`;
      v += `${source.spd.value[i]}\n`;
    }
    $("#edit-userSPDWavelengths").val(wl);
    $("#edit-userSPDValues").val(v);
  }
}

function fillEditSourceModal(el) {
  let i = el.getAttribute("data-i");
  let source = sourcelist[i];
  $(".edit-change-spd-input-type").attr("data-i", i);
  $("#edit-userSourceSubmit").attr("data-i", i);
  $("#edit-userID").val(source.id);
  $("#edit-userMan").val(source.manufacturer);
  $("#edit-userCCT").val(source.cct);
  $("#edit-userLamp").val(source.lamp);
  $("#edit-userDesc").val(source.info);
  fillEditSourceSPD(source, true);
}

function uploadCustomSources() {
  $("#upload-custom-sources-errors").html("");
  let error = false;
  const files = $("#upload-custom-sources-input")[0].files;
  for (file of files) {
    if (
      (file.name.slice(-5) !== ".json" && file.name.slice(-5) !== ".JSON") ||
      file.type !== "application/json"
    ) {
      error = true;
      continue;
    }
    const reader = new FileReader();
    reader.onload = (function (aFile) {
      return function (e) {
        let json = JSON.parse(e.target.result);
        for (source of json.sources) {
          submitUserSourceFromUpload(source);
        }
      };
    })(file);

    reader.readAsText(file);
  }
  $("#upload-custom-sources-input").val("");
  if (error) {
    $("#upload-custom-sources-errors").append(
      "<p class='font-size-_75 m-0 text-red'>One or more files could not be read.</p>"
    );
  } else {
    $("#upload-sources-modal").modal("hide");
  }
}

function downloadCustomSources() {
  let download = { sources: [] };
  for (source of userSourceList) {
    download.sources.push({
      id: source.id,
      manufacturer: source.manufacturer,
      cct: source.cct,
      lamp: source.lamp,
      info: source.info,
      spd: source.spd,
      custom: "true",
    });
  }

  $("#custom-sources-download").attr(
    "href",
    "data:application/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(download, null, 2))
  );
  $("#custom-sources-download").attr("download", "Sources.json");
  $("#custom-sources-download")[0].click();
}

function addSource(sourceIdx) {
  // Activate second card step
  if ($("#stepChange2").hasClass("disabled")) {
    $("#stepChange2")
      .fadeIn(500)
      .fadeOut(500)
      .fadeIn(500)
      .fadeOut(500)
      .fadeIn(500);
    $("#stepChange2").removeClass("disabled");
    $("#continue-to-calculations-button").removeClass("d-none");
    $("#continue-to-calculations-button")
      .fadeIn(500)
      .fadeOut(500)
      .fadeIn(500)
      .fadeOut(500)
      .fadeIn(500);
  }

  // Remove selected sources empty table text
  $(".no-sources").addClass("d-none");

  // Create selected source object
  sourcelist[sourceIdx].isSelected = true;

  // Add source to selected sources list
  var div = "";
  div += '<div class="row mb-1 zebra-row">';
  div +=
    '<div id="SelectedSource_' +
    sourceIdx +
    "_" +
    '" class="selected-source_ col d-flex  justify-content-between zebra-entry">';
  div +=
    '<button class="py-0 selected-source-icon btn btn-link" type="button" data-toggle="tooltip" title="Toggle Source Info" data-i="' +
    sourceIdx +
    '"><i class="fas fa-info-circle fa-lg"></i></button>';
  div +=
    '<div class="text-truncate" data-i="' +
    sourceIdx +
    '" data-toggle="tooltip" title="' +
    sourcelist[sourceIdx].id +
    '">' +
    sourcelist[sourceIdx].id +
    "</div>";
  div +=
    '<button class="py-0 removeSource text-red pointer btn btn-link" type="button" data-toggle="tooltip" title="Remove Source" data-i="' +
    sourceIdx +
    '"><i class="fas fa-times fa-lg py-0"></i></button>';
  div += "</div></div>";
  $("#selected-sources_").append(div);

  var div = "";
  div += '<div class="row mb-1 zebra-row">';
  div +=
    '<div id="SelectedSource_' +
    sourceIdx +
    '" class="selected-source col d-flex  justify-content-between zebra-entry py-2">';
  div +=
    '<button class="py-0 selected-source-icon btn btn-link" type="button" data-toggle="tooltip" title="Toggle Source Info" data-i="' +
    sourceIdx +
    '"><i class="fas fa-info-circle fa-lg"></i></button>';
  div +=
    '<div data-i="' +
    sourceIdx +
    '" data-toggle="tooltip" title="' +
    sourcelist[sourceIdx].id +
    '" class="text-truncate">' +
    sourcelist[sourceIdx].id +
    "</div>";
  div +=
    '<div class="d-flex justify-content-end"><input oninput="handleLuxChangeFocus()" onfocusout="handleLuxChangeFocusOut()" onkeydown="if(event.keyCode==13){ $(this).blur(); return false;}" id="ssIll_' +
    sourceIdx +
    '" class="form-control ssIll flex-shrink-1" placeholder="Illuminance (lx)" />';
  div +=
    '<button class="py-0 removeSource text-red pointer btn btn-link" type="button" data-toggle="tooltip" title="Remove Source" data-i="' +
    sourceIdx +
    '"><i class="fas fa-times fa-lg py-0"></i></button></div>';
  div += "</div></div>";

  $("#selected-sources").append(div);

  $('[data-toggle="tooltip"]').tooltip({
    trigger: "hover",
  });

  // Disable sourcelist button
  $("#source_" + sourceIdx).addClass("disabled");
  $("#source_" + sourceIdx).prop("disabled", true);
  updateResults();

  // Update chart dataset array
  addSourceDataset(sourcelist[sourceIdx]);
}

function addSourceDataset(source) {
  let color = getColor(true);
  var newDataset = {
    label: source.id,
    fill: false,
    lineTension: 0.1,
    backgroundColor: color,
    borderColor: color,
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: "miter",
    pointBorderColor: color,
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    radius: 0,
    data: dataTestZero,
    yAxisID: "y-axis-1",
  };
  configSPD.data.datasets.push(newDataset);
  if (configSPD.data.datasets.length == 1) {
    configSPD.data.datasets.unshift(spectralEfficiencyFunctionDataset);
    $("#spdLegendDiv").show();
    $("#crmLegendDiv").show();
    $("#chromaticityLegendDiv").show();
    $("#csInputSection").show();
  } else if (configSPD.data.datasets.length == 3) {
    configSPD.data.datasets.unshift(combinedSourceDataset);
    $("#csInputSection").hide();
  } else {
    $("#csInputSection").hide();
  }
  spdChart.update();
  document.getElementById("spdLegend").innerHTML = spdChart.generateLegend();
  $("#noSelectedSources").hide();
  $("#sources-table").show();
}

function removeSourceDataset(source) {
  for (var i = 0; i < configSPD.data.datasets.length; i++) {
    if (source.id === configSPD.data.datasets[i].label) {
      configSPD.data.datasets.splice(i, 1);
      if (
        configSPD.data.datasets.length == 1 ||
        configSPD.data.datasets.length == 3
      ) {
        configSPD.data.datasets[0].data = dataTestNan;
        configSPD.data.datasets.splice(0, 1);
        $("#csInputSection").show();
        if (configSPD.data.datasets.length == 0) {
          $("#spdLegendDiv").hide();
          $("#crmLegendDiv").hide();
          $("#chromaticityLegendDiv").hide();
          $("#noSelectedSources").show();
          $("#sources-table").hide();
          $("#csInputSection").hide();
        }
      }
    }
  }
  spdChart.update();
  document.getElementById("spdLegend").innerHTML = spdChart.generateLegend();
}

function submitUserSourceFromUpload(source) {
  var newSource = source;
  newSource.custom = "true";
  for (var i in sourcelist) {
    if (sourcelist[i].id == newSource.id) {
      $("#upload-custom-sources-errors").append(
        "<p class='font-size-_75 m-0 text-red'>Sources with duplicate ID's could not be read.</p>"
      );
      return false;
    }
  }
  applyNewSource(sourcelist.length, newSource, true);
  updateSortSource();
  sourcelist.push(newSource);
  userSourceList.push(newSource);
  addSource(sourcelist.length - 1);
  $("#names-list").animate({ scrollTop: 0 }, 1000);
  return true;
}

function updateSourceNameAcrossHTML() {
  $(".source-item").each(function () {
    let i = $(this)[0].getAttribute("data-i");
    str = "";
    if ("custom" in sourcelist[i] && sourcelist[i].custom == "true") {
      str =
        '<div class="btn-menu"><span data-toggle="modal" data-target="#edit-custom-source-modal"><button onClick="fillEditSourceModal(this)" class="btn btn-link btn-menu-btn" type="button" data-toggle="tooltip" data-i="' +
        i +
        '" title="Edit Source"><i class="fas fa-edit"></i></button></span></div>';
    }
    $(this)[0].innerHTML = str + sourcelist[i].id;
    $('[data-toggle="tooltip"]').tooltip({
      trigger: "hover",
    });
  });

  $(".selected-source_ > div").each(function () {
    let i = $(this)[0].getAttribute("data-i");
    $(this)[0].innerHTML = sourcelist[i].id;
  });

  $(".selected-source > div.text-truncate").each(function () {
    let i = $(this)[0].getAttribute("data-i");
    $(this)[0].innerHTML = sourcelist[i].id;
  });
}

function editUserSource(el) {
  let i = el.getAttribute("data-i");
  source = sourcelist[i];
  source.id = $("#edit-userID").val();
  source.userMan = $("#edit-userMan").val();
  source.ctt = $("#edit-userCCT").val();
  source.lamp = $("#edit-userLamp").val();
  source.userDesc = $("#edit-userDesc").val();
  source.spd = readEditUserSPD().spd;

  var valueInt = interp1(
    source.spd.wavelength,
    source.spd.value,
    setwavelength,
    0
  );
  source.relativeSPD = arrayScalar(
    arrayNormalize(spdNormalize(setwavelength, valueInt)),
    1
  );
  source.selectedSource.relativeSPD = spdNormalize(setwavelength, valueInt);

  source.selectedSource.absoluteSPD = arrayScalar(
    sourcelist[i].selectedSource.relativeSPD,
    sourcelist[i].selectedSource.illuminance
  );

  if (manUnique.indexOf(source.manufacturer) == -1)
    manUnique.push(source.manufacturer);
  if (lampUnique.indexOf(source.lamp) == -1) lampUnique.push(source.lamp);
  if (cctUnique.indexOf(source.cct) == -1) cctUnique.push(source.cct);

  updateSourceNameAcrossHTML();
  updateSortSource();
  updateResults();
}

function submitUserSource() {
  var newSource = buildSourceObj();
  newSource.custom = "true";
  applyNewSource(sourcelist.length, newSource, true);
  updateSortSource();
  sourcelist.push(newSource);
  userSourceList.push(newSource);
  addSource(sourcelist.length - 1);
  $("#names-list").animate({ scrollTop: 0 }, 1000);
  $("#userID").val("");
  $("#userMan").val("");
  $("#userCCT").val("");
  $("#userLamp").val("");
  $("#userDesc").val("");
  $("#userSPDWavelengths").val("");
  $("#userSPDValues").val("");
  $("#userSPDTogether").val("");
}

function buildSourceObj() {
  var result = {
    id: $("#userID").val(),
    manufacturer: $("#userMan").val(),
    cct: $("#userCCT").val(),
    lamp: $("#userLamp").val(),
    spd: loadUserSPD(),
    info: $("#userDesc").val(),
  };
  return result;
}

function userSPDValid() {
  $("#userSPDFormGroup").removeClass("has-error");
  $("#userSPDFormGroup").addClass("has-success");

  $("#userSPDSpan").removeClass("glyphicon-pencil");
  $("#userSPDSpan").removeClass("glyphicon-remove");
  $("#userSPDSpan").removeClass("glyphicon-ok");

  $("#userSPDSpan").addClass("glyphicon-ok");
  return;
}

function userSPDInvalid() {
  $("#userSPDFormGroup").removeClass("has-success");
  $("#userSPDFormGroup").addClass("has-error");

  $("#userSPDSpan").removeClass("glyphicon-pencil");
  $("#userSPDSpan").removeClass("glyphicon-remove");
  $("#userSPDSpan").removeClass("glyphicon-ok");

  $("#userSPDSpan").addClass("glyphicon-remove");
  return;
}

function validateEditUserID() {
  var result = false;
  var editSourceID = $("#edit-userID").val();
  if (editSourceID != "") {
    result = true;
  }
  return result;
}

function validateUserID() {
  function isUniqueSourceName(newSourceID) {
    for (var i in sourcelist) {
      if (sourcelist[i].id == newSourceID) {
        return false;
      }
    }
    return true;
  }

  var result = false;
  var newSourceID = $("#userID").val();
  if ((newSourceID != "") & isUniqueSourceName(newSourceID)) {
    result = true;
  } else {
    if ($("#userSPDValues").val() != "") {
      $("#userSPDModalHelp").append(
        '<li class="alert alert-danger"><strong>Error:</strong> Must enter a unique source name</li>'
      );
    }
  }
  return result;
}

function validateEditSubmit() {
  if (validateEditUserID() && validateEditUserSPD()) {
    $("#edit-userSourceSubmit").removeClass("disabled");
    $("#edit-userSourceSubmit").prop("disabled", false);
  } else {
    $("#edit-userSourceSubmit").addClass("disabled");
    $("#edit-userSourceSubmit").prop("disabled", true);
  }
}

function validateSubmit() {
  if (validateUserID() && validateUserSPD()) {
    $("#userSourceSubmit").removeClass("disabled");
    $("#userSourceSubmit").prop("disabled", false);
  } else {
    $("#userSourceSubmit").addClass("disabled");
    $("#userSourceSubmit").prop("disabled", true);
  }
}

function readEditUserSPD() {
  var result = {};
  var validSPD = true;
  var spd = {
    wavelength: [],
    value: [],
  };
  var alertText = "";
  var userWL = [],
    userV = [];
  if (!$("#edit-userSPDSeperateContainer").hasClass("d-none")) {
    userWL = cleanSPDRows(
      $("#edit-userSPDWavelengths").val().replace(/\n/g, " ").split(" ")
    );
    userV = cleanSPDRows(
      $("#edit-userSPDValues").val().replace(/\n/g, " ").split(" ")
    );
  } else {
    var spd_arr = $("#edit-userSPDTogether").val().split("\n");
    for (let line of spd_arr) {
      if (line.trim() == "") {
        continue;
      }
      line = line
        .trim()
        .replace(/\t|\s\s+/g, " ")
        .split(" "); // replace all tabs and spaces with a single space
      if (line.length > 2) {
        alertText +=
          '<p class="font-size-_75 m-0 text-red">Invalid SPD Input</p>';
        validSPD = false;
      } else {
        userWL.push(line[0]);
        userV.push(line[1]);
      }
    }
  }

  if (userWL.length != userV.length) {
    if (
      $("#edit-userSPDValues").val() != "" ||
      $("#edit-userSPDTogether").val() != ""
    ) {
      alertText +=
        '<p class="font-size-_75 m-0 text-red">There must be the same number of wavelengths and values</p>';
    }
    validSPD = false;
  }
  if (userWL.length < 3) {
    if (
      $("#edit-userSPDValues").val() != "" ||
      $("#edit-userSPDTogether").val() != ""
    ) {
      alertText +=
        '<p class="font-size-_75 m-0 text-red">Must enter at least 3 wavelength-value pairs</p>';
    }
    validSPD = false;
  }
  if (userWL.some(notNumeric) || userV.some(notNumeric)) {
    if (
      $("#edit-userSPDValues").val() != "" ||
      $("#edit-userSPDTogether").val() != ""
    ) {
      alertText +=
        '<p class="font-size-_75 m-0 text-red">Wavelengths and values must not contain non-numeric entries</p>';
    }
    validSPD = false;
  }

  spd.wavelength = arrayParseFloat(userWL);
  spd.value = arrayParseFloat(userV);

  result = {
    valid: validSPD,
    spd: spd,
  };
  $(".editCustomSourceError").html(alertText);
  return result;
}

function readUserSPD() {
  var result = {};
  var validSPD = true;
  var spd = {
    wavelength: [],
    value: [],
  };
  var alertText = "";
  var userWL = [],
    userV = [];
  if (!$("#userSPDSeperateContainer").hasClass("d-none")) {
    userWL = cleanSPDRows(
      $("#userSPDWavelengths").val().replace(/\n/g, " ").split(" ")
    );
    userV = cleanSPDRows(
      $("#userSPDValues").val().replace(/\n/g, " ").split(" ")
    );
  } else {
    var spd_arr = $("#userSPDTogether").val().split("\n");
    for (let line of spd_arr) {
      if (line.trim() == "") {
        continue;
      }
      line = line
        .trim()
        .replace(/\t|\s\s+/g, " ")
        .split(" "); // replace all tabs and spaces with a single space
      if (line.length > 2) {
        alertText +=
          '<p class="font-size-_75 m-0 text-red">Invalid SPD Input</p>';
        validSPD = false;
      } else {
        userWL.push(line[0]);
        userV.push(line[1]);
      }
    }
  }

  if (userWL.length != userV.length) {
    if ($("#userSPDValues").val() != "" || $("#userSPDTogether").val() != "") {
      alertText +=
        '<p class="font-size-_75 m-0 text-red">There must be the same number of wavelengths and values</p>';
    }
    validSPD = false;
  }
  if (userWL.length < 3) {
    if ($("#userSPDValues").val() != "" || $("#userSPDTogether").val() != "") {
      alertText +=
        '<p class="font-size-_75 m-0 text-red">Must enter at least 3 wavelength-value pairs</p>';
    }
    validSPD = false;
  }
  if (userWL.some(notNumeric) || userV.some(notNumeric)) {
    if ($("#userSPDValues").val() != "" || $("#userSPDTogether").val() != "") {
      alertText +=
        '<p class="font-size-_75 m-0 text-red">Wavelengths and values must not contain non-numeric entries</p>';
    }
    validSPD = false;
  }

  spd.wavelength = arrayParseFloat(userWL);
  spd.value = arrayParseFloat(userV);

  result = {
    valid: validSPD,
    spd: spd,
  };
  $(".addCustomSourceError").html(alertText);
  return result;
}

function validateEditUserSPD() {
  return readEditUserSPD().valid;
}

function validateUserSPD() {
  return readUserSPD().valid;
}

function loadUserSPD() {
  var userSPDTest = readUserSPD();
  return userSPDTest.spd;
}

function cleanSPDRows(spdRows) {
  var result = [];
  for (var i = 0; i < spdRows.length; i++) {
    if (isWhitespaceNotEmpty(spdRows[i])) {
      result.push(spdRows[i]);
    }
  }
  return result;
}

function isWhitespaceNotEmpty(text) {
  var result = text.length > 0 && !!/[^\s]/.test(text);
  return result;
}

function notNumeric(n) {
  return n == "" || !(!isNaN(n) && isFinite(n));
}

function arrayParseFloat(array) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    result[i] = parseFloat(array[i]);
  }
  return result;
}

function handleEditCustomSource() {
  $("#edit-userID").on("input change paste keyup", function () {
    validateEditSubmit();
  });

  $("#edit-userSPDValues").on("input change paste keyup", function () {
    validateEditSubmit();
  });

  $("#edit-userSPDWavelengths").on("input change paste keyup", function () {
    validateEditSubmit();
  });

  $("#edit-userSPDTogether").on("input change paste keyup", function () {
    validateEditSubmit();
  });

  $(".userEnter").on("keydown", function (e) {
    //Trigger change on enter
    if (e.keyCode == 13) {
      $(this).trigger("change");
      $(this).focus().blur();
    }
  });
}

function handleAddSourceFromSourceList() {
  $(".addSource").on("click", function () {
    var sourceIdx = $(this).attr("data-i");
    addSource(sourceIdx);
  });
}

function handleCustomSource() {
  $("#userID").on("input change paste keyup", function () {
    validateSubmit();
  });

  $("#userSPDValues").on("input change paste keyup", function () {
    validateSubmit();
  });

  $("#userSPDWavelengths").on("input change paste keyup", function () {
    validateSubmit();
  });

  $("#userSPDTogether").on("input change paste keyup", function () {
    validateSubmit();
  });

  $(".userEnter").on("keydown", function (e) {
    //Trigger change on enter
    if (e.keyCode == 13) {
      $(this).trigger("change");
      $(this).focus().blur();
    }
  });
}

function handlePlotBtns() {
  $(".plot-btn").on("click", function () {
    if (!$(this).hasClass("active")) {
      $(".plot-btn").removeClass("active");
      $(this).addClass("active");
      let plotID = "#PlotArea" + $(this)[0].id.replace("plotBtn", "");
      $(".plot-area").removeClass("d-block");
      $(".plot-area").addClass("d-none");
      $(plotID).addClass("d-block");
    }
  });
}

function handleSPDBtns() {
  $(".spd-button").on("click", function () {
    if (!$(this).hasClass("active")) {
      $(".spd-button").removeClass("active");
      $(this).addClass("active");
      let containerID = "#" + $(this)[0].id.replace("Btn", "") + "Container";
      let titleWord;
      if ($(this)[0].id.replace("SpdBtn", "") == "Rel") {
        titleWord = "Relative";
      } else {
        titleWord = "Absolute";
      }
      $("#SPDModalTitleWord").html(titleWord);
      $(".spd-container").addClass("d-none");
      $(containerID).removeClass("d-none");
    }
  });
}

function handleHelpMenu() {
  $(".help-menu-list-item").on("click", function () {
    if (!$(this).hasClass("active")) {
      $(".help-menu-list-item").removeClass("active");
      $(this).addClass("active");
      let sectionID = "#help-" + $(this).data("value");
      $(".help-section").addClass("d-none");
      $(sectionID).removeClass("d-none");
    }
  });
}

function handleScrollTopOnReload() {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
}

function handleChartSize() {
  const oldSize = Chart.defaults.global.defaultFontSize;
  if (window.innerWidth <= 992) {
    Chart.defaults.global.defaultFontSize = 12;
  }
  if (window.innerWidth > 992) {
    Chart.defaults.global.defaultFontSize = 18;
  }

  if (Chart.defaults.global.defaultFontSize !== oldSize) {
    sourceSPDChart.update();
    spdChart.update();
    crmChart.update();
    chromaticityChart.update();
  }
}

function handleResize() {
  const resizeListener = () => {
    handleChartSize();
  };
  window.addEventListener("resize", resizeListener);
}

function handleLuxChangeFocus() {
  $("#lux-change-pending-container").removeClass("d-none");
}

function handleLuxChangeFocusOut() {
  $("#lux-change-pending-container").addClass("d-none");
}

function handleSourceModalDescriptionCollapse() {
  $("#sourceModalDescriptionCollapse").on("click", function () {
    if ($(this).hasClass("text-truncate")) {
      $(this)
        .attr("title", "Collapse Description")
        .tooltip("_fixTitle")
        .tooltip("show");
      $(this).removeClass("text-truncate");
    } else {
      $(this).addClass("text-truncate");
      $(this)
        .attr("title", "Expand Description")
        .tooltip("_fixTitle")
        .tooltip("show");
    }
  });
}

function handleCIEAlphaCaretDropdown() {
  $("#CIE_alpha_container").on("click", function () {
    var caret = $(".cie-alpha-caret");
    if (caret.hasClass("fa-caret-right")) {
      caret.removeClass("fa-caret-right");
      caret.addClass("fa-caret-down");
    } else {
      caret.removeClass("fa-caret-down");
      caret.addClass("fa-caret-right");
    }
  });
}

function handleDownloadMetrics() {
  $("#download-metrics").on("click", function () {
    var str =
      "Nothing Here. Check to make soure you've added one or more sources.";
    if (combinedValues) {
      str = "";
      str += `CS\t${combinedValues.CS.toFixed(3)}\n`;
      str += `CLA 2.0\t${combinedValues.CLA.toFixed()}\n`;
      str += `Illuminance\t${combinedValues.absoluteIll}\n`;
      str += `Irradiance\t${combinedValues.Irr.toExponential(4)}\n`;
      str += `Photon Flux\t${combinedValues.pf.toExponential(4)}\n`;
      str += `EML\t${combinedValues.EML.toFixed()}\n`;
      str += `CCT\t${combinedValues.CCT.toFixed()}\n`;
      str += `Duv\t${combinedValues.Duv.toFixed(3)}\n`;
      str += `CRI\t${combinedValues.CRI.toFixed(1)}\n`;
      str += `GAI\t${combinedValues.GAI.toFixed(1)}\n`;
      str += `Chromaticity Coordinates\t(${combinedValues.x.toFixed(
        4
      )}, ${combinedValues.y.toFixed(4)})\n`;
      str += `CIE S-cone Irradiance\t${combinedValues.CIE_S_cone_opic_irr.toExponential(
        4
      )}\n`;
      str += `CIE M-cone Irradiance\t${combinedValues.CIE_M_cone_opic_irr.toExponential(
        4
      )}\n`;
      str += `CIE L-cone Irradiance\t${combinedValues.CIE_L_cone_opic_irr.toExponential(
        4
      )}\n`;
      str += `CIE Rhodopic Irradiance\t${combinedValues.CIE_Rhodopic_irr.toExponential(
        4
      )}\n`;
      str += `CIE Melanopic Irradiance\t${combinedValues.CIE_Melanopic_irr.toExponential(
        4
      )}\n`;
    }

    $("#metrics-download").attr(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(str)
    );
    $("#metrics-download").attr("download", "Metrics.txt");
    $("#metrics-download")[0].click();
  });
}

function handleDownloadSPDs() {
  $("#download-relative-spd").on("click", function () {
    var str = "Nothing here. Check to make sure you've added sources.";
    if (combinedValues) {
      str = "";
      var wl, v, i;
      for (i = 0; i < combinedValues.relativeSPD.wavelength.length; i++) {
        wl = combinedValues.relativeSPD.wavelength[i];
        v = combinedValues.relativeSPD.value[i];
        str += `${wl}\t${v}\n`;
      }
    }

    $("#spd-download").attr(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(str)
    );
    $("#spd-download").attr("download", "Relative SPD.txt");
    $("#spd-download")[0].click();
  });

  $("#download-absolute-spd").on("click", function () {
    var str = "Nothing here. Check to make sure you've added sources.";

    if (combinedValues) {
      str = "";
      var wl, v, i;
      for (i = 0; i < combinedValues.absoluteSPD.wavelength.length; i++) {
        wl = combinedValues.absoluteSPD.wavelength[i];
        v = combinedValues.absoluteSPD.value[i];
        str += `${wl}\t${v}\n`;
      }
    }

    $("#spd-download").attr(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(str)
    );
    $("#spd-download").attr("download", "Absolute SPD.txt");
    $("#spd-download")[0].click();
  });
}

function handleChangeSPDInputType() {
  $(".change-spd-input-type").on("click", function () {
    if ($(".change-spd-input-type").hasClass("fa-toggle-on")) {
      $("#userSPDTogetherContainer").removeClass("d-none");
      $("#userSPDWavelengths").val("");
      $("#userSPDValues").val("");
      $("#userSPDSeperateContainer").addClass("d-none");
      $(".change-spd-input-type")
        .removeClass("fa-toggle-on")
        .addClass("fa-toggle-off");
    } else {
      $("#userSPDSeperateContainer").removeClass("d-none");
      $("#userSPDTogetherContainer").addClass("d-none");
      $("#userSPDTogether").val("");
      $(".change-spd-input-type")
        .removeClass("fa-toggle-off")
        .addClass("fa-toggle-on");
    }
  });

  $(".edit-change-spd-input-type").on("click", function () {
    let i = $(".edit-change-spd-input-type").attr("data-i");
    if ($(".edit-change-spd-input-type").hasClass("fa-toggle-on")) {
      fillEditSourceSPD(sourcelist[i], true);
      $("#edit-userSPDTogetherContainer").removeClass("d-none");
      $("#edit-userSPDWavelengths").val("");
      $("#edit-userSPDValues").val("");
      $("#edit-userSPDSeperateContainer").addClass("d-none");
      $(".edit-change-spd-input-type")
        .removeClass("fa-toggle-on")
        .addClass("fa-toggle-off");
    } else {
      fillEditSourceSPD(sourcelist[i], false);
      $("#edit-userSPDSeperateContainer").removeClass("d-none");
      $("#edit-userSPDTogetherContainer").addClass("d-none");
      $("#edit-userSPDTogether").val("");
      $(".edit-change-spd-input-type")
        .removeClass("fa-toggle-off")
        .addClass("fa-toggle-on");
    }
  });
}

function sourceListModal(i) {
  var source = sourcelist[i];
  $("#source-modal-label").html(" " + source.id);
  $("#source-lamptype").html(source.lamp);
  $("#source-cct").html(source.cct);
  $("#source-manufacturer").html(source.manufacturer);
  $("#source-info").html(source.info);
  $("#source-add").attr("data-i", i);
  $("#source-modal-footer").removeClass("d-none");

  sourceData = [];
  for (i = 0; i < source.relativeSPD.length; i++) {
    sourceData[i] = {
      x: setwavelength[i],
      y: source.relativeSPD[i],
    };
  }

  let color = getColor(false);
  var sourceSPD = {
    label: source.id,
    fill: false,
    lineTension: 0.1,
    backgroundColor: color,
    borderColor: color,
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: "miter",
    pointBorderColor: color,
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    radius: 0,
    data: sourceData,
    yAxisID: "y-axis-1",
  };

  configSourceSPD.data.datasets[0] = sourceSPD;
  sourceSPDChart.update();
  $("#source-modal").modal("show");
}

function updateResults() {
  combinedValues = ssAbsoluteSPDCalc();
  combinedValues.relativeSPD = {
    wavelength: setwavelength,
    value: spdNormalize(setwavelength, combinedValues.absoluteSPD.value),
  };
  // Calculate CLA and CS Values based on macular thickness range
  combinedValues.CLA = CLAcalc(combinedValues.absoluteSPD, thickness * 2);
  combinedValues.CS = cla2cs(combinedValues.CLA);

  // Calculate Melanopic Lux
  combinedValues.EML = EMLcalc(combinedValues.absoluteSPD);

  // Calculate Spectral Irradiance
  combinedValues.Irr = combinedValues.absoluteSPD.value.sum() * 2;

  // Calculate photon flux
  combinedValues.pf =
    arrayDiv(
      combinedValues.absoluteSPD.value,
      arrayInverse(
        arrayScalar(
          combinedValues.absoluteSPD.wavelength,
          1e-9 / 1.9865275648e-25
        )
      )
    ).sum() * 2;

  // Calculate color metrics
  combinedValues.CCT = CCTcalc(combinedValues.relativeSPD);
  combinedValues.CRI = CRIcalc(combinedValues.relativeSPD);
  combinedValues.GAI = GAIcalc(combinedValues.relativeSPD);
  combinedValues.Duv = DuvCalc(combinedValues.relativeSPD);

  // Calculate color cordinates
  var ccVals = chromaticityCoordinatesCalc(combinedValues.absoluteSPD);
  combinedValues.x = ccVals.x;
  combinedValues.y = ccVals.y;

  // Calculate Spectral Efficiency Function
  var rodSat0 = 0.1088;
  var test = {
    spd: combinedValues.relativeSPD,
    thickness: thickness * 2,
  };
  var rodSat = fmin(prepGenerateCircadianSpectralResponceForSPD, test, rodSat0);
  var sefObj = generateCircadianSpectralResponceForSPD(
    test.spd,
    test.thickness,
    rodSat
  );
  if (sefObj.cool) {
    spectralEfficiencyFunctionDataset.label =
      "Relative Spectral Contribution of the Circadian Response*: Cool";
    spectralEfficiencyFunctionDataset.backgroundColor = "rgba(0,0,192,1)";
    spectralEfficiencyFunctionDataset.borderColor = "rgba(0,0,192,1)";
    spectralEfficiencyFunctionDataset.pointBorderColor = "rgba(0,0,192,1)";
  } else {
    spectralEfficiencyFunctionDataset.label =
      "Relative Spectral Contribution of the Circadian Response*: Warm";
    spectralEfficiencyFunctionDataset.backgroundColor = "rgba(192,0,0,1)";
    spectralEfficiencyFunctionDataset.borderColor = "rgba(192,0,0,1)";
    spectralEfficiencyFunctionDataset.pointBorderColor = "rgba(192,0,0,1)";
  }

  // Update Results Section HTML
  $("#resultIll").html(combinedValues.absoluteIll);
  $("#resultEML").html(combinedValues.EML.toFixed());
  $("#resultCLA").html(combinedValues.CLA.toFixed());
  $("#resultCS").html(combinedValues.CS.toFixed(3));
  $("#resultCCT").html(combinedValues.CCT.toFixed());
  $("#resultDuv").html(combinedValues.Duv.toFixed(3));
  $("#resultCRI").html(combinedValues.CRI.toFixed(1));
  $("#resultGAI").html(combinedValues.GAI.toFixed(1));
  $("#resultXY").html(
    combinedValues.x.toFixed(4) + ", " + combinedValues.y.toFixed(4)
  );
  $("#resultIrr").html(combinedValues.Irr.toExponential(4));

  $("#resultCIE_S").html(combinedValues.CIE_S_cone_opic_irr.toExponential(4));
  $("#resultCIE_M").html(combinedValues.CIE_M_cone_opic_irr.toExponential(4));
  $("#resultCIE_L").html(combinedValues.CIE_L_cone_opic_irr.toExponential(4));
  $("#resultCIE_Rhod").html(combinedValues.CIE_Rhodopic_irr.toExponential(4));
  $("#resultCIE_Mela").html(combinedValues.CIE_Melanopic_irr.toExponential(4));

  $("#resultPf").html(combinedValues.pf.toExponential(4));

  var normSPDVals = arrayNormalize(combinedValues.absoluteSPD.value);

  // Update Relative SPD HTML
  $("#RelSpdContainer").empty();
  var row, wave, val;
  for (var i = 0; i < combinedValues.relativeSPD.wavelength.length; i++) {
    row = "";
    row += '<div class="row mb-1 zebra-row">';
    row += '  <div class="col d-flex justify-content-around zebra-entry">';
    row +=
      '    <div class="spd-wl">' +
      combinedValues.relativeSPD.wavelength[i] +
      "</div>";
    row +=
      '    <div class="spd-value">' +
      normSPDVals[i].toExponential(4) +
      "</div>";
    row += "  </div>";
    row += "</div>";
    $("#RelSpdContainer").append(row);
  }

  // Update Absolute SPD HTML
  $("#AbsSpdContainer").empty();
  for (i = 0; i < combinedValues.absoluteSPD.wavelength.length; i++) {
    row = "";
    row += '<div class="row mb-1 zebra-row">';
    row += '  <div class="col d-flex justify-content-around zebra-entry">';
    row +=
      '    <div class="spd-wl">' +
      combinedValues.absoluteSPD.wavelength[i] +
      "</div>";
    row +=
      '    <div class="spd-value">' +
      combinedValues.absoluteSPD.value[i].toExponential(4) +
      "</div>";
    row += "  </div>";
    row += "</div>";
    $("#AbsSpdContainer").append(row);
  }

  //Update Chart Combined SPD
  //spdChart.data.datasets[0].label = 'Combined Source SPD'
  var dataValue;
  var dataTest;
  var j, k;
  for (i = 0; i < sourcelist.length; i++) {
    if (sourcelist[i].isSelected) {
      for (j = 0; j < configSPD.data.datasets.length; j++) {
        if (sourcelist[i].id === configSPD.data.datasets[j].label) {
          dataValue = arrayScalar(
            arrayNormalize(sourcelist[i].selectedSource.relativeSPD),
            sourcelist[i].selectedSource.illuminance /
              combinedValues.absoluteIll
          );
          dataTest = {};
          dataTest.backgroundColor = "green";
          for (k = 0; k < setwavelength.length; k++) {
            dataTest[k] = {
              x: setwavelength[k],
              y: dataValue[k],
            };
          }
          configSPD.data.datasets[j].data = dataTest;
        }
      }
    }
  }

  // Update SEF
  if (configSPD.data.datasets.length > 0) {
    dataValue = arrayNormalize(sefObj.specRespMinusRod);
    dataTest = [];
    for (k = 0; k < setwavelength.length; k++) {
      dataTest[k] = {
        x: setwavelength[k],
        y: dataValue[k],
      };
    }

    if (configSPD.data.datasets.length > 2) {
      configSPD.data.datasets[1].data = dataTest;
    } else {
      configSPD.data.datasets[0].data = dataTest;
    }
  }

  // Update Combined
  if (configSPD.data.datasets.length > 2) {
    dataValue = normSPDVals;
    dataTest = [];
    for (k = 0; k < setwavelength.length; k++) {
      dataTest[k] = {
        x: setwavelength[k],
        y: dataValue[k],
      };
    }
    configSPD.data.datasets[0].data = dataTest;
  }
  spdChart.update();
  document.getElementById("spdLegend").innerHTML = spdChart.generateLegend();

  // Update CRM Plot
  configCRM.data.datasets[0].data[0].x = combinedValues.CRI;
  configCRM.data.datasets[0].data[0].y = combinedValues.GAI;
  if (combinedValues.CRI < 30) {
    configCRM.options.scales.xAxes[0].ticks.min = -100;
  } else {
    configCRM.options.scales.xAxes[0].ticks.min = 20;
  }

  crmChart.update();
  document.getElementById("crmLegend").innerHTML = crmChart.generateLegend();

  // Update Chromaticity Plot
  configChromaticity.data.datasets[0].data[0].x = combinedValues.x;
  configChromaticity.data.datasets[0].data[0].y = combinedValues.y;
  if (
    combinedValues.x > 0.3 &&
    combinedValues.x < 0.5 &&
    combinedValues.y > 0.3 &&
    combinedValues.y < 0.5
  ) {
    configChromaticity.options.scales.xAxes[0].ticks.min = 0.3;
    configChromaticity.options.scales.xAxes[0].ticks.max = 0.5;
    configChromaticity.options.scales.xAxes[0].ticks.stepSize = 0.05;
    configChromaticity.options.scales.yAxes[0].ticks.min = 0.3;
    configChromaticity.options.scales.yAxes[0].ticks.max = 0.5;
    configChromaticity.options.scales.yAxes[0].ticks.stepSize = 0.05;
  } else {
    configChromaticity.options.scales.xAxes[0].ticks.min = 0.0;
    configChromaticity.options.scales.xAxes[0].ticks.max = 0.9;
    configChromaticity.options.scales.xAxes[0].ticks.stepSize = 0.1;
    configChromaticity.options.scales.yAxes[0].ticks.min = 0.0;
    configChromaticity.options.scales.yAxes[0].ticks.max = 0.9;
    configChromaticity.options.scales.yAxes[0].ticks.stepSize = 0.1;
  }
  chromaticityChart.update();
  document.getElementById("chromaticityLegend").innerHTML =
    chromaticityChart.generateLegend();

  return;
}

function applyNewSource(i, el, custom) {
  // Expand the source object
  el.isSelected = false;
  console.log(setwavelength);
  var valueInt = interp1(el.spd.wavelength, el.spd.value, setwavelength, 0);
  el.relativeSPD = arrayScalar(
    arrayNormalize(spdNormalize(setwavelength, valueInt)),
    1
  );
  el.selectedSource = {
    relativeSPD: spdNormalize(setwavelength, valueInt),
    illuminance: 0,
    absoluteSPD: arrayScalar(setwavelength, 0),
  };

  if (manUnique.indexOf(el.manufacturer) == -1) manUnique.push(el.manufacturer);
  if (lampUnique.indexOf(el.lamp) == -1) lampUnique.push(el.lamp);
  if (cctUnique.indexOf(el.cct) == -1) cctUnique.push(el.cct);

  // Create Source list item
  var li =
    '<li id="source_' +
    i +
    '" class="list-group-item text-center source-item" data-i="' +
    i +
    '">';
  if (el.custom === "true") {
    li +=
      '<div class="btn-menu"><span data-toggle="modal" data-target="#edit-custom-source-modal"><button onClick="fillEditSourceModal(this)" class="btn btn-link btn-menu-btn" type="button" data-toggle="tooltip" data-i="' +
      i +
      '" title="Edit Source"><i class="fas fa-edit"></i></button></span></div>';
  }
  li += el.id + "</li>";

  if (custom) {
    $("#names-list").prepend(li);

    $(".source-item:first-child").on("click", function (e) {
      if ($(e.target).is("li")) {
        if (!$(this).hasClass("disabled")) {
          var i = $(this).attr("data-i");
          sourceListModal(i);
        }
      }
    });
  } else {
    $("#names-list").append(li);

    $(".source-item:last-child").on("click", function () {
      var i = $(this).attr("data-i");
      sourceListModal(i);
    });
  }

  $('[data-toggle="tooltip"]').tooltip({
    trigger: "hover",
  });

  //Append arrays
}

function updateSortSource() {
  // Clear previous values
  $("#manufacterer").empty();
  $("#lamp").empty();
  $("#cct").empty();

  // Update sort options.
  manUnique.sort();
  lampUnique.sort();
  cctUnique.sort();

  // Move Other to end
  manUnique.toEnd("Other");
  lampUnique.toEnd("Other");
  cctUnique.toEnd("Other");

  // Move Any to front
  manUnique.toFront("Any");
  lampUnique.toFront("Any");
  cctUnique.toFront("Any");

  // Update inner HTML
  $(manUnique).each(function (i, el) {
    var opt = document.createElement("option");
    opt.innerHTML = el;
    $("#manufacterer")[0].appendChild(opt);
  });

  $(lampUnique).each(function (i, el) {
    var opt = document.createElement("option");
    opt.innerHTML = el;
    $("#lamp")[0].appendChild(opt);
  });

  $(cctUnique).each(function (i, el) {
    var opt = document.createElement("option");
    opt.innerHTML = el;
    $("#cct")[0].appendChild(opt);
  });
}

function handleSources() {
  $(sourcelist).each(function (i, el) {
    applyNewSource(i, el, false);
  });
  updateSortSource();

  $(".sortSource").change(function () {
    for (var i = 0; i < sourcelist.length; i++) {
      $("#source_" + i).hide();
    }
    $("#noAvailableSources").show();

    var manSelected = $("#manufacterer option:selected").text();
    var cctSelected = $("#cct option:selected").text();
    var lampSelected = $("#lamp option:selected").text();

    var searchVal = $("#searchSource").val().toLocaleLowerCase();

    for (i = 0; i < sourcelist.length; i++) {
      var j, k;
      // Sort using the dropdown menus
      var manTest =
        manSelected == "Any" || sourcelist[i].manufacturer == manSelected;
      var cctTest = cctSelected == "Any" || sourcelist[i].cct == cctSelected;
      var lampTest =
        lampSelected == "Any" || sourcelist[i].lamp == lampSelected;

      // Sort using the keyword box
      var searchTest = false;
      if (searchVal != "") {
        // Initialize Search Test
        searchTest = false;

        // Split the search string
        var searchValArray = searchVal.split(" ");

        // Search ID
        var sourceIDArray = sourcelist[i].id.toLocaleLowerCase().split(" ");
        for (j = 0; j < sourceIDArray.length; j++) {
          var isSourceID = true;
          for (k = 0; k < searchValArray.length; k++) {
            isSourceID =
              isSourceID & (sourceIDArray[j].search(searchValArray[k]) == 0);
          }
          if (isSourceID) {
            searchTest = true;
            break;
          }
        }

        // Search Manufacturer
        if (!searchTest) {
          var sourceManArray = sourcelist[i].manufacturer
            .toLocaleLowerCase()
            .split(" ");
          for (j = 0; j < sourceManArray.length; j++) {
            var isSourceMan = true;
            for (k = 0; k < searchValArray.length; k++) {
              isSourceMan =
                isSourceMan &
                (sourceManArray[j].search(searchValArray[k]) == 0);
            }
            if (isSourceMan) {
              searchTest = true;
              break;
            }
          }
        }

        // Search CCTs
        if (!searchTest) {
          var sourceCCTArray = sourcelist[i].cct.toLocaleLowerCase().split(" ");
          for (j = 0; j < sourceCCTArray.length; j++) {
            var isSourceCCT = true;
            for (k = 0; k < searchValArray.length; k++) {
              isSourceCCT =
                isSourceCCT &
                (sourceCCTArray[j].search(searchValArray[k]) == 0);
            }
            if (isSourceCCT) {
              searchTest = true;
              break;
            }
          }
        }

        // Search Lamps
        if (!searchTest) {
          var sourceLampArray = sourcelist[i].lamp
            .toLocaleLowerCase()
            .split(" ");
          for (j = 0; j < sourceLampArray.length; j++) {
            var isSourceLamp = true;
            for (k = 0; k < searchValArray.length; k++) {
              isSourceLamp =
                isSourceLamp &
                (sourceLampArray[j].search(searchValArray[k]) == 0);
            }
            if (isSourceLamp) {
              searchTest = true;
              break;
            }
          }
        }
      } else {
        searchTest = true;
      }
      if (manTest & cctTest & lampTest & searchTest) {
        $("#source_" + i).show();
        $("#noAvailableSources").hide();
      }
    }
  });

  $("#reset").on("click", function () {
    document.getElementById("manufacterer").selectedIndex = 0;
    document.getElementById("cct").selectedIndex = 0;
    document.getElementById("lamp").selectedIndex = 0;
    document.getElementById("searchSource").value = "";
    $(".sortSource").trigger("change");
    var manSelected = $("#manufacterer option:selected").text();
  });

  $(document).on("click", ".selected-source-icon", function () {
    var i = $(this).attr("data-i");

    var source = sourcelist[i];
    $("#source-modal-label").html(" " + source.id);
    $("#source-lamptype").html(source.lamp);
    $("#source-cct").html(source.cct);
    $("#source-manufacturer").html(source.manufacturer);
    $("#source-info").html(source.info);
    $("#source-add").attr("data-i", i);
    $("#source-modal-footer").addClass("d-none");

    sourceData = [];
    for (i = 0; i < source.relativeSPD.length; i++) {
      sourceData[i] = {
        x: setwavelength[i],
        y: source.relativeSPD[i],
      };
    }

    let color = getColor(false);
    var sourceSPD = {
      label: source.id,
      fill: false,
      lineTension: 0.1,
      backgroundColor: color,
      borderColor: color,
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: color,
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      radius: 0,
      data: sourceData,
      yAxisID: "y-axis-1",
    };
    configSourceSPD.data.datasets[0] = sourceSPD;
    sourceSPDChart.update();

    $("#source-modal").modal("show");
  });

  $(document).on("click", ".removeSource", function () {
    // Get Source data index
    var sourceIdx = $(this).attr("data-i");
    $(this).tooltip("dispose");

    // Remove selected source
    $("#SelectedSource_" + sourceIdx)
      .parent()
      .remove();
    $("#SelectedSource_" + sourceIdx + "_")
      .parent()
      .remove();
    sourcelist[sourceIdx].isSelected = false;
    sourcelist[sourceIdx].selectedSource.illuminance = 0;
    sourcelist[sourceIdx].selectedSource.absoluteSPD = arrayScalar(
      sourcelist[sourceIdx].selectedSource.relativeSPD,
      sourcelist[sourceIdx].selectedSource.illuminance
    );

    if ($("#selected-sources > div").length == 1) {
      $(".no-sources").removeClass("d-none");
    }

    // Enable source in sourcelist array
    $("#source_" + sourceIdx).removeClass("disabled");
    $("#source_" + sourceIdx).prop("disabled", false);
    updateResults();
    removeSourceDataset(sourcelist[sourceIdx]);
  });

  $(document).on("change", ".ssIll", function () {
    var sourceIdx = this.id.split("_")[1];
    if (this.value == "") {
      this.value = "0";
    } else if (/^\.\d*$/.test(this.value)) {
      this.value = "0".concat(this.value);
    }
    if (/^\d*\.$/.test(this.value)) {
      this.value = this.value.concat("0");
    }
    sourcelist[sourceIdx].selectedSource.illuminance = parseFloat(this.value);
    sourcelist[sourceIdx].selectedSource.absoluteSPD = arrayScalar(
      sourcelist[sourceIdx].selectedSource.relativeSPD,
      sourcelist[sourceIdx].selectedSource.illuminance
    );
    updateResults();
  });

  $(".userSortSource").change(function () {
    var sourceVal = $(this).val();
    if (sourceVal == "") {
      $(this).val("Other");
    }
  });
}

function handleInputVariables() {
  $("#time_sel").on("change", function () {
    _t = Number(this.value);
    updateResults();
  });

  $("#scalar_sel").on("change", function () {
    _d = Number(this.value);
    updateResults();
  });
}

function handleToolTips() {
  $('[data-toggle="tooltip"]').tooltip({
    trigger: "hover",
  });
}

function handleCalculateByCS() {
  $(document).on("keydown", "#csInput", function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if (
      !(e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 39)
    ) {
      var testString = this.value
        .slice(0, this.selectionStart)
        .concat(e.key)
        .concat(this.value.slice(this.selectionEnd, this.value.length));
      if (!/(^0$)|(^0?\.(\d{1,3})?$)/.test(testString)) {
        //(!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8 || e.keyCode == 110 || e.keyCode == 190 || e.keyCode == 46)) {
        return false;
      }
    }

    // Trigger change on enter
    if (e.keyCode == 13) {
      $("#csInput").trigger("change");
    }
  });

  $(document).on("change", "#csInput", function () {
    var sourceIdx = this.id.split("_")[1];
    if (this.value == "") {
      this.value = "0";
    }
    if (/^\.\d*$/.test(this.value)) {
      this.value = "0".concat(this.value);
    }
    if (/^0.$/.test(this.value)) {
      this.value = this.value.concat("0");
    }
    var cla = cs2cla(parseFloat(this.value));

    var testSPD = {
      wavelength: setwavelength,
      value: arrayScalar(setwavelength, 0),
    };

    for (var i = 0; i < sourcelist.length; i++) {
      if (sourcelist[i].isSelected) {
        testSPD.value = sourcelist[i].selectedSource.relativeSPD;
        break;
      }
    }
    var lux = claspd2lux(cla, testSPD, thickness * 2);
    document.getElementsByClassName("ssIll")[0].value = lux
      .toFixed(2)
      .toString();
    $(".ssIll").trigger("change");
  });
}

function readJson() {
  $.ajax({
    mimeType: "application/json",
    url: "json/sources.json",
    async: false,
    dataType: "json",
    success: function (result) {
      $.each(result, function () {
        sourcelist = this;
      });
    },
  });
}

function handleCalculationsJson() {
  function createResultsJSON() {
    var calculations = {};
    calculations.version = VERSION;
    calculations.date = new Date().toString();
    calculations.sources = {};
    for (source of sourcelist) {
      if (source.isSelected) {
        calculations.sources[source.id] = {
          info: {
            id: source.id,
            manufacturer: source.manufacturer,
            cct: source.cct,
            lamp: source.lamp,
            desc: source.info,
            spd: {
              wavelengths: source.spd.wavelength.map((a) => a.toString()),
              values: source.spd.value.map((a) => a.toExponential(4)),
            },
          },
          lux: source.selectedSource.illuminance.toString(),
        };
      }
    }
    calculations.input_variables = {
      exposure_duration: _t.toString(),
      distribution_scaler: _d.toString(),
    };
    calculations.combined_metrics = {
      "cs_2.0": combinedValues.CS.toFixed(3),
      "cla_2.0": combinedValues.CLA.toFixed(),
      illuminance: combinedValues.absoluteIll.toString(),
      irradiance: combinedValues.Irr.toExponential(4),
      flux: combinedValues.pf.toExponential(4),
      eml: combinedValues.EML.toFixed(),
      cct: combinedValues.CCT.toFixed(),
      duv: combinedValues.Duv.toFixed(3),
      cri: combinedValues.CRI.toFixed(1),
      gai: combinedValues.GAI.toFixed(1),
      chromaticity_coordinates: `(${combinedValues.x.toFixed(
        4
      )}, ${combinedValues.y.toFixed(4)})`,
      "cie_s-cone_irradiance":
        combinedValues.CIE_S_cone_opic_irr.toExponential(4),
      "cie_m-cone_irradiance":
        combinedValues.CIE_M_cone_opic_irr.toExponential(4),
      "cie_l-cone_irradiance":
        combinedValues.CIE_L_cone_opic_irr.toExponential(4),
      cie_rhodopic_irradiance: combinedValues.CIE_Rhodopic_irr.toExponential(4),
      cie_melanopic_irradiance:
        combinedValues.CIE_Melanopic_irr.toExponential(4),
    };
    calculations.combined_spd = {
      relative: {
        wavelengths: combinedValues.relativeSPD.wavelength.map((a) =>
          a.toString()
        ),
        values: combinedValues.relativeSPD.value.map((a) => a.toExponential(4)),
      },
      absolute: {
        wavelengths: combinedValues.absoluteSPD.wavelength.map((a) =>
          a.toString()
        ),
        values: combinedValues.absoluteSPD.value.map((a) => a.toExponential(4)),
      },
    };

    $("#jsondownload").attr(
      "href",
      "data:application/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(calculations, null, 2))
    );
    $("#jsondownload").attr("download", "CS Calculator Results.json");
    $("#jsondownload")[0].click();
  }
  $("#resultsDownload").click(createResultsJSON);
}

function handleContinueToCalculationsButton() {
  $("#continue-to-calculations-button").on("click", function () {
    $("#stepChange2").trigger("click");
  });
}

function handleContentCardSteps() {
  $(".step-title-container").on("click", function (e) {
    var step = $(this).attr("id").replace("stepChange", "");
    $(".step-title-container").removeClass("active");
    $(this).addClass("active");
    $("[id^='stepContent']").removeClass("d-block");
    $("[id^='stepContent']").addClass("d-none");
    $("#stepContent" + step).removeClass("d-none");
    $("#stepContent" + step).addClass("d-block");

    if (step === "2") {
      if ($(".ssIll").length) $(".ssIll")[0].focus();
    }
  });
}

$(document).ready(function () {
  readJson();

  handleSources();

  handleInputVariables();

  handleToolTips();

  // handleCalculateByCS();

  handleContinueToCalculationsButton();

  handleContentCardSteps();

  handlePlotBtns();

  handleSPDBtns();

  handleHelpMenu();

  handleScrollTopOnReload();

  handleChartSize();

  handleResize();

  handleSourceModalDescriptionCollapse();

  handleCIEAlphaCaretDropdown();

  handleDownloadMetrics();

  handleDownloadSPDs();

  handleChangeSPDInputType();

  handleAddSourceFromSourceList();

  handleCustomSource();

  handleEditCustomSource();

  handleCalculationsJson();
});
