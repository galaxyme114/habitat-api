var moodBoards = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    habitat: {
        type: Schema.Types.ObjectId
    },
    type: {
        type: String
    },
    layout: {
        type: String
    },
    style: {
        type: String
    },
    boards: [
        new Schema({
            name: {
                type: String
            },
            layout: {
                type: String
            },
            images: [
                {
                    type: Schema.Types.ObjectId
                }
            ]
        })
    ]
});
