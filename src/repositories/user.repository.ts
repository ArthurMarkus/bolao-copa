import { db } from '@/lib/db';

export async function createUser(name: string, passwordHash: string) {
    const { rows } = await db.query('INSERT INTO users (name, password) VALUES ($1, $2) RETURNING id, name', [name, passwordHash])
    return rows[0]
}

export async function findUserByName(name: string): Promise<{ id: number, name: string } | null> {
    const { rows } = await db.query('SELECT id, name FROM users WHERE name = $1', [name])

    return rows[0] ?? null
}

export async function findUserPassword(name: string): Promise<string | null> {
    const { rows } = await db.query('SELECT password FROM users WHERE name = $1', [name])

    return rows[0]?.password ?? null
}