import { tool } from "@langchain/core/tools"
import { z } from "zod"
import connectDb from "@/lib/connectDb"
import Order from "@/models/order.model"
import Product from "@/models/product.model"

// Tool 1: Buyer ke apne orders ka status/history
export const getOrderStatusTool = (userId: string) => tool(
    async () => {
        await connectDb()
        const orders = await Order.find({ buyer: userId })
            .populate("products.product", "title price")
            .sort({ createdAt: -1 })
            .limit(5)

        if (!orders.length) {
            return "No orders found for this user."
        }

        return orders.map(o => ({
            orderId: o._id.toString().slice(-6),
            status: o.orderStatus,
            totalAmount: o.totalAmount,
            paymentMethod: o.paymentMethod,
            isPaid: o.isPaid,
            placedOn: o.createdAt,
            deliveryDate: o.deliveryDate || null,
            items: o.products.map((p: any) => ({
                name: p.product?.title,
                quantity: p.quantity,
                price: p.price
            }))
        }))
    },
    {
        name: "get_order_status",
        description: "Get the current user's recent order statuses, payment info, items, and delivery dates.",
        schema: z.object({})
    }
)

// Tool 2: Product search (multi-vendor, sirf approved+active products)
export const searchProductsTool = tool(
    async ({ query }: { query: string }) => {
        await connectDb()
        const products = await Product.find({
            isActive: true,
            verificationStatus: "approved",
            $or: [
                { title: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]
        })
            .populate("vendor", "name shopName")
            .limit(10)

        if (!products.length) {
            return `No products found matching "${query}".`
        }

        return products.map(p => ({
            name: p.title,
            category: p.category,
            price: p.price,
            inStock: p.isStockAvailable && p.stock > 0,
            vendor: (p.vendor as any)?.shopName || (p.vendor as any)?.name,
            freeDelivery: p.freeDelivery,
            payOnDelivery: p.payOnDelivery
        }))
    },
    {
        name: "search_products",
        description: "Search available products by name or category across all vendors. Use this when the user asks about product availability, prices, or wants suggestions.",
        schema: z.object({
            query: z.string().describe("The search term - product name or category")
        })
    }
)

// Tool 3: Cart total calculate karna
export const calculateCartTool = tool(
    async ({ items }: { items: { name: string; quantity: number }[] }) => {
        await connectDb()

        const results = []
        let total = 0

        for (const item of items) {
            const product = await Product.findOne({
                title: { $regex: item.name, $options: "i" },
                isActive: true,
                verificationStatus: "approved"
            })

            if (!product) {
                results.push(`"${item.name}" not found in our catalog.`)
                continue
            }

            const itemTotal = product.price * item.quantity
            total += itemTotal

            results.push({
                name: product.title,
                pricePerUnit: product.price,
                quantity: item.quantity,
                itemTotal
            })
        }

        return { items: results, grandTotal: total }
    },
    {
        name: "calculate_cart_total",
        description: "Calculate the total price for a list of products with quantities. Use this when the user asks 'how much would X cost' before ordering.",
        schema: z.object({
            items: z.array(
                z.object({
                    name: z.string().describe("Product name"),
                    quantity: z.number().describe("Quantity requested")
                })
            )
        })
    }
)