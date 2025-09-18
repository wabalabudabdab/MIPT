import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitDto, VisitStatus } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

@Injectable()
export class VisitsService {
  constructor(private prisma: PrismaService) {}

  async create(createVisitDto: CreateVisitDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: createVisitDto.patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${createVisitDto.patientId} not found`);
    }

    return this.prisma.visit.create({
      data: {
        ...createVisitDto,
        visitDate: new Date(createVisitDto.visitDate),
      },
      include: {
        patient: true,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    status?: VisitStatus,
    startDate?: string,
    endDate?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.visitDate = {};
      if (startDate) {
        where.visitDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.visitDate.lte = new Date(endDate);
      }
    }

    const [visits, total] = await Promise.all([
      this.prisma.visit.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          visitDate: 'desc',
        },
        include: {
          patient: true,
        },
      }),
      this.prisma.visit.count({ where }),
    ]);

    return {
      data: visits,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        filters: {
          status,
          startDate,
          endDate,
        },
      },
    };
  }

  async findOne(id: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
      include: {
        patient: true,
      },
    });

    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }

    return visit;
  }

  async update(id: string, updateVisitDto: UpdateVisitDto) {
    await this.findOne(id); 

    if (updateVisitDto.patientId) {
      const patient = await this.prisma.patient.findUnique({
        where: { id: updateVisitDto.patientId },
      });

      if (!patient) {
        throw new NotFoundException(`Patient with ID ${updateVisitDto.patientId} not found`);
      }
    }

    return this.prisma.visit.update({
      where: { id },
      data: {
        ...updateVisitDto,
        visitDate: updateVisitDto.visitDate
          ? new Date(updateVisitDto.visitDate)
          : undefined,
      },
      include: {
        patient: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.visit.delete({
      where: { id },
    });
  }

  async getVisitsByDateRange(startDate: string, endDate: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [visits, total] = await Promise.all([
      this.prisma.visit.findMany({
        where: {
          visitDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        skip,
        take: limit,
        orderBy: {
          visitDate: 'asc',
        },
        include: {
          patient: true,
        },
      }),
      this.prisma.visit.count({
        where: {
          visitDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      }),
    ]);

    return {
      data: visits,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        dateRange: {
          startDate,
          endDate,
        },
      },
    };
  }

  async getVisitsByStatus(status: VisitStatus, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [visits, total] = await Promise.all([
      this.prisma.visit.findMany({
        where: { status },
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
        where: { status },
      }),
    ]);

    return {
      data: visits,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        status,
      },
    };
  }
}
