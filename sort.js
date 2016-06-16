// Check for jQuery
if (!window.jQuery) {
  throw new Error('jQuery was not loaded. Cannot continue.');
} else {
  var roomDetails = $('room_detail');
  if (roomDetails.length < 1) throw new Error('Unable to find any room detail blocks.');

  roomDetails.each(function () {
    var blockNumber = this.getAttribute('block').split(' ').join('');
    var roomDetailElement = $(this);

    //roomDetailElement.hide();
    roomDetailElement.css('width', '100%');
    var roomSummarySelector = "room_summary[block='" + blockNumber + "']";
    var roomSummaryElement = $(roomSummarySelector);

    // Each room_details block must have at least one room_summary tag (with children)
    if (roomSummaryElement.length === 1) {
      // These two buttons should already exist in the DOM, so just select them and assign event handlers
      var showButton = $(".showDetailsButton[block='" + blockNumber + "']");
      var hideButton = $(".hideDetailsButton[block='" + blockNumber + "']");

      // Event handlers
      $(showButton).click(function () {
        $(roomDetailElement).show();
        $(this).hide();
        $(hideButton).show();
      });

      $(hideButton).click(function () {
        $(roomDetailElement).hide();
        $(showButton).show();
      });
    }
    else {
      console.log('Room summary at block ' + blockNumber + ' has no data. Skipping...');
    }
  });

  // Three sort buttons should already exist in the DOM. Do the same as above.
  var sortAlpha = $('.sortAlpha');
  var sortPriceDesc = $('.sortPriceDesc');
  var sortPriceAsc = $('.sortPriceAsc');

  // Get all hotel elements
  var hotels = $('hotel_envelope');
  if (hotels.length === 0) throw new Error('No hotel element groups on page.');

  var padding = '100px'; // This can be a percentage, number of pixels, or any other valid CSS unit, like em. Do not include the trailing semicolon.
  var hotelsSpacingShim = function (hotels) {
    $(hotels).children().filter('table').children().filter('tbody').children().filter('tr').children().each(function () {
      $(this).css('padding-right', padding);
    });
  };

  // The button holder is a single element called sort_button
  var sortHolder = $('sort_button').get()[0];

  // Apply CSS styles to keep table spacing consistent before and after sort
  hotelsSpacingShim(hotels);

  var sortHotelsByAlpha = function (hotels) {
    var predicate = function (a, b) {
      var aValue, bValue;
      aValue = $(a).children().filter('div.filter').children().filter('div.sort').first().data('alpha').toLowerCase() || -1;
      bValue = $(b).children().filter('div.filter').children().filter('div.sort').first().data('alpha').toLowerCase() || -1;

      // // Not all hotel envelope elements will have a hotel_alpha element
      // if ($(a.children).filter('div').length >= 1) {
      //   aElement = $(a.children).filter('hotel_alpha')[0];
      //   aValue = parseInt($(aElement).attr('value').split(' ').join(''));
      // } else {
      //   aValue = 999999999;
      // }
      // if ($(b.children).filter('hotel_alpha').length >= 1) {
      //   bElement = $(b.children).filter('hotel_alpha')[0];
      //   bValue = parseInt($(bElement).attr('value').split(' ').join(''));
      // } else {
      //   bValue = 999999999;
      // }
      if (aValue < bValue){
       return -1;
      } else if (aValue > bValue){
          return  1;
      } else{
          return 0;
      }
    };
    return hotels.sort(predicate)
  };

  var sortHotelsByPriceDesc = function (hotels) {
    var predicate = function (a, b) {


      // var aElement, bElement, aValue, bValue;
      // if ($(a.children).filter('hotel_alpha').children().length >= 1) {
      //   aElement = $(a.children).filter('hotel_alpha').children()[0];
      //   aPrice = parseInt($(aElement).attr('value').split(' ').join(''));
      // } else {
      //   aPrice = -100;
      // }
      //
      // if ($(b.children).filter('hotel_alpha').children().length >= 1) {
      //   bElement = $(b.children).filter('hotel_alpha').children()[0];
      //   bPrice = parseInt($(bElement).attr('value').split(' ').join(''));
      // } else {
      //   console.log("Price not defined");
      //   console.log(b);
      //   bPrice = -100;
      // }
      // console.log("Comparing: " + bPrice + " to " + aPrice);
      return bPrice - aPrice;
    };
    return hotels.sort(predicate);
  };

  var sortHotelsByPriceAsc = function (hotels) {
    return $(sortHotelsByPriceDesc(hotels)).get().reverse();
  }


  $(sortAlpha).click(function () {
    $(hotels).detach();
    hotels = sortHotelsByAlpha(hotels);
    $(sortHolder).append(hotels);
    hotelsSpacingShim(hotels);
  });

  $(sortPriceDesc).click(function () {
    $(hotels).detach();
    hotels = sortHotelsByPriceDesc(hotels);
    $(sortHolder).append(hotels);
    hotelsSpacingShim(hotels);
  });

  $(sortPriceAsc).click(function () {
    $(hotels).detach();
    hotels = sortHotelsByPriceAsc(hotels);
    $(sortHolder).append(hotels);
    hotelsSpacingShim(hotels);
  });
}
