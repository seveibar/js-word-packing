var binpacking = (function(){

    // How much to move a Rect outward each step
    var closenessStep = 0.1;

    // How many degrees to travel to search for a new placement
    // around the center Rect point
    var radialStep = 5;
    
    /**
     * Packs rects within area and returns new list with rects in correct
     * location, may remove some rects.
     * 
     * @param area Rect: Area to pack rects within
     * @param rects [Rect]: List of rects sorted in order of importance
     * @param maxDistanceFactor: Size to distance ratio for rect to be from center
     *                           ex) 2 means rect could not be more than 2 of it's
     *                           size away
     * @return Non-overlapping packed rects
     **/
    function pack(area, rects, maxDistanceFactor){
        var placedRects = [];
        var unplaced = 0;
        for (var i = 0;i < rects.length;i++){
            var placedRect = placeRect(rects[i], placedRects, area, maxDistanceFactor);
            if (placedRect == null){
                // Rect could not be placed
                unplaced++;
            }else{
                placedRects.push(placedRect);
            }
        }
        console.log(unplaced + " rects could not be placed");
        return placedRects;
    }

    /**
     * Return a newly placed rect given a list of existing rects and the
     * area to place the rect within.
     *
     * @param rect Rect: A Rect to be placed in the area
     * @param placedRects [Rect]: List of Rects that could be collided with
     * @param area Rect: Area to place rect within
     * @param dRatio num: Max distance/size ratio that the rect can be placed
     * @return Rect: The place rect (not same object as rect parameter)
     **/
    function placeRect(rect, placedRects, area, dRatio){

        // First check that rect is in the area and there is collision at the
        // original location of the rect
        if (checkRectWithinArea(rect, area) && !checkCollisions(rect, placedRects)){
            // Nothing there! Just place the rect
            return rect.clone();
        }

        // There was a collision at the rects center location, so
        // we'll check in a circle around the rect with an expanding
        // radius until we're too far away
        var maxDistance = dRatio * rect.size;
        var rotationOffset = Math.random() * 360;
        var newRect = rect.clone();
        newRect.originalx = rect.x;
        newRect.originaly = rect.y;

        for (var currentRadius = rect.size * closenessStep;
             currentRadius < maxDistance;
             currentRadius += rect.size * closenessStep){
            for (var rotation = 0; rotation < 360; rotation += radialStep){
                var dx = Math.cos(rotationOffset + rotation * (Math.PI/180)) * currentRadius;
                var dy = Math.sin(rotationOffset + rotation * (Math.PI/180)) * currentRadius;
                newRect.x = rect.x + dx;
                newRect.y = rect.y + dy;
                newRect.calculateBounds(false);
                if (checkRectWithinArea(newRect, area) && !checkCollisions(newRect, placedRects)){
                    return newRect;
                }

            }
        }


        return null;
    }

    /**
     * Checks collision of rect against a list of Rects
     * 
     * @param rect Rect: Rect to check collisions against
     * @param placedRects [Rect]: Rects to check collision
     * @return: True if collision, false otherwise
     **/
    function checkCollisions(rect, placedRects){
        for (var i = 0; i < placedRects.length; i++){
            var placedRect = placedRects[i];
            if (!(
                    placedRect.left   > rect.right  ||
                    placedRect.right  < rect.left   ||
                    placedRect.top    > rect.bottom ||
                    placedRect.bottom < rect.top

                )) return true;
        }
        return false;
    }

    /**
     * Check that rect is completely within area
     * 
     * @param rect Rect: Rect to check within area
     * @param area Rect: Area to check that rect is within
     * @return: True if completely within area, else false
     **/
    function checkRectWithinArea(rect, area){
        return rect.left > area.left &&
               rect.right < area.right &&
               rect.top > area.top &&
               rect.bottom < area.bottom;
    }

    /**
     * Returns a Rect object that can be used for packing.
     * Call with new! ex) new Rect(0,0,100,120);
     * 
     * @param centerx, centery: Center of Rect
     * @param width,height: Size of Rect
     * @param properties: OPTIONAL Object w/ properties
     * @return Rect object to be used for packing
     **/
    function Rect(centerx, centery, width, height, properties){
        this.x = centerx;
        this.y = centery;
        this.width = width;
        this.height = height;
        this.properties = properties || {};
        this.calculateBounds();
    }

    /**
     * Calculates bounds of rectangle (call after changing x/y/width/height)
     *
     * @param recalculateSize bool: OPTIONAL if set to false, size will not be
     *                              recalculated
     **/
    Rect.prototype.calculateBounds = function(recalculateSize){
        this.left = this.x - this.width/2;
        this.right = this.x + this.width/2;
        this.top = this.y - this.height/2;
        this.bottom = this.y + this.height/2;
        if (recalculateSize !== false){
            this.size = Math.sqrt(this.width * this.width + this.height * this.height);
        }
    }

    /**
     * Draws Rect to canvas.
     *
     * @param context CanvasRenderingContext2d: Context to draw to
     **/
    Rect.prototype.draw = function(context){
        context.save();
        context.strokeStyle = "#f00";
        context.lineWidth = 2;
        context.strokeRect(
            this.x - this.width/2,
            this.y - this.height/2,
            this.width, this.height);
        if (this.originalx !== undefined && this.originaly !== undefined){
            context.globalAlpha = .2;
            context.beginPath();
            context.moveTo(this.originalx, this.originaly);
            context.lineTo(this.x, this.y);
            context.closePath();
            context.stroke();
        }
        context.restore();
    }

    /**
     * Creates new Rect from existing Rect, note that properties is not deep
     * copied
     **/
    Rect.prototype.clone = function(){
        return new Rect(this.x, this.y, this.width, this.height, this.properties);
    };

    /**
     * Adds property to Rect object (often font size or text value)
     *
     * @param propName String: Property name
     * @param propValue: Property value
     **/
    Rect.prototype.addProperty = function(propName, propValue){
        this.properties[propName] = propValue;
    };

    /**
     * Returns a previously stored property
     **/
    Rect.prototype.getProperty = function(propName){
        return this.properties[propName];
    }


    return {

        // Public Methods

        pack: pack,
        Rect: Rect,

        setClosenessStep: function(v){ closenessStep = v; },
        setRadialStep: function(v){ radialStep = v; }

    };
})();