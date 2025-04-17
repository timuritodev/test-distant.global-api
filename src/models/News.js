const { Schema, model: createModel } = require('mongoose');

const NewsSchema = new Schema(
	{
		author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		title: { type: String, required: true },
		content: { type: String, required: true },
		status: {
			type: String,
			enum: ['draft', 'published', 'scheduled'],
			default: 'draft',
		},
		publishAt: { type: Date },
		images: [String],
		attachments: [String],
	},
	{ timestamps: true }
);

module.exports = createModel('News', NewsSchema);
