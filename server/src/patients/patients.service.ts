import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto) {
    return this.prisma.patient.create({
      data: {
        ...createPatientDto,
        dateOfBirth: new Date(createPatientDto.dateOfBirth),
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          visits: {
            orderBy: {
              visitDate: 'desc',
            },
          },
        },
      }),
      this.prisma.patient.count(),
    ]);

    return {
      data: patients,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        visits: {
          orderBy: {
            visitDate: 'desc',
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    await this.findOne(id); // Check if patient exists

    return this.prisma.patient.update({
      where: { id },
      data: {
        ...updatePatientDto,
        dateOfBirth: updatePatientDto.dateOfBirth
          ? new Date(updatePatientDto.dateOfBirth)
          : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if patient exists

    return this.prisma.patient.delete({
      where: { id },
    });
  }

  async search(query: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where: {
          OR: [
            {
              firstName: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              phoneNumber: {
                contains: query,
              },
            },
            {
              email: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          visits: {
            orderBy: {
              visitDate: 'desc',
            },
          },
        },
      }),
      this.prisma.patient.count({
        where: {
          OR: [
            {
              firstName: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              phoneNumber: {
                contains: query,
              },
            },
            {
              email: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
      }),
    ]);

    return {
      data: patients,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        query,
      },
    };
  }

  async getPatientVisits(id: string, page = 1, limit = 10) {
    await this.findOne(id); // Check if patient exists

    const skip = (page - 1) * limit;

    const [visits, total] = await Promise.all([
      this.prisma.visit.findMany({
        where: { patientId: id },
        skip,
        take: limit,
        orderBy: {
          visitDate: 'desc',
        },
        include: {
          patient: true,
        },
      }),
      this.prisma.visit.count({
        where: { patientId: id },
      }),
    ]);

    return {
      data: visits,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
