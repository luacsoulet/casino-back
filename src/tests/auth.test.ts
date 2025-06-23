import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth';

vi.mock('../plugins/db', () => ({
    default: {
        query: vi.fn()
    }
}));

vi.mock('bcrypt', () => ({
    default: {
        hash: vi.fn(),
        compare: vi.fn()
    },
    hash: vi.fn(),
    compare: vi.fn()
}));

vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn()
    },
    sign: vi.fn()
}));

import pool from '../plugins/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    return app;
};

describe('Routes d\'authentification', () => {
    let app: express.Application;

    beforeEach(() => {
        app = createTestApp();
        vi.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('devrait créer un utilisateur avec succès', async () => {
            (pool.query as any).mockResolvedValueOnce({ rows: [] });

            (bcrypt.hash as any).mockResolvedValueOnce('hashed-password');

            (pool.query as any).mockResolvedValueOnce({ rows: [] });

            const userData = {
                username: 'testuser',
                password: 'testpassword123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body).toEqual({
                message: 'User created successfully'
            });

            expect(pool.query).toHaveBeenCalledTimes(2);
            expect(bcrypt.hash).toHaveBeenCalledWith('testpassword123', 10);
        });

        it('devrait retourner une erreur 400 si le username est manquant', async () => {
            const userData = {
                password: 'testpassword123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body).toEqual({
                message: 'username is required',
                field: 'username'
            });

            expect(pool.query).not.toHaveBeenCalled();
        });

        it('devrait retourner une erreur 400 si le password est manquant', async () => {
            const userData = {
                username: 'testuser'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body).toEqual({
                message: 'password is required',
                field: 'password'
            });

            expect(pool.query).not.toHaveBeenCalled();
        });

        it('devrait retourner une erreur 400 si l\'utilisateur existe déjà', async () => {
            (pool.query as any).mockResolvedValueOnce({
                rows: [{ id: 1, username: 'testuser' }]
            });

            const userData = {
                username: 'testuser',
                password: 'testpassword123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body.message).toBe('A user with this username already exists');
            expect(pool.query).toHaveBeenCalledTimes(1);
            expect(bcrypt.hash).not.toHaveBeenCalled();
        });

        it('devrait gérer les erreurs de base de données', async () => {
            (pool.query as any).mockRejectedValueOnce(new Error('Database error'));

            const userData = {
                username: 'testuser',
                password: 'testpassword123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(500);

            expect(response.body.message).toBe('Error while creating the user');
            expect(response.body.error).toBe('Database error');
        });
    });

    describe('POST /api/auth/login', () => {
        it('devrait connecter un utilisateur avec succès', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                password_hash: 'hashed-password',
                virtual_balance: 1000,
                is_admin: false
            };

            (pool.query as any).mockResolvedValueOnce({ rows: [mockUser] });

            (bcrypt.compare as any).mockResolvedValueOnce(true);

            (jwt.sign as any).mockReturnValueOnce('fake-jwt-token');

            const loginData = {
                username: 'testuser',
                password: 'testpassword123'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(200);

            expect(response.body).toEqual({
                token: 'fake-jwt-token',
                user: {
                    id: 1,
                    username: 'testuser',
                    virtual_balance: 1000,
                    isAdmin: false
                }
            });

            expect(pool.query).toHaveBeenCalledTimes(1);
            expect(bcrypt.compare).toHaveBeenCalledWith('testpassword123', 'hashed-password');
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: 1, isAdmin: false },
                'test-jwt-secret-key-for-testing',
                { expiresIn: '1h' }
            );
        });

        it('devrait retourner une erreur 400 si le username est manquant', async () => {
            const loginData = {
                password: 'testpassword123'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(400);

            expect(response.body).toEqual({
                message: 'username is required',
                field: 'username'
            });

            expect(pool.query).not.toHaveBeenCalled();
        });

        it('devrait retourner une erreur 400 si le password est manquant', async () => {
            const loginData = {
                username: 'testuser'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(400);

            expect(response.body).toEqual({
                message: 'password is required',
                field: 'password'
            });

            expect(pool.query).not.toHaveBeenCalled();
        });

        it('devrait retourner une erreur 401 si l\'utilisateur n\'existe pas', async () => {
            (pool.query as any).mockResolvedValueOnce({ rows: [] });

            const loginData = {
                username: 'nonexistent',
                password: 'testpassword123'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.message).toBe('Username or password incorrect');
            expect(pool.query).toHaveBeenCalledTimes(1);
            expect(bcrypt.compare).not.toHaveBeenCalled();
        });

        it('devrait retourner une erreur 401 si le mot de passe est incorrect', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                password_hash: 'hashed-password',
                virtual_balance: 1000,
                is_admin: false
            };

            (pool.query as any).mockResolvedValueOnce({ rows: [mockUser] });

            (bcrypt.compare as any).mockResolvedValueOnce(false);

            const loginData = {
                username: 'testuser',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.message).toBe('Username or password incorrect');
            expect(pool.query).toHaveBeenCalledTimes(1);
            expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashed-password');
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('devrait gérer les erreurs de base de données lors du login', async () => {
            (pool.query as any).mockRejectedValueOnce(new Error('Database connection failed'));

            const loginData = {
                username: 'testuser',
                password: 'testpassword123'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(500);

            expect(response.body.message).toBe('Error while logging in');
            expect(response.body.error).toBe('Database connection failed');
        });

        it('devrait retourner la structure correcte pour un utilisateur admin', async () => {
            const mockAdminUser = {
                id: 2,
                username: 'admin',
                password_hash: 'hashed-admin-password',
                virtual_balance: 5000,
                is_admin: true
            };

            (pool.query as any).mockResolvedValueOnce({ rows: [mockAdminUser] });

            (bcrypt.compare as any).mockResolvedValueOnce(true);

            (jwt.sign as any).mockReturnValueOnce('admin-jwt-token');

            const loginData = {
                username: 'admin',
                password: 'adminpassword'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(200);

            expect(response.body).toEqual({
                token: 'admin-jwt-token',
                user: {
                    id: 2,
                    username: 'admin',
                    virtual_balance: 5000,
                    isAdmin: true
                }
            });

            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: 2, isAdmin: true },
                'test-jwt-secret-key-for-testing',
                { expiresIn: '1h' }
            );
        });
    });

    describe('Validation des types de données', () => {
        it('devrait accepter des données JSON valides pour register', async () => {
            (pool.query as any).mockResolvedValueOnce({ rows: [] });
            (bcrypt.hash as any).mockResolvedValueOnce('hashed-password');
            (pool.query as any).mockResolvedValueOnce({ rows: [] });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'validuser',
                    password: 'validpassword123'
                })
                .expect(201);

            expect(response.headers['content-type']).toMatch(/json/);
        });

        it('devrait accepter des données JSON valides pour login', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                password_hash: 'hashed-password',
                virtual_balance: 1000,
                is_admin: false
            };

            (pool.query as any).mockResolvedValueOnce({ rows: [mockUser] });
            (bcrypt.compare as any).mockResolvedValueOnce(true);
            (jwt.sign as any).mockReturnValueOnce('fake-jwt-token');

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'testuser',
                    password: 'testpassword123'
                })
                .expect(200);

            expect(response.headers['content-type']).toMatch(/json/);
            expect(typeof response.body.token).toBe('string');
            expect(typeof response.body.user.id).toBe('number');
            expect(typeof response.body.user.username).toBe('string');
            expect(typeof response.body.user.virtual_balance).toBe('number');
            expect(typeof response.body.user.isAdmin).toBe('boolean');
        });
    });
}); 