import mongoose from 'mongoose';

const { Schema } = mongoose;
const docSchema = new Schema(
  {
    barcode: { type: String, index: true },
    checks: Number,
    last_answer: Schema.Types.Mixed
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Doc', docSchema);
