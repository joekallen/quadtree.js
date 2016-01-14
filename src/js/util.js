var Quadtree;
(function (Quadtree) {
    function validateNumber(value, propertyName) {
        if (!isFinite(value)) {
            throw new TypeError(propertyName + ' must be a finite number');
        }
        return Number(value);
    }
    Quadtree.validateNumber = validateNumber;
})(Quadtree || (Quadtree = {}));
//# sourceMappingURL=util.js.map