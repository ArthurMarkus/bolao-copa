import { hashPassword, signToken } from "@/lib/auth";
import { createUser, findUserByName } from "@/repositories/user.repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { name, password } = await req.json()

    if (await findUserByName(name) !== null) return NextResponse.json({ error: 'Nome já cadastrado' }, { status: 409 })
 
    const user = await createUser(name, hashPassword(password))
    const token = signToken(user.id)
    const res = NextResponse.json({ ok: true })

    res.cookies.set('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7
    })

    return res
}