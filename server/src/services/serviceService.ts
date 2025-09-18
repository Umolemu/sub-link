import {
  Service,
  IService,
  CreateServiceDTO,
  ServiceWithUserCountDTO,
} from "../models/serviceModel";
import { Subscription } from "../models/subscriptionModel";
import { Types } from "mongoose";

export async function getServices(): Promise<IService[]> {
  return Service.find();
}

export async function addService(service: CreateServiceDTO): Promise<IService> {
  const newService = new Service(service);
  await newService.save();
  return newService;
}

export async function deleteService(id: string): Promise<boolean> {
  const result = await Service.findByIdAndDelete(id);

  if (!result) return false;

  await Subscription.deleteMany({ serviceId: result._id });
  return !!result;
}

export async function getServicesWithUserCount(): Promise<
  ServiceWithUserCountDTO[]
> {
  const services = await Service.find();

  const result = await Promise.all(
    services.map(async (service) => {
      const userCount = await Subscription.countDocuments({
        serviceId: service._id,
      });

      return {
        _id: (service._id as Types.ObjectId).toString(),
        name: service.name,
        description: service.description,
        price: service.price,
        category: service.category,
        icon: service.icon,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
        userCount,
      };
    })
  );

  return result;
}
