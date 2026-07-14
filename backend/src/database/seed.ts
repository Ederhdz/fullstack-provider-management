import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../users/entities/user.entity';

async function seedUsers(userRepository: Repository<User>): Promise<void> {
  const users = [
    {
      name: 'System Administrator',
      email: 'admin@example.com',
      password:
        '$2b$10$uwIPIkJUmqOvDDgsZyks0el7hLOX1QnA.Q0DvZx91nLuc1/y4Xzxu',
      role: UserRole.ADMIN,
      createdAt: '2026-07-11 08:48:27.927',
      updatedAt: '2026-07-11 08:48:27.927',
    },
    {
      name: 'Executive User',
      email: 'executive@example.com',
      password:
        '$2b$10$7CevmMacrUdCwylLDF8QeeW/2KpHuSs7CYpI1yaRaDNiNfurcb40C',
      role: UserRole.EXECUTIVE,
      createdAt: '2026-07-11 08:49:54.821',
      updatedAt: '2026-07-11 08:49:54.821',
    },
  ];

  for (const user of users) {
    const existingUser = await userRepository.findOneBy({
      email: user.email,
    });

    if (existingUser) {
      console.log(`User already exists: ${user.email}`);
      continue;
    }

    await userRepository.query(
      `
        INSERT INTO users (
          name,
          email,
          password,
          role,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `,
      [
        user.name,
        user.email,
        user.password,
        user.role,
        user.createdAt,
        user.updatedAt,
      ],
    );

    console.log(`User created: ${user.email}`);
  }
}

async function bootstrap(): Promise<void> {
  let app: INestApplicationContext | undefined;

  try {
    app = await NestFactory.createApplicationContext(AppModule);

    const userRepository = app.get<Repository<User>>(
      getRepositoryToken(User),
    );

    await seedUsers(userRepository);

    console.log('Database seed completed successfully.');
  } catch (error) {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
  } finally {
    await app?.close();
  }
}

void bootstrap();