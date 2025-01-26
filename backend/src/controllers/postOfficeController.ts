import { Request, Response } from "express";
import postOfficeService from "../services/postOfficeService";
import { PostOffice } from "../entities/PostOffice";
import { validationResult } from "express-validator";
import { isMongoDuplicateKeyError } from "../utils/errorUtils";

class PostOfficeController {
  async createPostOffice(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const postOffice: PostOffice = req.body;
      const createdPostOffice = await postOfficeService.createPostOffice(
        postOffice
      );
      res.status(201).json(createdPostOffice);
    } catch (error: any) {
      if (isMongoDuplicateKeyError(error)) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        res.status(400).json({
          error: `${duplicateField} already exists.`,
        });
        return;
      }
      res.status(500).json({ error: "Failed to create post office" });
    }
  }

  async getPostOffices(req: Request, res: Response) {
    try {
      const postOffices = await postOfficeService.getPostOffices();
      res.json({
        list: postOffices,
        total: postOffices.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve post offices" });
    }
  }

  async updatePostOffice(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = req.params.id;
      const updatedPostOfficeData = req.body as PostOffice;

      const updatedPostOffice = await postOfficeService.updatePostOffice(
        id,
        updatedPostOfficeData
      );

      if (!updatedPostOffice) {
        res.status(404).json({ error: "Post office not found" });
        return;
      }

      res.status(200).json(updatedPostOffice);
    } catch (error: any) {
      if (isMongoDuplicateKeyError(error)) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        res.status(400).json({
          error: `${duplicateField} already exists.`,
        });
        return;
      }

      res.status(500).json({ error: "Failed to create post office" });
    }
  }

  async deletePostOffice(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deletedPostOffice = await postOfficeService.deletePostOffice(id);
      if (!deletedPostOffice) {
        res.status(404).json({ error: "Post office not found" });
        return;
      }

      res.status(200).json(deletedPostOffice);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete post office" });
    }
  }
}
export default new PostOfficeController();
