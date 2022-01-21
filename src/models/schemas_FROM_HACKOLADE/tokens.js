var tokens = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    blacklisted: {
        type: Boolean,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    expires: {
        type: Date,
        required: true
    },
    type: {
        type: String,
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
    __v: {
        type: Number,
        required: true
    }
});