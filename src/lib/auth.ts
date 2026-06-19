import { createHash } from "crypto";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export function hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex')
}

const SECRET = process.env.JWT_SECRET!

export function signToken(userId: number): string {
    return jwt.sign({ userId }, SECRET, { expiresIn: '40d' })
}

export async function getSession(): Promise<{ userId: number } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value
    if (!token) return null

    try {
        return jwt.verify(token, SECRET) as { userId: number}
    } catch {
        return null
    }
}