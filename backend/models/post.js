import mongoose from "mongoose";

const { Schema } = mongoose;

const postModel = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		imgUrl: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		creator: {
			name: {
				type: String,
				required: true,
			},
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Post", postModel);
