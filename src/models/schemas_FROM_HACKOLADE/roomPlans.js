var roomPlans = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    habitat: {
        type: Schema.Types.ObjectId
    },
    dimensions: new Schema({
        roomHeight: {
            type: Number
        },
        walls: [
            new Schema({
                x: {
                    type: Number
                },
                y: {
                    type: Number
                }
            })
        ]
    }),
    canvas: {
        type: Schema.Types.Mixed
    },
    objects: [
        new Schema({
            type: {
                type: String
            },
            file: {
                type: String
            },
            x: {
                type: Number
            },
            y: {
                type: Number
            }
        })
    ]
});
