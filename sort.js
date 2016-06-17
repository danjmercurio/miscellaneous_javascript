// Check for jQuery
if (!window.jQuery) {
    throw new Error('jQuery was not loaded. Cannot continue.');
} else {
    var roomDetails = $('room_detail');
    if (roomDetails.length < 1) throw new Error('Unable to find any room detail blocks.');

    roomDetails.each(function() {
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
            $(showButton).click(function() {
                $(roomDetailElement).show();
                $(this).hide();
                $(hideButton).show();
            });

            $(hideButton).click(function() {
                $(roomDetailElement).hide();
                $(showButton).show();
            });
        } else {
            console.log('Room summary at block ' + blockNumber + ' has no data. Skipping...');
        }
    });

    /*
      Sorting logic starts here
    */

    // Three sort buttons should already exist in the DOM. Do the same as above.
    var sortAlpha = $('.sortAlpha');
    var sortPriceDesc = $('.sortPriceDesc');
    var sortPriceAsc = $('.sortPriceAsc');

    // Get all hotel elements
    var hotels = $('hotel_envelope');
    if (hotels.length === 0) throw new Error('No hotel element groups on page.');

    var padding = '100px'; // This can be a percentage, number of pixels, or any other valid CSS unit, like em. Do not include the trailing semicolon.
    var hotelsSpacingShim = function(hotels) {
        $(hotels).children().filter('table').children().filter('tbody').children().filter('tr').children().each(function() {
            $(this).css('padding-right', padding);
        });
    };

    // The button holder is a single element called sort_button
    var sortHolder = $('sort_button').get()[0];

    // Apply CSS styles to keep table spacing consistent before and after sort
    hotelsSpacingShim(hotels);

    var sortHotelsByAlpha = function(hotels) {
        var predicate = function(a, b) {
            var aValue, bValue;
            aValue = $(a).children().filter('div.filter').children().filter('div.sort').first().data('alpha').toLowerCase() || -1;
            bValue = $(b).children().filter('div.filter').children().filter('div.sort').first().data('alpha').toLowerCase() || -1;

            if (aValue < bValue) {
                return -1;
            } else if (aValue > bValue) {
                return 1;
            } else {
                return 0;
            }
        };
        return hotels.sort(predicate)
    };

    var sortHotelsByPriceDesc = function(hotels) {
        var predicate = function(a, b) {
            console.log(a, b);
            var sortCriteria = $("input[name='sortRateBy']:checked").val(); // will be either "high" or "low"

            if (!sortCriteria) throw new Error('no sort high/low');

            var aElement, bElement, aPrice, bPrice;

            if (sortCriteria == 'high') {
              aElement = $(a).children().filter('div.filter').children().filter('div.sort').first();
              bElement = $(b).children().filter('div.filter').children().filter('div.sort').first();

              // If either tag is missing, just
              console.log(aElement, bElement);

              aPrice = parseInt(aElement.attr('data-high')) || 0;
              bPrice = parseInt(bElement.attr('data-high')) || 0;

              console.log("aPrice, bPrice:", aPrice, bPrice);
            }
            
            if (sortCriteria == 'low') {
              aElement = $(a).children().filter('div.filter').children().filter('div.sort').first();
              bElement = $(b).children().filter('div.filter').children().filter('div.sort').first();

              console.log(aElement, bElement);

              aPrice = parseInt(aElement.attr('data-low')) || 0;
              bPrice = parseInt(bElement.attr('data-low')) || 0;

              console.log("aPrice, bPrice:", aPrice, bPrice);
            }


            if (aPrice === bPrice) return 0;

            if (aPrice > bPrice) {
                return -1;
            } else  {
                return 1;
              }
        };
        return hotels.sort(predicate);
    };

    var sortHotelsByPriceAsc = function(hotels) {
        return $(sortHotelsByPriceDesc(hotels)).get().reverse();
    }


    $(sortAlpha).click(function() {
        $(hotels).detach();
        hotels = sortHotelsByAlpha(hotels);
        $(sortHolder).append(hotels);
        hotelsSpacingShim(hotels);
    });

    $(sortPriceDesc).click(function() {
        $(hotels).detach();
        hotels = sortHotelsByPriceDesc(hotels);
        $(sortHolder).append(hotels);
        hotelsSpacingShim(hotels);
    });

    $(sortPriceAsc).click(function() {
        $(hotels).detach();
        hotels = sortHotelsByPriceAsc(hotels);
        $(sortHolder).append(hotels);
        hotelsSpacingShim(hotels);
    });

    /*
      Hotel filter/filtering code starts here
    */

    // Check the filter boxes and return selected filter criteria
    var getFilterCriteria = function() {
        var criteria = {
          features: [],
          location: [],
          type: [],
          stars: []
        };
        jQuery.each(criteria, function(criterion, holderArray) {
            // for all all checked input[name='rate'] elements
            var elements;
            // "stars" are called "rate" (data-rate=) in the DOM. Fix later.
            criterion == "stars" ? elements = $("input[name='rate']:checked") : elements = $("input[name=" + criterion + "]:checked");
            // add the value attr to the list
            elements.each(function() {
                if (criterion == 'stars') {
                    // In the case of rates (# of stars), we need to strip all non numeric characters
                    // Because in the DOM, the values are "star4" instead of "4"
                    holderArray.push($(this).attr('value').replace(/\D/g, ''));
                } else {
                    holderArray.push($(this).attr('value'));
                }
            });
        });
        return criteria;
    };

    // Given a filter criteria object, filter the hotels on the page
    var filterHotels = function(criteria) {
        var hotels = hotels || $('hotel_envelope');
        hotels.detach();
        hotels.filter(function(index, element) {
            var matchFlag = true;
            /*
              $(x).data();
                Object { features: "", location: "beachaccess", type: "selfservice", area: "koh", stars: 3 }
              getFilterCriteria();
                Object { rate: Array[2], type: Array[3], location: Array[2], features: Array[6] }
            */
            // Find the child element of the hotel envelope with filter data
            var dataElement = $(element).children().filter('div.filter')[0];
            // Get its data
            // hotelData = { features: "", location: "beachaccess", type: "selfservice", area: "koh", stars: 3 }
            var hotelData = $(dataElement).data();
            hotelData['stars'] = hotelData['stars'].toString();
            if (typeof(hotelData['features']) == 'string') {
              hotelData['features'].split(',');
            }
            // TODO In the key/value pairs, values will just be strings. Convert them
            // to arrays to compare with criteria object
            // var hotelData = jQuery.each(hotelData, function(key, value) {
            //     // If value contains multiple comma-separated strings, they will form an array
            //     // Otherwise, we get [value]
            //     hotelData[key] = value.split(',')
            // });
            console.log(criteria);
            console.log(hotelData);

            jQuery.each(criteria, function(key, value) {
              // for key in criteria and hoteldata, if hotelData[key] (string) not in criteria[key] (array of strings)...
              if (key == 'features') {
                if (criteria[key].indexOf(hotelData[key]) == -1) {
                  matchFlag = false;
                }
              } else {
                if (criteria[key].indexOf(hotelData[key]) == -1) {
                  matchFlag = false;
                }
              }
            });

            // jQuery.each(criteria, function(criterion, criteriaArray) {
            //     // location
            //     if (criteriaArray.indexOf(hotelData[criterion]) == -1) {
            //         matchFlag = false;
            //     }
            // });
            return matchFlag;
        });
        return hotels;
    };

    // Event handler for filters. On any checkbox click, get an object representing desired filter criteria
    $("td.small input[type='checkbox']").click(function() {
        var filterCriteria = getFilterCriteria();
        var filteredHotels = filterHotels(filterCriteria);
        $(sortHolder).append(filteredHotels);
    });
}
