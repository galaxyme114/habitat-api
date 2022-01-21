var habitatPlans = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    habitat: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    items: [
        new Schema({
            name: {
                type: String
            },
            members: [
                {
                    type: Schema.Types.ObjectId
                }
            ],
            messages: [
                new Schema({
                    user: {
                        type: Schema.Types.ObjectId
                    },
                    message: {
                        type: String
                    }
                })
            ],
            attachments: [
                {
                    type: Schema.Types.ObjectId
                }
            ]
        })
    ]
});
