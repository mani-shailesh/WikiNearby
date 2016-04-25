class CrimeFilter:
    def __init__(self, north_east, south_west, type_id_list, date_from, date_to):
        self.north_east = north_east
        self.south_west = south_west
        self.type_id_list = type_id_list
        self.dateFrom = date_from
        self.dateTo = date_to
