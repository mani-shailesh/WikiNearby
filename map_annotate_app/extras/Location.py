class Location:
    def __init__(self, lat, lng):
        # self.name = ""
        self.lat = lat
        self.lng = lng

    def json_dict(self):
        return_dict = {'lat': self.lat, 'lng': self.lng}
        return return_dict
