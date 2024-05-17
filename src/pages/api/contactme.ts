import nodemailer from "nodemailer"
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: import.meta.env.USER_ID,
            pass: import.meta.env.PASSWORD
        }
    });

    const data = await request.formData()
    const name = data.get("name")
    const email = data.get("email")
    const message = data.get("message")

    if (!name || !email || !message) {
        return new Response(
            JSON.stringify({
                message: "Missing required feilds",
            }),
            { status: 200 }
        )
    }

    const info = await transport.sendMail({
        from: `${email}`,
        to: import.meta.env.EMAIL,
        subject: "Personal Message",
        text: `${message}`,
    })
    console.log(info.response)

    return new Response(
        JSON.stringify({
            message: "Message has been send!"
        }),
        { status: 200 }
    )
}

