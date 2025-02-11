import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      const err = error as Error;
      res.status(401).json({ message: err.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params;
      if (!uuid) {
        res.status(400).json({ message: 'UUID is required' });
        return;
      }

      const user = await UserService.update(uuid, req.body);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      const err = error as Error;
      res.status(401).json({ message: err.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params;
      if (!uuid) {
        res.status(400).json({ message: 'UUID is required' });
        return;
      }

      await UserService.delete(uuid);
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      res.status(401).json({ message: err.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAll(req.query);
      res.json(users);
    } catch (error) {
      const err = error as Error;
      res.status(401).json({ message: err.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params;
      if (!uuid) {
        res.status(400).json({ message: 'UUID is required' });
        return;
      }

      const user = await UserService.getById(uuid);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      const err = error as Error;
      res.status(401).json({ message: err.message });
    }
  }
}
