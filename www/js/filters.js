angular.module('immopoly.filters', ['ionic', 'ngCordova'])

.filter('filterAnnonces', function() {
        // $scope.freelancers=$filter('filterAnnonces')(freelancers,$scope.filter);
        // function to invoke by Angular each time
        // Angular passes in the `items` which is our Array
        return function(items, arg) {
            // Create a new Array
            //console.log(arg);
            var filtered = [];
            var filter_by_cat = getElements(arg.list_cat);


            // loop through existing Array
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // check if the individual Array element begins with `a` or not
                if (arg.achat && !arg.location) {
                    // verification si projet urgent
                    if (item.type != "achat") continue;
                }
                if (!arg.achat && arg.location) {
                    // verification si projet urgent
                    if (item.type != "location") continue;
                }
                if (arg.budget != 0 && arg.budget != 100) {
                    // verification si projet urgent
                    var montant = arg.max * (arg.budget / 100);
                    if (item.prix > montant) continue;
                }
                //filter by categorie
                if (filter_by_cat.length != 0) {
                    if (!keyExists(item.categorie_id, filter_by_cat)) continue;
                }



                filtered.push(item);
            }

            function getElements(search) {
                var element = [];
                for (var k = 0; k < search.length; k++) {
                    if (search[k].selected) {
                        element.push(search[k]);
                    }
                }
                return element;
            }

            function keyExists(key, search) {
                if (!search || (search.constructor !== Array && search.constructor !== Object)) {
                    return false;
                }
                for (var i = 0; i < search.length; i++) {
                    if (search[i].id === key) {
                        return true;
                    }
                }
                //return key in search;
            }
            // boom, return the Array after iteration's complete
            return filtered;
        };
    });