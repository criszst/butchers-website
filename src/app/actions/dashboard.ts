// update all dashboard status

import React from "react";
import getProducts from "../utils/db/products";
import { getOrderItems, getOrders } from "../utils/db/orders";
import prisma from "@/lib/prisma";


/**
 * Retrieves the total revenue from all orders in the database
 *
 * @returns total revenue
 */
export async function updateRevenue() {
  const orders = await prisma.order.findMany({});
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  return totalRevenue;
}

export async function updateOrders() {
  const orders = await prisma.order.findMany({});
  return orders;
}