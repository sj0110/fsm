import { Request, Response } from 'express';
import { ServiceService } from '../services/service.service';

export class ServiceController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body.serviceProviderId) {
        res.status(400).json({ message: 'serviceProviderId (UUID) is required' });
        return;
      }

      const service = await ServiceService.create(req.body);
      res.status(201).json(service);
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

      const service = await ServiceService.update(uuid, req.body);
      if (!service) {
        res.status(404).json({ message: 'Service not found' });
        return;
      }
      res.json(service);
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

      await ServiceService.delete(uuid);
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      res.status(401).json({ message: err.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const services = await ServiceService.getAll(req.query);
      res.json(services);
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

      const service = await ServiceService.getById(uuid);
      if (!service) {
        res.status(404).json({ message: 'Service not found' });
        return;
      }
      res.json(service);
    } catch (error) {
      const err = error as Error;
      res.status(401).json({ message: err.message });
    }
  }
}
