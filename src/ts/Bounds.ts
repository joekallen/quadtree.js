import {validateNumber} from './util';

class Bounds {
  leftX:number;
  rightX:number;
  topY:number;
  bottomY:number;
  middleX:number;
  middleY:number;
  width:number;
  height:number;

  constructor(x:number, y:number, width:number, height:number) {
    // TODO: Make this an interface

    if (!(this instanceof Bounds)) {
      return new Bounds(x, y, width, height);
    }

    if( width < 0 ){
      throw new RangeError('width must be >= 0');
    }

    if( height < 0 ){
      throw new RangeError('height must be >= 0');
    }

    this.leftX = validateNumber(x, 'x');
    this.topY = validateNumber(y, 'y');
    this.width = validateNumber(width, 'width');
    this.height = validateNumber(height, 'height');

    this.rightX = x + width;
    this.bottomY = y + height;

    this.middleX = this.rightX - width / 2;
    this.middleY = this.bottomY - height / 2;
  }
};

export default Bounds;