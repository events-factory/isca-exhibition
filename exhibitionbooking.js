var a = [
  "",
  "one ",
  "two ",
  "three ",
  "four ",
  "five ",
  "six ",
  "seven ",
  "eight ",
  "nine ",
  "ten ",
  "eleven ",
  "twelve ",
  "thirteen ",
  "fourteen ",
  "fifteen ",
  "sixteen ",
  "seventeen ",
  "eighteen ",
  "nineteen ",
];
var b = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

function inWords(num) {
  if ((num = num.toString()).length > 9) return "overflow";
  n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  var str = "";
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
      : "";
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
      : "";
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
      : "";
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
      : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
      : "";
  return str;
}

var input = document.querySelector("#exhibition-phone");
let iti = window.intlTelInput(input, {
  initialCountry: "us",
  preferredCountries: ["us", "gb", "fr"],
  separateDialCode: true,
  placeholderNumberType: "FIXED_LINE",
  nationalMode: true,
  customPlaceholder: function () {
    return "";
  },
  formatOnDisplay: true,
  utilsScript: "lib/intelinpt/js/utils.js",
});

input.addEventListener("focus", function () {
  input.style.paddingLeft = "95px";
  $(".phone-label").addClass("focused-label");
});

input.addEventListener("blur", function () {
  if (input.value == "") {
    $(".phone-label").removeClass("focused-label");
  }
});

input.addEventListener("input", function () {
  input.style.paddingLeft = "95px";
  let filteredValue = input.value.replace(/[^0-9]/g, "");
  if (filteredValue.length > 10) {
    filteredValue = filteredValue.slice(0, 10);
  }
  input.value = filteredValue;
});

$(".form-control").on("blur", function () {
  if ($(this).val().length > 0) {
    $(this).addClass("has-value");
  } else {
    $(this).removeClass("has-value");
  }
});

$("select").on("select2:open", function () {
  $(".select2-search__field").attr("placeholder", "Search");
  $(this).siblings(".select-labels").addClass("select-labels-active");
});

$("select").on("select2:close", function () {
  if ($(this).val() === null || $(this).val() === "") {
    $(".select-labels").removeClass("select-labels-active");
  }
});

$(".form-control").on("blur", function () {
  if ($(this).val() !== null && $(this).val().length > 0) {
    $(this).is("select") && $(this).select2("close");
    $(this).addClass("has-value");
  } else {
    $(this).is("select") && $(this).select2("open");
    $(this).removeClass("has-value");
  }
});

function capitalize(str) {
  var words = str.split(" ");
  for (var i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  return words.join(" ");
}

$(document).ready(function () {
  var exhibition_reference = localStorage.getItem("exhibition_reference");
  console.log(exhibition_reference);
  var currentLanguage = $("#current_language").val();
  const id = localStorage.getItem("exhibition_reference");
  if (id != null) {
    let countries = [
      { name: "Afghanistan", code: "AF" },
      { name: "Albania", code: "AL" },
      { name: "Algeria", code: "DZ" },
      { name: "American Samoa", code: "AS" },
      { name: "AndorrA", code: "AD" },
      { name: "Angola", code: "AO" },
      { name: "Anguilla", code: "AI" },
      { name: "Antarctica", code: "AQ" },
      { name: "Antigua and Barbuda", code: "AG" },
      { name: "Argentina", code: "AR" },
      { name: "Armenia", code: "AM" },
      { name: "Aruba", code: "AW" },
      { name: "Australia", code: "AU" },
      { name: "Austria", code: "AT" },
      { name: "Azerbaijan", code: "AZ" },
      { name: "Bahamas", code: "BS" },
      { name: "Bahrain", code: "BH" },
      { name: "Bangladesh", code: "BD" },
      { name: "Barbados", code: "BB" },
      { name: "Belarus", code: "BY" },
      { name: "Belgium", code: "BE" },
      { name: "Belize", code: "BZ" },
      { name: "Benin", code: "BJ" },
      { name: "Bermuda", code: "BM" },
      { name: "Bhutan", code: "BT" },
      { name: "Bolivia", code: "BO" },
      { name: "Bosnia and Herzegovina", code: "BA" },
      { name: "Botswana", code: "BW" },
      { name: "Bouvet Island", code: "BV" },
      { name: "Brazil", code: "BR" },
      { name: "British Indian Ocean Territory", code: "IO" },
      { name: "Brunei Darussalam", code: "BN" },
      { name: "Bulgaria", code: "BG" },
      { name: "Burkina Faso", code: "BF" },
      { name: "Burundi", code: "BI" },
      { name: "Cambodia", code: "KH" },
      { name: "Cameroon", code: "CM" },
      { name: "Canada", code: "CA" },
      { name: "Cape Verde", code: "CV" },
      { name: "Cayman Islands", code: "KY" },
      { name: "Central African Republic", code: "CF" },
      { name: "Chad", code: "TD" },
      { name: "Chile", code: "CL" },
      { name: "China", code: "CN" },
      { name: "Christmas Island", code: "CX" },
      { name: "Cocos (Keeling) Islands", code: "CC" },
      { name: "Colombia", code: "CO" },
      { name: "Comoros", code: "KM" },
      { name: "Congo", code: "CG" },
      { name: "Congo, The Democratic Republic of the", code: "CD" },
      { name: "Cook Islands", code: "CK" },
      { name: "Costa Rica", code: "CR" },
      { name: "Cote D'Ivoire", code: "CI" },
      { name: "Croatia", code: "HR" },
      { name: "Cuba", code: "CU" },
      { name: "Cyprus", code: "CY" },
      { name: "Czech Republic", code: "CZ" },
      { name: "Denmark", code: "DK" },
      { name: "Djibouti", code: "DJ" },
      { name: "Dominica", code: "DM" },
      { name: "Dominican Republic", code: "DO" },
      { name: "Ecuador", code: "EC" },
      { name: "Egypt", code: "EG" },
      { name: "El Salvador", code: "SV" },
      { name: "Equatorial Guinea", code: "GQ" },
      { name: "Eritrea", code: "ER" },
      { name: "Estonia", code: "EE" },
      { name: "Ethiopia", code: "ET" },
      { name: "Falkland Islands (Malvinas)", code: "FK" },
      { name: "Faroe Islands", code: "FO" },
      { name: "Fiji", code: "FJ" },
      { name: "Finland", code: "FI" },
      { name: "France", code: "FR" },
      { name: "French Guiana", code: "GF" },
      { name: "French Polynesia", code: "PF" },
      { name: "French Southern Territories", code: "TF" },
      { name: "Gabon", code: "GA" },
      { name: "Gambia", code: "GM" },
      { name: "Georgia", code: "GE" },
      { name: "Germany", code: "DE" },
      { name: "Ghana", code: "GH" },
      { name: "Gibraltar", code: "GI" },
      { name: "Greece", code: "GR" },
      { name: "Greenland", code: "GL" },
      { name: "Grenada", code: "GD" },
      { name: "Guadeloupe", code: "GP" },
      { name: "Guam", code: "GU" },
      { name: "Guatemala", code: "GT" },
      { name: "Guernsey", code: "GG" },
      { name: "Guinea", code: "GN" },
      { name: "Guinea-Bissau", code: "GW" },
      { name: "Guyana", code: "GY" },
      { name: "Haiti", code: "HT" },
      { name: "Heard Island and Mcdonald Islands", code: "HM" },
      { name: "Holy See (Vatican City State)", code: "VA" },
      { name: "Honduras", code: "HN" },
      { name: "Hong Kong", code: "HK" },
      { name: "Hungary", code: "HU" },
      { name: "Iceland", code: "IS" },
      { name: "India", code: "IN" },
      { name: "Indonesia", code: "ID" },
      { name: "Iran, Islamic Republic Of", code: "IR" },
      { name: "Iraq", code: "IQ" },
      { name: "Ireland", code: "IE" },
      { name: "Isle of Man", code: "IM" },
      { name: "Israel", code: "IL" },
      { name: "Italy", code: "IT" },
      { name: "Jamaica", code: "JM" },
      { name: "Japan", code: "JP" },
      { name: "Jersey", code: "JE" },
      { name: "Jordan", code: "JO" },
      { name: "Kazakhstan", code: "KZ" },
      { name: "Kenya", code: "KE" },
      { name: "Kiribati", code: "KI" },
      { name: "Korea, Democratic People'S Republic of", code: "KP" },
      { name: "Korea, Republic of", code: "KR" },
      { name: "Kuwait", code: "KW" },
      { name: "Kyrgyzstan", code: "KG" },
      { name: "land Islands", code: "AX" },
      { name: "Lao People'S Democratic Republic", code: "LA" },
      { name: "Latvia", code: "LV" },
      { name: "Lebanon", code: "LB" },
      { name: "Lesotho", code: "LS" },
      { name: "Liberia", code: "LR" },
      { name: "Libyan Arab Jamahiriya", code: "LY" },
      { name: "Liechtenstein", code: "LI" },
      { name: "Lithuania", code: "LT" },
      { name: "Luxembourg", code: "LU" },
      { name: "Macao", code: "MO" },
      { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
      { name: "Madagascar", code: "MG" },
      { name: "Malawi", code: "MW" },
      { name: "Malaysia", code: "MY" },
      { name: "Maldives", code: "MV" },
      { name: "Mali", code: "ML" },
      { name: "Malta", code: "MT" },
      { name: "Marshall Islands", code: "MH" },
      { name: "Martinique", code: "MQ" },
      { name: "Mauritania", code: "MR" },
      { name: "Mauritius", code: "MU" },
      { name: "Mayotte", code: "YT" },
      { name: "Mexico", code: "MX" },
      { name: "Micronesia, Federated States of", code: "FM" },
      { name: "Moldova, Republic of", code: "MD" },
      { name: "Monaco", code: "MC" },
      { name: "Mongolia", code: "MN" },
      { name: "Montenegro", code: "ME" },
      { name: "Montserrat", code: "MS" },
      { name: "Morocco", code: "MA" },
      { name: "Mozambique", code: "MZ" },
      { name: "Myanmar", code: "MM" },
      { name: "Namibia", code: "NA" },
      { name: "Nauru", code: "NR" },
      { name: "Nepal", code: "NP" },
      { name: "Netherlands", code: "NL" },
      { name: "Netherlands Antilles", code: "AN" },
      { name: "New Caledonia", code: "NC" },
      { name: "New Zealand", code: "NZ" },
      { name: "Nicaragua", code: "NI" },
      { name: "Niger", code: "NE" },
      { name: "Nigeria", code: "NG" },
      { name: "Niue", code: "NU" },
      { name: "Norfolk Island", code: "NF" },
      { name: "Northern Mariana Islands", code: "MP" },
      { name: "Norway", code: "NO" },
      { name: "Oman", code: "OM" },
      { name: "Pakistan", code: "PK" },
      { name: "Palau", code: "PW" },
      { name: "Palestinian Territory, Occupied", code: "PS" },
      { name: "Panama", code: "PA" },
      { name: "Papua New Guinea", code: "PG" },
      { name: "Paraguay", code: "PY" },
      { name: "Peru", code: "PE" },
      { name: "Philippines", code: "PH" },
      { name: "Pitcairn", code: "PN" },
      { name: "Poland", code: "PL" },
      { name: "Portugal", code: "PT" },
      { name: "Puerto Rico", code: "PR" },
      { name: "Qatar", code: "QA" },
      { name: "Reunion", code: "RE" },
      { name: "Romania", code: "RO" },
      { name: "Russian Federation", code: "RU" },
      { name: "RWANDA", code: "RW" },
      { name: "Saint Helena", code: "SH" },
      { name: "Saint Kitts and Nevis", code: "KN" },
      { name: "Saint Lucia", code: "LC" },
      { name: "Saint Pierre and Miquelon", code: "PM" },
      { name: "Saint Vincent and the Grenadines", code: "VC" },
      { name: "Samoa", code: "WS" },
      { name: "San Marino", code: "SM" },
      { name: "Sao Tome and Principe", code: "ST" },
      { name: "Saudi Arabia", code: "SA" },
      { name: "Senegal", code: "SN" },
      { name: "Serbia", code: "RS" },
      { name: "Seychelles", code: "SC" },
      { name: "Sierra Leone", code: "SL" },
      { name: "Singapore", code: "SG" },
      { name: "Slovakia", code: "SK" },
      { name: "Slovenia", code: "SI" },
      { name: "Solomon Islands", code: "SB" },
      { name: "Somalia", code: "SO" },
      { name: "South Africa", code: "ZA" },
      { name: "South Georgia and the South Sandwich Islands", code: "GS" },
      { name: "Spain", code: "ES" },
      { name: "Sri Lanka", code: "LK" },
      { name: "Sudan", code: "SD" },
      { name: "Suriname", code: "SR" },
      { name: "Svalbard and Jan Mayen", code: "SJ" },
      { name: "Swaziland", code: "SZ" },
      { name: "Sweden", code: "SE" },
      { name: "Switzerland", code: "CH" },
      { name: "Syrian Arab Republic", code: "SY" },
      { name: "Taiwan, Province of China", code: "TW" },
      { name: "Tajikistan", code: "TJ" },
      { name: "Tanzania, United Republic of", code: "TZ" },
      { name: "Thailand", code: "TH" },
      { name: "Timor-Leste", code: "TL" },
      { name: "Togo", code: "TG" },
      { name: "Tokelau", code: "TK" },
      { name: "Tonga", code: "TO" },
      { name: "Trinidad and Tobago", code: "TT" },
      { name: "Tunisia", code: "TN" },
      { name: "Turkey", code: "TR" },
      { name: "Turkmenistan", code: "TM" },
      { name: "Turks and Caicos Islands", code: "TC" },
      { name: "Tuvalu", code: "TV" },
      { name: "Uganda", code: "UG" },
      { name: "Ukraine", code: "UA" },
      { name: "United Arab Emirates", code: "AE" },
      { name: "United Kingdom", code: "GB" },
      { name: "United States", code: "US" },
      { name: "United States Minor Outlying Islands", code: "UM" },
      { name: "Uruguay", code: "UY" },
      { name: "Uzbekistan", code: "UZ" },
      { name: "Vanuatu", code: "VU" },
      { name: "Venezuela", code: "VE" },
      { name: "Viet Nam", code: "VN" },
      { name: "Virgin Islands, British", code: "VG" },
      { name: "Virgin Islands, U.S.", code: "VI" },
      { name: "Wallis and Futuna", code: "WF" },
      { name: "Western Sahara", code: "EH" },
      { name: "Yemen", code: "YE" },
      { name: "Zambia", code: "ZM" },
      { name: "Zimbabwe", code: "ZW" },
    ];
    countries.forEach(function (country) {
      $("#country").append(
        `<option value="${capitalize(country.name.toLowerCase())}" data-code="${
          country.code
        }">${capitalize(country.name.toLowerCase())}</option>`
      );
    });
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && this.status === 200) {
        var res = JSON.parse(xhr.response);
        $(".exhibition-form").append(`
          <input type="hidden" id="payment_token" value="">
          <input type="hidden" id="payment_session" value="">
          <input type="hidden" id="order_id" value="">
          <input type="hidden" id="acknowleadgment" value="">
        `);
        description =
          currentLanguage == "en"
            ? res.about.english_description
            : res.about.french_description;
        product_name =
          currentLanguage == "en"
            ? res.product.name_english
            : res.product.name_french;
        product_description =
          currentLanguage == "en"
            ? res.product.description_english
            : res.product.description_french;
        rent_price_text =
          currentLanguage == "en"
            ? "The rent price is"
            : "Le prix du loyer est";
        size_text =
          currentLanguage == "en" ? "The size of the" : "La taille du";
        fillPrimaryInfo(
          res.event,
          res.event_description,
          description.slice(0, 200),
          res.menues
        );
        $("#exhibition-banner").attr("data-bg-src", res.about.banner);
        $("#exhibition-title").text(`${product_name}`);
        $("#exhibition-image").attr("src", res.product.banner);
        $("#unit-price").text(
          `${rent_price_text} ${res.product.currency} ${res.product.prices} per ${product_name}`
        );
        $("#unit-size").text(
          `${size_text} ${product_name} is ${res.product.sizes}`
        );
        $("#description-text").html(product_description);
        for (let i = 0; i < res.product.available_quantity; i++) {
          $("#exhibition-quantity").append(
            `<option value="${i + 1}">${i + 1}</option>`
          );
        }
        $("#unit_price").val(res.product.prices);
        $("#product_key").val(res.product.packagecode);
        $("#currency").val(res.product.currency);
        for (let i = 0; i < res.payment_method.length; i++) {
          $("#paymentMethod").append(
            `<option value="${res.payment_method[i].id}">${res.payment_method[i].contentEnglish}</option>`
          );
        }
        if (res.product.prices > 0) {
          $("#book-booth").parent().addClass("d-none");
        }
        $("select").select2({
          minimumInputLength: 0,
        });
      }
    });
    xhr.open(
      "GET",
      `https://app.smartevent.rw/Api/Get-Exibition-Packages-Full/Details/${exhibition_reference}`
    );
    xhr.setRequestHeader("Authorization", "5e4Wxzu8Ifd08E6LMSb4yzJNZEtiMlI4d085UWxFblVxZzV6K2c9PQ==");
    xhr.send();
  } else {
    alert("Error", "No exhibition reference found");
    window.location.href = "/ExhibitionBooking/en";
  }
});

$("select").on("select2:open", function () {
  $(".select2-search__field").attr("placeholder", "Search");
});

$("select").on("select2:close", function () {
  if ($(this).val() === null || $(this).val() === "") {
    $(".select-labels").removeClass("select-labels-active");
  }
});

$("#country").on("change", function () {
  let country = $(this).val();
  var code = $(this).find(`option[value="${country}"]`).data("code");
  iti.setCountry(code);
});

$("#exhibition-quantity").on("change", function () {
  var quantity = $(this).val();
  if (quantity > 0) {
    var unit_price = $("#unit_price").val();
    var total_price = quantity * unit_price;
    $("#total-price").text(
      `Amount to Pay: ${$("#currency").val()} ${total_price}`
    );
    $("#total-price-text").text(
      `Amount in words: ${inWords(total_price)} ${$("#currency")
        .val()
        .replace("USD", "US Dollars")}`
    );
    initialize_payment();
  }
});

function getFormInputData(data) {
  data.append("product_key", $("#product_key").val());
  data.append("name", $("#exhibition-name").val());
  data.append("email", $("#exhibition-email").val());
  data.append("phone", iti.getNumber());
  data.append("company", $("#exhibition-company").val());
  data.append(
    "country",
    $("#country").val() == null ? "" : $("#country").val()
  );
  data.append("message", $("#message").val());
  data.append("event_code", "EfYwYppesNzo0mmttFZc9DJoM2l6Q2lnZlhUYmZXUlM2bWx1Q1E9PQ==");
  data.append("quantity", $("#exhibition-quantity").val());
  data.append("payment_method", $("#paymentMethod").val());
  data.append("field_name", "exhibition_email_english");
  data.append("application", "exhibition");
  data.append("payment_token", $("#payment_token").val());
  data.append("payment_session", $("#payment_session").val());
  data.append("order_id", $("#order_id").val());
}

function dismiss() {
  $("#notification-draw").remove();
}

function initialize_payment(update_session = false) {
  let data = new FormData();
  data.append("product_id", $("#product_key").val());
  data.append("quantity", $("#exhibition-quantity").val());
  data.append("event_code", "EfYwYppesNzo0mmttFZc9DJoM2l6Q2lnZlhUYmZXUlM2bWx1Q1E9PQ==");
  data.append("application", "exhibition");
  let payment_data = new XMLHttpRequest();
  payment_data.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      let res = JSON.parse(this.responseText);
      switch (this.status) {
        case 200:
          if (res.data.result === "SUCCESS") {
            $("#payment_token").val(res.data.token);
            $("#payment_session").val(res.data.payment_session);
            $("#order_id").val(res.data.orderId);
            if (update_session) {
              callPaymentUI();
            }
          } else {
            $("#notification-image").attr(
              "src",
              "assets/img/website-maintenance.gif"
            );
            $("#message-header").text("Online Payment Portal Unreachable");
            $("#message-description").text(
              "We are sorry for the inconvenience, our payment gataway is unreachable at the moment, please try again later."
            );
            $("#staticBackdrop").modal("show");
            $("#payment_action_name").html(
              `<button type="button" id="closing_modal" class="searchBoxToggler vs-btn style2 col-12" data-bs-dismiss="modal">Close</button>`
            );
          }
          break;
        default:
          $("#notification-image").attr(
            "src",
            "assets/img/website-maintenance.gif"
          );
          $("#message-header").text("Online Payment Portal Unreachable");
          $("#message-description").text(
            "We are sorry for the inconvenience, our payment gataway is unreachable at the moment, please try again later."
          );
          $("#staticBackdrop").modal("show");
          $("#payment_action_name").html(
            `<button type="button" id="closing_modal" class="searchBoxToggler vs-btn style2 col-12" data-bs-dismiss="modal">Close</button>`
          );
          break;
      }
    }
  });
  payment_data.open(
    "POST",
    `https://app.smartevent.rw/Api/Initiate-Gateway-Session`,
    true
  );
  payment_data.send(data);
}

$("#paymentMethod").on("change", function () {
  if ($(this).val() !== null && $(this).val() !== "") {
    $("#notification-image").attr("src", "assets/img/payment.gif");
    $("#message-header").text("Authenticating Payment Request...");
    $("#message-description").text(
      "Authentication in progress. We are currently verifying and validating your payment request to ensure its authenticity and security."
    );
    $("#closing_modal").hide();
    $("#staticBackdrop").modal("show");
    $("#payment_action_name").html("");
    $(".loading-overlay").toggleClass("is-active");
    let data = new FormData();
    getFormInputData(data);
    data.append("payment_method", $(this).val());
    data.append("event_code", "EfYwYppesNzo0mmttFZc9DJoM2l6Q2lnZlhUYmZXUlM2bWx1Q1E9PQ==");
    data.append("appication_id", "Exhibition");
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        $(".loading-overlay").toggleClass("is-active");
        let res = JSON.parse(this.responseText);
        switch (this.status) {
          case 200:
            if (res.data.result == true) {
              $("#notification-image").attr(
                "src",
                "assets/img/accepted-payment.gif"
              );
              $("#message-header").text("Payment Request Accepted");
              if (res.data.direct_payment == "true") {
                $("#message-description").text(
                  "Your payment request has been accepted, please make sure you filled all the required fields correctly before procceeding. You will be redirected to our payment portal to complete your payment."
                );
                $("#payment_action_name").html(`
                  <button type="button" id="closing_modal" onclick="resetPayment()" class="searchBoxToggler vs-btn style2" data-bs-dismiss="modal">Edit</button>
                  <button type="button" onclick="callPaymentUI()" class="searchBoxToggler vs-btn style2" >Pay Now</button>
                `);
              } else {
                $("#message-description").text(
                  "Your payment request has been accepted, the information about our bank account will be sent to your email address. Please make sure you filled all the required fields correctly before procceeding."
                );
                $("#payment_action_name").html(`
                  <button type="button" id="closing_modal" onclick="resetPayment()" class="searchBoxToggler vs-btn style2" data-bs-dismiss="modal">Edit</button>
                  <button type="button" onclick="submitForm()" class="searchBoxToggler vs-btn style2" data-bs-dismiss="modal">Continue</button>
                `);
              }
            } else {
              $("#notification-image").attr(
                "src",
                "assets/img/payment-failed-error.gif"
              );
              $("#message-header").text(
                "We currently do not accept this payment method"
              );
            }
            break;
          case 400:
            if (!Array.isArray(res.message)) {
              $("#notification-image").attr(
                "src",
                "assets/img/payment-failed-error.gif"
              );
              $("#message-header").text(
                "We currently do not accept this payment method"
              );
              $("#message-description").text(
                "We do not currently accept this payment method. Please choose an alternative payment method during checkout."
              );
              $("#payment_action_name").html(`
                <button type="button" id="closing_modal" onclick="resetPayment()" class="searchBoxToggler vs-btn style2 col-12" data-bs-dismiss="modal">Try another method</button>
              `);
            } else {
              $("#notification-image").attr("src", "assets/img/validation.gif");
              $("#message-header").text("Validation Error");
              $("#message-description").text(
                "Kindly check the following errors and try again."
              );
              $("#payment_action_name").html(`
                <button type="button" id="closing_modal" onclick="resetPayment()" class="searchBoxToggler vs-btn style2 col-12" data-bs-dismiss="modal">Edit</button>
              `);
              $("#notification-draw").remove();
              $(".exhibition-form").prepend(`
                <div class="col-8 mx-auto alert alert-danger alert-dismissible fade show" role="alert" id="notification-draw">
                  <strong>Error!</strong> ${res.message.join(", ")}
                  <button type="button" style="padding: 0 8px;margin-top: -6px;" onclick="dismiss()" class="btn btn-outline-danger float-end" data-bs-dismiss="modal">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              `);
              $("html, body").animate(
                {
                  scrollTop: $("#notification-draw").offset().top - 45,
                },
                500
              );
            }
            break;
        }
      }
    });
    xhr.open("POST", `https://app.smartevent.rw/Api/Validate-Payment-Method`);
    xhr.send(data);
  }
});

function resetPayment() {
  $("#paymentMethod").val("").trigger("change");
  $("#paymentMethod").siblings("label").removeClass("select-labels-active");
  $("html, body").animate(
    {
      scrollTop: $(".exhibition-form").offset().top - 15,
    },
    500
  );
}

const submitForm = () => {
  if (
    $("#product_key").val() != "" &&
    $("#exhibition-name").val() != "" &&
    $("#exhibition-email").val() != "" &&
    $("#exhibition-phone").val() != "" &&
    $("#exhibition-company").val() != "" &&
    $("#country").val() != ""
  ) {
    $("#request-animation").removeClass("d-none");
    let data = new FormData();
    getFormInputData(data);
    data.append("event_code", "EfYwYppesNzo0mmttFZc9DJoM2l6Q2lnZlhUYmZXUlM2bWx1Q1E9PQ==");
    data.append("appication_id", "Exhibition");
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        $("#request-animation").addClass("d-none");
        $("#staticBackdrop").modal("hide");
        let res = JSON.parse(xhr.response);
        switch (this.status) {
          case 200:
            $("html, body").animate(
              {
                scrollTop: $(".exhibition-form").offset().top - 15,
              },
              500
            );
            $("#notification-draw").remove();
            $("#pricing").html(`
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                    <circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                    <polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                </svg>
                <p class="mt-5 text-center mt-4 h6 fw-normal col-8 mx-auto">We are delighted to inform you that your booking has been processed successfully. You will receive an email shortly containing all the details of your booking, as well as an invoice for your reference.</p>
            `);
            break;
          case 400:
            $("#notification-draw").remove();
            $(".exhibition-form").prepend(`
              <div class="col-12 mx-auto alert alert-danger alert-dismissible fade show" role="alert" id="notification-draw">
                <strong>Error!</strong>
                <button type="button" style="padding: 0 8px;margin-top: -6px;" onclick="dismiss()" class="btn btn-outline-danger float-end" data-bs-dismiss="modal">
                  <i class="fas fa-times"></i>
                </button>
                <p class="m-0 mt-2 alert-danger text-capitalize"> ${res.message.join(
                  ", "
                )}</p>
              </div>
            `);
            $("html, body").animate(
              {
                scrollTop: $("#notification-draw").offset().top - 15,
              },
              500
            );
            break;
          default:
            $("#notification-draw").remove();
            $(".exhibition-form").prepend(`
              <div class="col-12 mx-auto alert alert-danger alert-dismissible fade show" role="alert" id="notification-draw">
                <strong>Error!</strong> Internal Server Error.
                <button type="button" style="padding: 0 8px;margin-top: -6px;" onclick="dismiss()" class="btn btn-outline-danger float-end" data-bs-dismiss="modal">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            `);
            break;
        }
      }
    });
    xhr.open(
      "POST",
      `https://app.smartevent.rw/Api/Book-Exibition-Packages`
    );

    xhr.setRequestHeader("Authorization", "EfYwYppesNzo0mmttFZc9DJoM2l6Q2lnZlhUYmZXUlM2bWx1Q1E9PQ==");
    xhr.send(data);
  } else {
    $("#notification-draw").remove();
    $(".exhibition-form").prepend(`
      <div class="col-8 mx-auto alert alert-danger alert-dismissible fade show" role="alert" id="notification-draw">
        <strong>Error!</strong> Kindly fill all the fields.
        <button type="button" style="padding: 0 8px;margin-top: -6px;" onclick="dismiss()" class="btn btn-outline-danger float-end" data-bs-dismiss="modal">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `);
    $("html, body").animate(
      {
        scrollTop: $("#notification-draw").offset().top - 15,
      },
      500
    );
  }
};

function callPaymentUI() {
  $("#notification-row").addClass("d-none");
  Checkout.configure({
    session: {
      id: $("#payment_session").val(),
    },
  });
  Checkout.showEmbeddedPage("#payment-target");
  $("#payment-target").css("max-height", "initial");
}

function errorCallback(error) {
  $("#notification-image").attr("src", "assets/img/payment-failed-error.gif");
  $("#message-header").text("Unable to process payment");
  $("#message-description").text(error["error.explanation"]);
  $("#staticBackdrop").modal("show");
  $("#payment_action_name").html(
    `<button type="button" class="searchBoxToggler vs-btn style2 col-12" onclick="reactualize_session()">Retry</button>`
  );
  $("#payment-target").css("max-height", "initial");
  $("#notification-row").removeClass("d-none");
}

function cancelCallback() {
  $("#notification-image").attr("src", "assets/img/payment-failed-error.gif");
  $("#message-header").text("Payment Cancelled");
  $("#message-description").text(
    "We are sorry for the inconvenience, your payment was cancelled"
  );
  $("#staticBackdrop").modal("show");
  $("#payment_action_name").html(
    `<button type="button" id="closing_modal" class="searchBoxToggler vs-btn style2 col-12" data-bs-dismiss="modal">Close</button>`
  );
  $("#payment-target").css("max-height", "initial");
  $("#notification-row").removeClass("d-none");
}

function completeCallback(result) {
  if (result.resultIndicator === $("#payment_token").val()) {
    $("#notification-row").removeClass("d-none");
    $("#notification-row").html(`
      <div class="col-12 text-center">
        <img src="assets/img/registration.gif" class="img-fluid" style="height: 20vh;">
        <h6 class="mt-5">Do not close or refresh this page, your payment is being processed</h6>
      </div>
    `);
    $("#acknowleadgment").val(result.resultIndicator);
    $("#hc-comms-layer-iframe").remove();
    submitForm();
  } else {
    $("#notification-row").removeClass("d-none");
    $("#notification-row").html(`
      <div class="col-12 text-center">
        <img src="assets/img/registration.gif" class="img-fluid" style="height: 20vh;">
        <h6 class="mt-5">Payement failed, please try again</h6>
      </div>
    `);
    $("#hc-comms-layer-iframe").remove();
  }
}