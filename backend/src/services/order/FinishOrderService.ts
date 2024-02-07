import prismaClient from "../../prisma";

interface OrderRquest {
    order_id: string;
}

class FinishOrderService {
    async execute({ order_id }: OrderRquest) {

        const order = await prismaClient.order.update({
            where: {
                id: order_id
            },
            data: {
                status: true
            }
        });

        return order;
    }

}

export { FinishOrderService };