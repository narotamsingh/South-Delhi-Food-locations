// Foursquare API Requests
$.ajax({
    type: 'GET',
    url: 'https://api.foursquare.com/v2/venues/search',
    data: {
        client_id: 'ZABT0OZ2YRIE5GSXO504XBQRN55C1E4AONN1DK0NUYYGPJA1',
        client_secret: 'FVK2A1RSTDQ50Q4ZE20MUUN32JONXOTNLB31AR5EWOLBCNB4',
        ll: '28.592181,77.219193',
        radius: 1100,
        v: '20170801',
        categoryId: '4d4b7105d754a06374d81259',
        limit: 50
    },
    dataType: 'json'
})
.done(function(res) {
    console.log('successfully retrieved venues', res.response.venues);
    var data = res.response.venues;
    initViewModel(data);
})
.fail(function() {
    console.log('Failed to retrieve venues');
    notify('Failed to retrieve venues');
    initViewModel();
});

function notify(message) {
    $('#snackbar').addClass('mdl-snackbar--active');
    $('.mdl-snackbar__text').text(message);
}

// Error Handling Google Map API
function errorFunction() {
    console.log("Error Calling Google Maps");
    $("#map").append("Unable to reach google maps");
    notify("Unable to reach google servers");
}
