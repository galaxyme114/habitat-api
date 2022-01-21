var media = new Schema({
    user: {
        type: Schema.Types.ObjectId
    },
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String
    },
    file: {
        type: String
    }
});