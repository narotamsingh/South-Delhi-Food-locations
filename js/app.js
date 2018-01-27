window.onerror = function(e){
    console.log(e);
};

// Model for Filter
var filter = function (name, value) {
    this.name = name;
    this.value = value;
};

// Controller
function initViewModel(venues) {
    // Initialize List View
    ListViewModel = ko.applyBindings(new ListViewModel(venues));
}

// List View Model
var ListViewModel = function (venues) {
    var self = this;
    // Array of venues from foursquare api call
    self.venues = venues;
    // Binded Data for list view of locations
    self.locations = ko.observableArray();
    // Currently Selected filter from UI
    self.currentFilter = ko.observable();
    // List of filters
    self.filters = ko.observableArray([
                                new filter("All", "All"),
                                new filter("Indian", "Indian Restaurant"),
                                new filter("Asian", "Asian Restaurant"),
                                new filter("Café", "Café"),
                                new filter("Diner", "Diner"),
                                new filter("Japanese", "Japanese Restaurant"),
                                new filter("French", "French Restaurant"),
                                new filter("Mexican", "Mexican Restaurant"),
                                new filter("Coffee", "Coffee Shop"),
                                new filter("Italian", "Italian Restaurant"),
                                new filter("Tea", "Tea Room")]);
    // Filtered Locations and Passes Array to locations observable
    self.filterLocations = ko.computed(function () {
        if (!self.currentFilter()) {
            console.log("All List");
            deleteMarkers();
            createMarkers(self.venues);
            return self.locations(self.venues);
        } else if (self.currentFilter().name === "All") {
            console.log("All List");
            hideMarkers(self.venues);
            showMarkers(self.venues)
            return self.locations(self.venues);
        } else {
            console.log("List has been filtered to: " + self.currentFilter().value);
            hideMarkers(self.venues);
            showMarkers(ko.utils.arrayFilter(self.venues, function (venue) {
                if (venue.categories[0].name === self.currentFilter().value) {
                    return true;
                }
            })
            );
            return self.locations(
                ko.utils.arrayFilter(self.venues, function (venue) {
                    if (venue.categories[0].name === self.currentFilter().value) {
                        return true;
                    }
                })
            );
        }
    });
};

// List Item Click Event
function listItemClick(location) {
    for (var i in markers) {
            markers[i].setAnimation(null);
        }
    for (i in infoWindows) {
        infoWindows[i].close();
    }
    var marker;
    for (i in markers) {
        if (location.name === markers[i].title) {
            markers[i].setAnimation(google.maps.Animation.BOUNCE);
            marker = markers[i];
        }
    }
    var name = location.name;
    var phone = location.contact.formattedPhone;
    var address = location.location.formattedAddress;
    var count = location.stats.checkinsCount;
    var url = location.url;
    if (!phone) {
        phone = "---";
    }
    if (!address) {
        address = "---";
    }
    if (!url) {
        url = "---";
    }
    var infowindow = new google.maps.InfoWindow({
      content:"<b>Name:</b> " + name + "<br>" +
              "<b>Phone:</b> " + phone + "<br>" +
              "<b>Address:</b> " + address + "<br>" +
              "<b>Checkins:</b> " + count + "<br>" +
              "<b>Web Site:</b> " + url + ""
    });
    infoWindows.push(infowindow);
    infowindow.open(map, marker);
}

// Marker View Model
function createMarkers(locations) {
    for (var i in locations) {
        var marker = new google.maps.Marker({
            position: {lat:locations[i].location.lat, lng:locations[i].location.lng},
            map:map,
            animation:google.maps.Animation.DROP,
            title:locations[i].name
        });
        attachInfo(marker, locations[i]);
        locations[i].marker = marker;
        markers.push(marker);
    }
}

function showMarkers(locations) {
      locations.forEach(function(location) {
          location.marker.setVisible(true);
        });
}

function hideMarkers(locations) {
      locations.forEach(function(location) {
          location.marker.setVisible(false);
        });
}

function setMapOnAll(map) {
    for (var i in markers) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function attachInfo(marker, location) {
    var name = location.name;
    var phone = location.contact.formattedPhone;
    var address = location.location.formattedAddress;
    var count = location.stats.checkinsCount;
    var url = location.url;

    if (!phone) {
        phone = "---";
    }
    if (!address) {
        address = "---";
    }
    if (!url) {
        url = "---";
    }
    var infowindow = new google.maps.InfoWindow({
        content:"<b>Name:</b> " + name + "<br>" +
                "<b>Phone:</b> " + phone + "<br>" +
                "<b>Address:</b> " + address + "<br>" +
                "<b>Checkins:</b> " + count + "<br>" +
                "<b>Web Site:</b> " + url + ""
    });
    infoWindows.push(infowindow);
    marker.addListener("click", function () {
        for (var i in markers) {
            markers[i].setAnimation(null);
        }
        for (i in infoWindows) {
            infoWindows[i].close();
        }
        infowindow.open(map, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
    });
}
