class Boundary:
    def __init__(self, top_left, top_right, bottom_right, bottom_left):
        """
        Initialized this object.
        :param top_left: `Location` object
        :param top_right: `Location` object
        :param bottom_right: `Location` object
        :param bottom_left: `Location` object
        """
        self.top_left = top_left
        self.top_right = top_right
        self.bottom_left = bottom_left
        self.bottom_right = bottom_right
