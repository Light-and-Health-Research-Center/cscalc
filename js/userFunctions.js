const VERSION = "2.0.0";

function resetInputs() {
  // Reset Status text
  $("#userSPDStatus").text("");

  // Reset Input values
  $("#userID").attr("placeholder", "Unique Source Name").val("");
  $("#userSPDValues").val("");
  $("#userSPDWavelengths").val("");
  $("#userMan").val("");
  $("#userCCT").val("");
  $("#userLamp").val("");
  $("#userDesc").val("");

  // Reset submit
  //validateSubmit();
  $("#userSourceSubmit").addClass("disabled");
  $("#userSourceSubmit").prop("disabled", true);
  return;
}

function notEmpty(id) {
  return id != "";
}

function isUniqueSourceName(newSourceID) {
  var result = true;
  for (var i in sourcelist) {
    if (sourcelist[i].id == newSourceID) {
      result = false;
      break;
    }
  }
  return result;
}

function userIDValid() {
  $("#userIDFormGroup").removeClass("has-error");
  $("#userIDFormGroup").addClass("has-success");

  $("#userIDSpan").removeClass("glyphicon-pencil");
  $("#userIDSpan").removeClass("glyphicon-remove");
  $("#userIDSpan").removeClass("glyphicon-ok");

  $("#userIDSpan").addClass("glyphicon-ok");
  return;
}

function userIDInvalid() {
  $("#userID").attr("placeholder", "Invalid Source Name").val("");
  $("#userIDFormGroup").removeClass("has-success");
  $("#userIDFormGroup").addClass("has-error");

  $("#userIDSpan").removeClass("glyphicon-pencil");
  $("#userIDSpan").removeClass("glyphicon-remove");
  $("#userIDSpan").removeClass("glyphicon-ok");

  $("#userIDSpan").addClass("glyphicon-remove");
  return;
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

function validateUserID() {
  var result = false;
  var newSourceID = $("#userID").val();
  if (notEmpty(newSourceID) & isUniqueSourceName(newSourceID)) {
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

function validateSubmit() {
  if (validateUserID() && validateUserSPD()) {
    $("#userSourceSubmit").removeClass("disabled");
    $("#userSourceSubmit").prop("disabled", false);
  } else {
    $("#userSourceSubmit").addClass("disabled");
    $("#userSourceSubmit").prop("disabled", true);
  }
}

function readUserSPD() {
  var result = {};
  var validSPD = true;
  var spd = {
    wavelength: [],
    value: [],
  };
  var alertText = "";
  var userWL = cleanSPDRows(
    $("#userSPDWavelengths").val().replace(/\n/g, " ").split(" ")
  );
  var userV = cleanSPDRows(
    $("#userSPDValues").val().replace(/\n/g, " ").split(" ")
  );
  if (userWL.length != userV.length) {
    if ($("#userSPDValues").val() != "") {
      alertText +=
        '<li class="alert alert-danger" role="alert"><strong>Error:</strong> There must be the same number of wavelengths and values</li>';
    }
    validSPD = false;
  }
  if (userWL.length < 3) {
    if ($("#userSPDValues").val() != "") {
      alertText +=
        '<li class="alert alert-danger" role="alert"><strong>Error:</strong> Must enter at least 3 wavelength-value pairs</li>';
    }
    validSPD = false;
  }

  if (userWL.some(notNumeric) || userV.some(notNumeric)) {
    if ($("#userSPDValues").val() != "") {
      alertText +=
        '<li class="alert alert-danger" role="alert"><strong>Error:</strong> Wavelengths and values must not contain non-numeric entries</li>';
    }
    validSPD = false;
  }

  spd.wavelength = arrayParseFloat(userWL);
  spd.value = arrayParseFloat(userV);

  result = {
    valid: validSPD,
    spd: spd,
  };

  //alert(alertText);
  $("#userSPDModalHelp").html(alertText);
  return result;
}

function validateUserSPD() {
  var userSPDTest = readUserSPD();
  return userSPDTest.valid;
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
  return !notEmpty(n) || !(!isNaN(n) && isFinite(n));
}

function submitUserSource() {
  var newSource = buildSourceObj();
  applyNewSource(sourcelist.length, newSource, true);
  updateSortSource();
  sourcelist.push(newSource);
  addSource(sourcelist.length - 1);
  $("#names-list").animate({ scrollTop: 0 }, 1000);
}

function arrayParseFloat(array) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    result[i] = parseFloat(array[i]);
  }
  return result;
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
  div += '<div class="row mb-1 sources_-row">';
  div +=
    '<div id="SelectedSource_' +
    sourceIdx +
    "_" +
    '" class="col d-flex  justify-content-between selected_source_">';
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
    '<button class="py-0 removeSource btn btn-link" type="button" data-toggle="tooltip" title="Remove Source" data-i="' +
    sourceIdx +
    '"><i class="fas fa-times fa-lg py-0"></i></button>';
  div += "</div></div>";
  $("#selected-sources_").append(div);

  var div = "";
  div += '<div class="row mb-1 sources-row">';
  div +=
    '<div id="SelectedSource_' +
    sourceIdx +
    '" class="col d-flex  justify-content-between selected_source py-2">';
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
    '<button class="py-0 removeSource btn btn-link" type="button" data-toggle="tooltip" title="Remove Source" data-i="' +
    sourceIdx +
    '"><i class="fas fa-times fa-lg py-0"></i></button></div>';
  div += "</div></div>";

  $("#selected-sources").append(div);

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  // Disable sourcelist button
  $("#source_" + sourceIdx).addClass("disabled");
  $("#source_" + sourceIdx).prop("disabled", true);
  updateResults();

  // Update chart dataset array
  addSourceDataset(sourcelist[sourceIdx]);
}

function handleBetaMessage() {
  $("#copy-email").on("click", function () {
    $("#copy-email")
      .attr("title", '<i class="fas fa-check"></i> Copied')
      .tooltip("_fixTitle")
      .tooltip("show");

    var textArea = document.createElement("textarea");
    textArea.value = "michaelmorrison@mountsinai.org";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
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
    if ($(this).hasClass("description-collapse-collapsed")) {
      $(this)
        .attr("title", "Collapse Description")
        .tooltip("_fixTitle")
        .tooltip("show");
      $(this).removeClass("description-collapse-collapsed");
    } else {
      $(this).addClass("description-collapse-collapsed");
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
      console.log("here");
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
      str += `CS 2.0\t${combinedValues.CS.toFixed(3)}\n`;
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
  $("#download-spds").on("click", function () {
    var str = "Nothing here. Check to make sure you've added sources.";
    if (combinedValues) {
      str = "";
      var wl, v, i;

      str += "Relative\n";
      for (i = 0; i < combinedValues.relativeSPD.wavelength.length; i++) {
        wl = combinedValues.relativeSPD.wavelength[i];
        v = combinedValues.relativeSPD.value[i];
        str += `${wl}\t${v}\n`;
      }

      str += "\nAbsolute\n";
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
    $("#spd-download").attr("download", "Combined SPDs.txt");
    $("#spd-download")[0].click();
  });
}

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
    "cie_s-cone-irradiance":
      combinedValues.CIE_S_cone_opic_irr.toExponential(4),
    "cie_m-cone_irradiance":
      combinedValues.CIE_M_cone_opic_irr.toExponential(4),
    "cie_l-cone_irradiance":
      combinedValues.CIE_L_cone_opic_irr.toExponential(4),
    cie_rhodopic_irradiance: combinedValues.CIE_Rhodopic_irr.toExponential(4),
    cie_melanopic_irradiance: combinedValues.CIE_Melanopic_irr.toExponential(4),
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
  $("#jsondownload").attr("download", "CSCalculator Results.json");
  $("#jsondownload")[0].click();
}

function resetInputVariables() {
  $("#mpod_sel").val("0.5");
  $("#time_sel").val("1.00");
  $("#scalar_sel").val("1.0");
  $("#attenuation_sel").val("0.0");
}

// Page Action Functions
$(document).ready(function () {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });
  resetInputVariables();

  $("button.addSource").on("click", function () {
    if ($("#stepChange2").hasClass("disabled")) {
      $("#stepChange2")
        .fadeIn(500)
        .fadeOut(500)
        .fadeIn(500)
        .fadeOut(500)
        .fadeIn(500);
      $("#stepChange2").removeClass("disabled");
    }
  });

  $(".step-title-container").on("click", function (e) {
    var step = $(this).attr("id").replace("stepChange", "");
    $(".step-title-container").removeClass("active");
    $(this).addClass("active");
    $("[id^='stepContent']").removeClass("d-block");
    $("[id^='stepContent']").addClass("d-none");
    $("#stepContent" + step).removeClass("d-none");
    $("#stepContent" + step).addClass("d-block");
  });

  $("#userID").change(function () {
    if (validateUserID()) {
      userIDValid();
    } else {
      userIDInvalid();
    }
    validateSubmit();
  });

  $("#userSPDValues").on("input", function () {
    validateSubmit();
  });

  $("#userSPDWavelengths").on("input", function () {
    validateSubmit();
  });

  $(".userEnter").on("keydown", function (e) {
    //Trigger change on enter
    if (e.keyCode == 13) {
      $(this).trigger("change");
      $(this).focus().blur();
    }
  });

  $(".userSortSource").change(function () {
    var sourceVal = $(this).val();
    if (!notEmpty(sourceVal)) {
      $(this).val("Other");
    }
  });

  $("#newSourceCol").mousemove(function () {
    if (validateUserSPD()) {
      userSPDValid();
    } else {
      userSPDInvalid();
    }
    validateSubmit();
  });

  $("#userSPDWavelengths").change(function () {
    if (validateUserSPD()) {
      userSPDValid();
    } else {
      userSPDInvalid();
    }
    validateSubmit();
  });

  $("#userSPDValues").change(function () {
    if (validateUserSPD()) {
      userSPDValid();
    } else {
      userSPDInvalid();
    }
    validateSubmit();
  });

  $("#continue-to-calculations-button").on("click", function () {
    $("#stepChange2").trigger("click");
  });

  $("#custom-source").on("click", function () {
    validateSubmit();
  });

  handleBetaMessage();

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

  $("#resultsDownload").click(createResultsJSON);
});
