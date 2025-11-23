// src/produk/produk.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProdukDto } from './dto/create-produk.dto';
import { UpdateProdukDto } from './dto/update-produk.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProdukService {
  constructor(private prisma: PrismaService) {}

  /**
   * (CREATE) Membuat produk baru
   */
  async create(createProdukDto: CreateProdukDto) {
    try {
      const newProduk = await this.prisma.produk.create({
        data: createProdukDto,
      });

      return {
        code: 201,
        status: true,
        data: newProduk,
      };
    } catch (error) {
      // Tangani jika kode_produk duplikat
      if (error.code === 'P2002') {
        throw new ConflictException('Kode produk sudah digunakan');
      }
      throw error;
    }
  }

  /**
   * (READ-ALL) Menampilkan semua produk
   */
  async findAll() {
    const produks = await this.prisma.produk.findMany();
    return {
      code: 200,
      status: true,
      data: produks,
    };
  }

  /**
   * (READ-ONE) Menampilkan satu produk
   */
  async findOne(id: number) {
    const produk = await this.prisma.produk.findUnique({
      where: { id },
    });

    if (!produk) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    return {
      code: 200,
      status: true,
      data: produk,
    };
  }

  /**
   * (UPDATE) Memperbarui produk
   */
  async update(id: number, updateProdukDto: UpdateProdukDto) {
    try {
      await this.prisma.produk.update({
        where: { id },
        data: updateProdukDto,
      });

      return {
        code: 200,
        status: true,
        data: true, // Sesuai permintaan Anda
      };
    } catch (error) {
      // Tangani jika produk yang di-update tidak ada
      if (error.code === 'P2025') {
        throw new NotFoundException('Produk tidak ditemukan');
      }
      // Tangani jika kode_produk duplikat
      if (error.code === 'P2002') {
        throw new ConflictException('Kode produk sudah digunakan');
      }
      throw error;
    }
  }

  /**
   * (DELETE) Menghapus produk
   */
  async remove(id: number) {
    try {
      await this.prisma.produk.delete({
        where: { id },
      });

      return {
        code: 200,
        status: true,
        data: true, // Sesuai permintaan Anda
      };
    } catch (error) {
      // Tangani jika produk yang dihapus tidak ada
      if (error.code === 'P2025') {
        throw new NotFoundException('Produk tidak ditemukan');
      }
      throw error;
    }
  }
}
