class Boundary:
    """
    Represents the geographical boundary on the map.
    """

    def __init__(self, north_east, south_west):
        """
        Initializes this object.
        `north_east` is an object of the class `Location`.
        `south_west` is an object of the class `Location`.
        """
        self.north_east = north_east
        self.south_west = south_west
