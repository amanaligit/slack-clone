class Namespace {
    constructor(id, title, img, endpoint) {
        this.id = id;
        this.title = title;
        this.img = img;
        this.endpoint = endpoint;
        this.rooms = [];
    }

    addRoom(roomObj) {
        this.rooms.push(roomObj);
    }
}

module.exports = Namespace;