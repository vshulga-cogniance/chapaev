var box2d = require('box2dweb-commonjs');

World = function () {

    this.b2world = new box2d.b2World();
    this.restitutionFactor = 0.99;
    this.items = [];

}

World.prototype.addChecker = function(x, y, radius) {

    // build fixture
    var circleFixDef = new box2d.b2FixtureDef;
    circleFixDef.density = 1;
    circleFixDef.friction = 10;
    circleFixDef.restitution = 0.7;
    // circleFixDef.filter.groupIndex = -1;

    // define car body
    var bodyDef = new box2d.b2BodyDef;
    bodyDef.type = box2d.b2Body.b2_dynamicBody;
    bodyDef.fixedRotation = true;
    bodyDef.position.Set(x, y);

    //create circle
    circleFixDef.shape = new box2d.b2CircleShape(radius);

    circle1 = this.b2world.CreateBody(bodyDef);
    circle1.CreateFixture(circleFixDef);

    this.items.push(circle1);
    return circle1;
}


World.prototype.update = function() {

    // emulate restitution
    for (var i = 1; i < this.items.length; i++) {
        var currentVelocity = this.items[i].GetLinearVelocity();
        var newVelocity = new box2d.b2Vec2(
            currentVelocity.x * this.restitutionFactor,
            currentVelocity.y * this.restitutionFactor
        );
        this.items[i].SetLinearVelocity(newVelocity);
    }

    // update physics
    this.b2world.Step(
        1 / 60      //frame-rate
        ,  10       //velocity iterations
        ,  10       //position iterations
    );
    this.b2world.ClearForces();

    var events = {};
    // TODO: trigger events
    // - out of border  events.border = [ id, id, id ]
    // - item stopped   events.stopped = [ id, id, id ]
    // - etc...
    return events
}

// exports the constructor properly
module.exports = World;