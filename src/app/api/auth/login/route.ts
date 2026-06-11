import { hashPassword, signToken } from "@/lib/auth";
import { findUserByName, findUserPassword } from "@/repositories/user.repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { name, password } = await req.json()

    const user = await findUserByName(name)
    const storedHash = await findUserPassword(name)

    if (!user || storedHash !== hashPassword(password)) {
        return NextResponse.json({ error: 'Nome ou senha incorretos' }, { status: 401 })
    }

    const token = signToken(user.id)
    const res = NextResponse.json({ ok: true })
    
    res.cookies.set('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7
    })

    return res
}