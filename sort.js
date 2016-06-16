// More JS to handle sort buttons and sorting
(function () {
  if (!window.jQuery) throw new Error('jQuery was not loaded. Cannot continue.');
  $(document).ready(function () {
  	// Create three buttons to sort alphabetically, by price descending, and by price ascending
  	var sortAlpha, sortPriceDesc, sortPriceAsc;
  	sortAlpha = document.createElement('button');
  	sortAlpha.setAttribute('type', 'button');
  	$(sortAlpha).addClass('sortAlpha') // To style: .sortAlpha {...}
    $(sortAlpha).text('Sort Alphabetically');

    sortPriceDesc = document.createElement('button');
    sortPriceDesc.setAttribute('type', 'button');
    $(sortPriceDesc).addClass('sortPriceDesc'); // To style: .sortPriceDesc {...}
    $(sortPriceDesc).text('Sort by Price (Descending)');

    sortPriceAsc = document.createElement('button');
    sortPriceAsc.setAttribute('type', 'button');
    $(sortPriceAsc).addClass('sortPriceAsc'); // To style: .sortPriceAsc {...}
    $(sortPriceAsc).text('Sort by Price (Ascending)');

    // The button holder is a single element called sort_button
    var sortHolder = $('sort_button');
    if (sortHolder.length === 0) throw new Error('Could not find sort button holder element. Did the page load completely?');

    $.each([sortAlpha, sortPriceAsc, sortPriceDesc], function(index, element) {
      $(sortHolder).append(element);
    });

    // Get all hotel elements
    var hotels = $('hotel_envelope');
    if (hotels.length === 0) throw new Error('No hotel element groups on page.');

    var padding = '100px'; // This can be a percentage, number of pixels, or any other valid CSS unit, like em. Do not include the trailing semicolon.
    var hotelsSpacingShim = function (hotels) {
      $(hotels).children().filter('table').children().filter('tbody').children().filter('tr').children().each(function () {
        $(this).css('padding-right', padding);
      });
    };

    // Apply CSS styles to keep table spacing consistent before and after sort
    hotelsSpacingShim(hotels);

    var sortHotelsByAlpha = function (hotels) {
      var predicate = function (a, b) {
        aElement = $(a.children).filter('hotel_alpha')[0];
        aValue = parseFloat($(aElement).attr('value').split(' ').join(''));

        bElement = $(b.children).filter('hotel_alpha')[0];
        bValue = parseFloat($(bElement).attr('value').split(' ').join(''));

        return aValue - bValue;
      };
      return hotels.sort(predicate)
    };

    var sortHotelsByPriceDesc = function (hotels) {
      var predicate = function (a, b) {
        aElement = $(a.children).filter('hotel_alpha').children()[0];
        aPrice = parseFloat($(aElement).attr('value').split(' ').join(''));

        bElement = $(b.children).filter('hotel_alpha').children()[0];
        bPrice = parseFloat($(bElement).attr('value').split(' ').join(''));

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
      sortHolder.after(hotels);
      hotelsSpacingShim(hotels);
    });

    $(sortPriceDesc).click(function () {
      $(hotels).detach();
      hotels = sortHotelsByPriceDesc(hotels);
      sortHolder.after(hotels);
      hotelsSpacingShim(hotels);
    });

    $(sortPriceAsc).click(function () {
      $(hotels).detach();
      hotels = sortHotelsByPriceAsc(hotels);
      sortHolder.after(hotels);
      hotelsSpacingShim(hotels);
    });
  });
})();
