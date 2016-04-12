from map_annotate_app.extras import Location

class LegislatorDTO:

    def __init__(self):
        self.first_name = ""
        self.last_name = ""
        self.location = Location.Location()
        self.no_questions = None
        self.party = ""
