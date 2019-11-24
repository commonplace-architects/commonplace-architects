"use strict";
angular
    .module('app')
    .controller('CommunityController', function ($rootScope, $scope, $window, $anchorScroll, community) {
        this.$onInit = function () {
            $scope.extra_info_section = {
                show: false,
            };

            $scope.tooltip_text = '';
            $scope.mapResize = () => {
                $scope.map.updateSize();
            };

            if (community.length > 0) {
                $scope.community = community[0];
                if (!$scope.community.location) {
                    $scope.community.location = [27.9592, -15.5855];
                }
                initMap();
                let newHeight = $window.innerHeight * 0.75;
                $('#map-wrapper').css('min-height', newHeight);
                $scope.map.updateSize();
            }
        };

        $scope.plusSlides= plusSlides;
        // Next/previous controls
        function plusSlides(n) {
            showSlides($scope.slideIndex += n);
        }

        // Thumbnail image controls
        function currentSlide(n) {
            showSlides($scope.slideIndex = n);
        }

        function showSlides(n) {
            let i;
            let slides = document.getElementsByClassName("mySlides");
            if (n > slides.length) {
                $scope.slideIndex = 1
            }
            if (n < 1) {
                $scope.slideIndex = slides.length
            }
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            slides[$scope.slideIndex - 1].style.display = "block";
        }


        function initMap() {
            let source = new ol.source.OSM();

            const center = ol.proj.transform($scope.community.location.reverse(), 'EPSG:4326', 'EPSG:3857');
            $('#map').css('height', $window.innerHeight * 0.75);
            let map = new ol.Map({
                target: 'map',
                numZoomLevels: 20,
                layers: [
                    new ol.layer.Tile({
                        source: source
                    })
                ],
                view: new ol.View({
                    zoom: 15,
                    center: center
                })
            });

            angular.element($window).bind('resize', function () {
                let newHeight = $window.innerHeight * 0.75;
                $('#map-wrapper').css('min-height', newHeight);
                map.updateSize();
            });

            // add markers to the map
            let markers = [];
            $scope.community.sites.forEach((site) => {
                let marker = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.transform(site.location.reverse(), 'EPSG:4326', 'EPSG:3857')),
                });

                let imgSrc = 'assets/images/pin_primary_blue.png';
                site.random_value = Math.floor(Math.random() * 640000);
                if (site.state === "active") {
                    imgSrc = 'assets/images/pin_secondary_red.png';
                } else if (site.state === "community asset transfer") {
                    imgSrc = 'assets/images/pin_secondary_orange.png';
                }

                marker.setId(site.name);
                marker.set('site', site, true);

                marker.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            crossOrigin: 'anonymous',
                            src: imgSrc,
                            scale: 0.1,
                        })
                    }
                ));

                markers.push(marker);
            });

            if (markers.length > 0) {
                let vectorSource = new ol.source.Vector({features: markers});
                map.addLayer(new ol.layer.Vector({source: vectorSource}));
            }

            map.on('click', function (e) {
                e.preventDefault();
                map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
                    let site = feature.get('site');
                    $scope.extra_info_section.site = site;
                    $scope.extra_info_section.show = true;
                    $scope.extra_info_section.slide_index = 0;
                    $rootScope.$apply();

                    $scope.slideIndex = 1;
                    showSlides($scope.slideIndex);
                    $anchorScroll('extra-info-section');
                    $scope.map.updateSize();
                });
            });

            map.on("pointermove", function (event) {
                let mouseCoordInMapPixels = [event.originalEvent.offsetX, event.originalEvent.offsetY];

                //detect feature at mouse coords
                let hit = map.forEachFeatureAtPixel(mouseCoordInMapPixels, function (feature, layer) {
                    return {hit: true, f: feature};
                });

                if (!hit) {
                    hit = {hit: false}
                }

                if (hit.hit) {
                    $('#map').css("cursor", "pointer");
                } else {
                    $('#map').css("cursor", "");
                }

                displayFeatureInfo(mouseCoordInMapPixels, hit.f);

            });

            $scope.map = map;
        }

        function displayFeatureInfo(pixel, feature) {
            let info = $('#info');
            if (!feature) {
                info.tooltip('dispose');
                return;
            }

            info.css({
                left: pixel[0] + 'px',
                top: (pixel[1] - 15) + 'px',
            });

            if (feature) {
                info.attr('title', feature.get('site').state)
                    .tooltip('show');
            }
        }
    });