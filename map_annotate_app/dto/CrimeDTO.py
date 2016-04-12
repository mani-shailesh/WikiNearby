from map_annotate_app.extras import Location


class CrimeDTO:

    def __init__(self):
        self.type = ""
        self.fir_no = ""
        self.location = Location.Location()
        self.timestamp = None
        self.url_link = ""
