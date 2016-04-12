from map_annotate_app.extras import Location

class CrimeDTO:

    def __init__(self):

        self.type = "";
        self.fir_no= "";
        self.location = Location.Location();
        self.timestamp = NULL;
        self.url_link = "";