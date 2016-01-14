var Quadtree;
(function (Quadtree) {
    var Bounds = (function () {
        function Bounds(x, y, width, height) {
            if (!(this instanceof Bounds)) {
                return new Bounds(x, y, width, height);
            }
            this.leftX = Quadtree.validateNumber(x, 'x');
            this.topY = Quadtree.validateNumber(y, 'y');
            this.width = Quadtree.validateNumber(width, 'widht');
            this.height = Quadtree.validateNumber(height, 'height');
            this.rightX = x + width;
            this.bottomY = y + height;
            this.middleX = this.rightX - width / 2;
            this.middleY = this.bottomY - width / 2;
        }
        return Bounds;
    })();
    Quadtree.Bounds = Bounds;
})(Quadtree || (Quadtree = {}));
//# sourceMappingURL=Bounds.js.map