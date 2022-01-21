var habitats = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    users: [
        {
            type: Schema.Types.ObjectId
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    },
    habitatPlans: [
        {
            type: Schema.Types.ObjectId
        }
    ],
    moodBoards: [
        {
            type: Schema.Types.ObjectId
        }
    ],
    roomPlans: [
        {
            type: Schema.Types.ObjectId
        }
    ]
});
