<!DOCTYPE html>
<html class="no-js" lang="zxx">

<head>
  <base href="<?=DN?>">
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Loading...</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
  <link rel="icon" type="image/png" sizes="16x16" id="icone-page-fav" href="">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="theme-color" content="#ffffff">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="msapplication-TileImage" content="assets/img/favicons/ms-icon-144x144.png">
  <meta name="theme-color" content="#ffffff">
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&amp;family=Inter:wght@400;500;600;700;800;900&amp;family=Roboto:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/fontawesome.min.css">
  <link rel="stylesheet" href="assets/css/magnific-popup.min.css">
  <link rel="stylesheet" href="assets/css/slick.min.css">
  <link rel="stylesheet" href="assets/css/select2.min.css">
  <link rel="stylesheet" href="assets/css/style.min.css">
  <link rel="stylesheet" href="assets/intelinpt/css/intlTelInput.css">

</head>

<body>
  <?php include 'includes/header.php'; ?>
  <div class="breadcumb-wrapper" data-bg-src="" id="exhibition-banner">
    <div class="container">
      <div class="breadcumb-content">
        <h1 class="breadcumb-title" id="exhibition-title"></h1>
        <ul class="breadcumb-menu">
          <li>
            <a href="/Home/en" class="home_lang">Home</a>
          </li>
          <li class="ExhibitionBook exhibition_booking_lang">Exhibition Booking</li>
        </ul>
      </div>
    </div>
  </div>
  <section class="bg-smoke space">
    <div class="">
      <div class="container">
        <div class="row">
          <div class="col-md-8">
            <div class="col-md-12 bg-white px-3 py-3 exhibition-form">
              <input type="hidden" id="product_key">
              <input type="hidden" id="unit_price">
              <input type="hidden" id="currency">
              <div class="row gx-20">
                <div class="col-md-12">
                  <h3 class="font-weight-bold mb-4 exhibition_booking_lang">Exhibition Booking</h3>
                </div>
                <div class="form-group col-md-6 my-3">
                  <input type="text" class="form-control" id="exhibition-name" name="exhibition-name" required />
                  <label class="form-custom-label" for="exhibition-name">Full Name</label>
                </div>
                <div class="form-group col-md-6  my-3">
                  <input type="email" class="form-control" id="exhibition-email" name="exhibition-email" required />
                  <label class="form-custom-label" for="exhibition-email">Email</label>
                </div>
                <div class="form-group col-md-6  my-3">
                  <select class="form-control" id="country" name="country" required>
                    <option selected value="" disabled></option>
                  </select>
                  <label class="form-custom-label select-labels" for="country">Country</label>
                </div>
                <div class="form-group col-md-6  my-3">
                  <input type="number" class="form-control" id="exhibition-phone" name="exhibition-phone" required />
                  <label class="form-custom-label phone-label" for="exhibition-phone">Phone Number</label>
                </div>
                <div class="form-group col-md-6  my-3">
                  <input type="text" class="form-control" id="exhibition-company" name="exhibition-company" required />
                  <label class="form-custom-label" for="exhibition-company">Company</label>
                </div>
                <div class="form-group col-md-6  my-3">
                  <select class="form-control" id="exhibition-quantity" name="exhibition-quantity">
                    <option selected value="" disabled></option>
                  </select>
                  <label class="form-custom-label select-labels" for="exhibition-quantity">Quantity</label>
                </div>
                <div class="form-group col-12  my-3">
                  <textarea name="message" class="form-control" id="message"></textarea>
                  <label class="form-custom-label" for="message">Supplementary Information</label>
                </div>
                <div class="form-group p-3">
                  <div class="border">
                    <h4 class="font-weight-bold m-0 mt-2 mx-2" id="total-price"></h4>
                    <h5 id="total-price-text" class="m-0 mx-2 mb-2 text-uppercase"></h5>
                  </div>
                </div>
                <div class="form-group col-md-12  mb-3">
                  <select class="form-control" id="paymentMethod" name="paymentMethod" required>
                    <option selected value="" disabled></option>
                  </select>
                  <label class="form-custom-label select-labels" for="paymentMethod">Payment Method</label>
                </div>
              </div>
              <p class="form-messages"></p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card bg-white border-0">
              <div class="card-body">
                <img class="col-12" src="" id="exhibition-image" alt="Smart Event - Events Factory">
              </div>
            </div>
            <div class="card bg-white mt-3 border-0">
              <div class="card-body">
                <h5 class="card-title font-weight-bold border-bottom pb-2">Description</h5>
                <ul class="list-unstyled">
                  <li class="border-bottom pb-2" id="unit-price"></li>
                  <li class="border-bottom py-2" id="unit-size"></li>
                </ul>
                <p id="description-text"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </section>
  <?php include 'includes/footer.php'; ?>
  <a href="#" class="scrollToTop scroll-btn">
    <i class="far fa-long-arrow-up"></i>
  </a>
  <div id="request-animation" class="d-none">
    <div class="request-loader">
      <div class="request-inner one"></div>
      <div class="request-inner two"></div>
      <div class="request-inner three"></div>
    </div>
  </div>

  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-body">
          <div id="payment-target"></div>
          <div class="row" id="notification-row">
            <div class="col-4 text-center">
              <img id="notification-image" src="assets/img/website-maintenance.gif" alt="" class="img-fluid">
            </div>
            <div class="col-8 d-flex flex-column justify-content-center align-items-center">
              <h3 class="text-center" id="message-header">Payment gataway unreachable</h3>
              <p class="text-center" id="message-description">We are sorry for the inconvenience, our payment gataway is unreachable at the moment, please try again later.</p>
              <div class="text-center" id="payment_action_name"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <input type="hidden" id="exhibition_id" value="<?=$index[1]?>">
  <script src="assets/js/jquery-3.5.0.min.js" defer></script>
  <script src="assets/js/slick.min.js" defer></script>
  <script src="assets/js/select2.min.js" defer></script>
  <script src="assets/js/bootstrap.min.js" defer></script>
  <script src="assets/intelinpt/js/intlTelInput.js"></script>
  <script src="assets/http_request/exhibitionbooking.js" defer></script>
  <script src="assets/js/jquery.magnific-popup.min.js" defer></script>
  <script src="assets/js/imagesloaded.pkgd.min.js" defer></script>
  <script src="assets/js/isotope.pkgd.min.js" defer></script>
  <script src="assets/js/jquery.counterup.min.js" defer></script>
  <script src="assets/js/vscustom-carousel.min.js" defer></script>
  <script src="assets/js/jquery-ui.min.js" defer></script>
  <script src="assets/js/tilt.jquery.min.js" defer></script>
  <script src="assets/js/ajax-mail.js" defer></script>
  <script src="<?=Env::get('GATEWAY_URL')?>" data-error="errorCallback"
        data-cancel="cancelCallback" data-complete="completeCallback" ></script>
  <script src="assets/js/main.min.js" defer></script>
  <script src="assets/lang/exhibitionBooking.js" defer></script>
  <script src="assets/lang/header.js" defer></script>
  <script src="assets/lang/footer.js" defer></script>
</body>

</html>