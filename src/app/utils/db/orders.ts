import prisma from '@/lib/prisma';
import { Order, OrderItem } from '@/generated/prisma';

const getOrders = async (userEmail: string): Promise<Order[]> => {
  return await prisma.order.findMany({
    where: { user: { email: userEmail } },
    include: { items: true },
  });
};

const getOrderItems = async (orderIds: string[]): Promise<OrderItem[]> => {
  return await prisma.orderItem.findMany({
    where: { orderId: { in: orderIds } },
  });
}

export { getOrders, getOrderItems };