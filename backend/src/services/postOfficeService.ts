import { PostOfficeModel } from '../models/PostOffice';
import { PostOffice } from '../entities/PostOffice';

class PostOfficeService {
  async createPostOffice(postOffice: PostOffice): Promise<PostOffice> {
    const newPostOffice = new PostOfficeModel(postOffice);
    return await newPostOffice.save();
  }

  async getPostOffices(): Promise<PostOffice[]> {
    return await PostOfficeModel.find().exec();
  }

  async getPostOfficeByZipCode(zipCode: string): Promise<PostOffice | null> {
    try {
      const postOffice = await PostOfficeModel.findOne({ zipCode }).exec();
      return postOffice;
    } catch (error) {
      throw new Error('Failed to fetch PostOffice by zipCode');
    }
  }

  async updatePostOffice(id: string, updatedPostOfficeData: PostOffice): Promise<PostOffice | null> {
    try {
      const updatedPostOffice = await PostOfficeModel.findByIdAndUpdate(id, updatedPostOfficeData, { new: true }); 
      return updatedPostOffice;
    } catch (error) {
      throw error; 
    }
  }

  async deletePostOffice(id: string): Promise<PostOffice | null> {
    try {
      const deletedPostOffice = await PostOfficeModel.findByIdAndDelete(id);
      return deletedPostOffice; 
    } catch (error) {
      console.error('Error deleting post office:', error);
      throw error;
    }
  }


}

export default new PostOfficeService();