import mongoose from 'mongoose';

export async function connect() {
  try {
    await mongoose.connect(
      'mongodb+srv://semanaheroi:BCwHjjyHxdwP4Yrq@cluster0.t6hmb.mongodb.net/hero-tickets',
    );
  } catch (error) {
    console.log('🚀 ~ file: database.ts:5 ~ connect ~ error:', error);
  }
}
