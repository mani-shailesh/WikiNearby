// This prototype displays a marker at the center of IIT Ropar.
// When the user clicks the marker, an info window opens.

function initMap() {
  var IITRopar = {lat: 30.9755, lng: 76.5395};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: IITRopar
  });

  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">IIT Ropar</h1>'+
      '<div id="bodyContent">'+
	'<p>The Indian Institute of Technology Ropar (IIT Ropar) or IIT-RPR,'+
	' is an engineering and technology higher education institute located in Rupnagar, Punjab, India.'+
	' It is one of the eight newer Indian Institutes of Technology (IITs) established by the Ministry '+
	'of Human Resource Development MHRD, Government of India under The Institutes of Technology (Amendment) Act, '+
	'2011. The Act was passed in the Lok Sabha on 24 March 2011 and by the Rajya Sabha on 30 April 2012.'+
      '</p>'+
      '<p>Attribution: IIT Ropar, <a target="_blank" href="https://en.wikipedia.org/wiki/Indian_Institute_of_Technology_Ropar">'+
      'https://en.wikipedia.org/wiki/Indian_Institute_of_Technology_Ropar</a> '+
      '</p>'+
      '</div>'+
      '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  var marker = new google.maps.Marker({
    position: IITRopar,
    map: map,
    title: 'IIT Ropar'
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}